
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Create pet_images table for gallery
CREATE TABLE public.pet_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
    lost_report_id UUID REFERENCES public.lost_reports(id) ON DELETE CASCADE,
    found_report_id UUID REFERENCES public.found_reports(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pet_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pet images" ON public.pet_images
FOR SELECT USING (true);

CREATE POLICY "Users can manage own pet images" ON public.pet_images
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.pets WHERE id = pet_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.lost_reports WHERE id = lost_report_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.found_reports WHERE id = found_report_id AND user_id = auth.uid())
);

-- Create pet_matches table
CREATE TABLE public.pet_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_report_id UUID REFERENCES public.lost_reports(id) ON DELETE CASCADE NOT NULL,
    found_report_id UUID REFERENCES public.found_reports(id) ON DELETE CASCADE NOT NULL,
    match_score INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (lost_report_id, found_report_id)
);

ALTER TABLE public.pet_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches" ON public.pet_matches
FOR SELECT USING (true);

CREATE POLICY "System can manage matches" ON public.pet_matches
FOR ALL WITH CHECK (true);

-- Create search_history table
CREATE TABLE public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    search_query TEXT NOT NULL,
    filters JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own search history" ON public.search_history
FOR ALL USING (auth.uid() = user_id);

-- Create messages table for chat
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON public.messages
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to auto-match pets
CREATE OR REPLACE FUNCTION public.find_pet_matches()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- When a new found report is created, match with lost reports
    IF TG_TABLE_NAME = 'found_reports' THEN
        INSERT INTO public.pet_matches (lost_report_id, found_report_id, match_score)
        SELECT 
            lr.id,
            NEW.id,
            CASE 
                WHEN lr.pet_type = NEW.pet_type THEN 50
                ELSE 0
            END +
            CASE 
                WHEN LOWER(lr.last_seen_location) LIKE '%' || LOWER(NEW.found_location) || '%' 
                     OR LOWER(NEW.found_location) LIKE '%' || LOWER(lr.last_seen_location) || '%' THEN 30
                ELSE 0
            END +
            CASE 
                WHEN ABS(lr.last_seen_date - NEW.found_date) <= 7 THEN 20
                ELSE 0
            END
        FROM public.lost_reports lr
        WHERE lr.status = 'active'
        AND lr.pet_type = NEW.pet_type
        ON CONFLICT (lost_report_id, found_report_id) DO UPDATE SET match_score = EXCLUDED.match_score;
        
        -- Create notifications for potential matches
        INSERT INTO public.notifications (user_id, title, message, type, link)
        SELECT 
            lr.user_id,
            'Potential Match Found!',
            'A found pet matching your lost ' || lr.pet_name || ' has been reported.',
            'match',
            '/found-pets'
        FROM public.lost_reports lr
        WHERE lr.status = 'active'
        AND lr.pet_type = NEW.pet_type;
    END IF;
    
    -- When a new lost report is created, match with found reports
    IF TG_TABLE_NAME = 'lost_reports' THEN
        INSERT INTO public.pet_matches (lost_report_id, found_report_id, match_score)
        SELECT 
            NEW.id,
            fr.id,
            CASE 
                WHEN fr.pet_type = NEW.pet_type THEN 50
                ELSE 0
            END +
            CASE 
                WHEN LOWER(fr.found_location) LIKE '%' || LOWER(NEW.last_seen_location) || '%'
                     OR LOWER(NEW.last_seen_location) LIKE '%' || LOWER(fr.found_location) || '%' THEN 30
                ELSE 0
            END +
            CASE 
                WHEN ABS(fr.found_date - NEW.last_seen_date) <= 7 THEN 20
                ELSE 0
            END
        FROM public.found_reports fr
        WHERE fr.status = 'active'
        AND fr.pet_type = NEW.pet_type
        ON CONFLICT (lost_report_id, found_report_id) DO UPDATE SET match_score = EXCLUDED.match_score;
        
        -- Create notifications for potential matches
        INSERT INTO public.notifications (user_id, title, message, type, link)
        SELECT 
            fr.user_id,
            'Potential Match Found!',
            'A lost pet matching the ' || NEW.pet_type || ' you found has been reported.',
            'match',
            '/lost-pets'
        FROM public.found_reports fr
        WHERE fr.status = 'active'
        AND fr.pet_type = NEW.pet_type;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create triggers for auto-matching
CREATE TRIGGER trigger_match_found_reports
AFTER INSERT ON public.found_reports
FOR EACH ROW EXECUTE FUNCTION public.find_pet_matches();

CREATE TRIGGER trigger_match_lost_reports
AFTER INSERT ON public.lost_reports
FOR EACH ROW EXECUTE FUNCTION public.find_pet_matches();

-- Add indexes for better performance
CREATE INDEX idx_lost_reports_pet_type ON public.lost_reports(pet_type);
CREATE INDEX idx_found_reports_pet_type ON public.found_reports(pet_type);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_pet_matches_score ON public.pet_matches(match_score DESC);
