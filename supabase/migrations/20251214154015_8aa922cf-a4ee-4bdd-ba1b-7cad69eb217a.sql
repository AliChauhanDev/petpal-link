-- Drop existing tables and start fresh
DROP TRIGGER IF EXISTS trigger_match_found_reports ON public.found_reports;
DROP TRIGGER IF EXISTS trigger_match_lost_reports ON public.lost_reports;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_pets_updated_at ON public.pets;

DROP TABLE IF EXISTS public.pet_images CASCADE;
DROP TABLE IF EXISTS public.pet_matches CASCADE;
DROP TABLE IF EXISTS public.search_history CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.found_reports CASCADE;
DROP TABLE IF EXISTS public.lost_reports CASCADE;
DROP TABLE IF EXISTS public.pets CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.find_pet_matches() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.pet_type CASCADE;

-- Create new enum types
CREATE TYPE public.app_role AS ENUM ('user', 'seller', 'admin');
CREATE TYPE public.pet_type AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'reptile', 'other');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.report_status AS ENUM ('active', 'resolved', 'expired');

-- 1. Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Product categories
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    pet_type pet_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 4. Seller stores
CREATE TABLE public.seller_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    store_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    address TEXT,
    city TEXT,
    phone TEXT,
    email TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.seller_stores(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    pet_type pet_type,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. Shopping cart
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, product_id)
);

-- 7. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES public.seller_stores(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 8. Order items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 9. Pet care guides
CREATE TABLE public.pet_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pet_type pet_type NOT NULL,
    gender TEXT,
    age_group TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Pet diseases info
CREATE TABLE public.pet_diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    pet_type pet_type NOT NULL,
    symptoms TEXT[] DEFAULT '{}',
    prevention TEXT,
    when_to_seek_help TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 11. Pet love info
CREATE TABLE public.pet_love (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_type pet_type NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 12. Pets info (which to keep/not keep)
CREATE TABLE public.pets_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_name TEXT NOT NULL,
    can_keep BOOLEAN NOT NULL,
    reason TEXT,
    legal_notes TEXT,
    ethical_notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 13. Lost pet reports
CREATE TABLE public.lost_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pet_name TEXT NOT NULL,
    pet_type pet_type NOT NULL,
    breed TEXT,
    color TEXT,
    age TEXT,
    description TEXT,
    last_seen_location TEXT NOT NULL,
    last_seen_date DATE NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    reward TEXT,
    images TEXT[] DEFAULT '{}',
    status report_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 14. Found pet reports
CREATE TABLE public.found_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pet_type pet_type NOT NULL,
    breed TEXT,
    color TEXT,
    description TEXT,
    found_location TEXT NOT NULL,
    found_date DATE NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    images TEXT[] DEFAULT '{}',
    status report_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 15. Pet matches
CREATE TABLE public.pet_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_report_id UUID REFERENCES public.lost_reports(id) ON DELETE CASCADE NOT NULL,
    found_report_id UUID REFERENCES public.found_reports(id) ON DELETE CASCADE NOT NULL,
    match_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (lost_report_id, found_report_id)
);

-- 16. Shared experiences
CREATE TABLE public.shared_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pet_type pet_type,
    images TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 17. Experience likes
CREATE TABLE public.experience_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    experience_id UUID REFERENCES public.shared_experiences(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, experience_id)
);

-- 18. AI chat history
CREATE TABLE public.ai_chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 19. Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_love ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create has_role function
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

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_stores_updated_at BEFORE UPDATE ON public.seller_stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lost_reports_updated_at BEFORE UPDATE ON public.lost_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_found_reports_updated_at BEFORE UPDATE ON public.found_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shared_experiences_updated_at BEFORE UPDATE ON public.shared_experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Product categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.product_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Seller stores
CREATE POLICY "Anyone can view active stores" ON public.seller_stores FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage own store" ON public.seller_stores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all stores" ON public.seller_stores FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Products
CREATE POLICY "Anyone can view approved active products" ON public.products FOR SELECT USING (is_active = true AND is_approved = true);
CREATE POLICY "Sellers can view own products" ON public.products FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = store_id AND user_id = auth.uid())
);
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = store_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Cart items
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers can view store orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = store_id AND user_id = auth.uid())
);
CREATE POLICY "Sellers can update store orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.seller_stores WHERE id = store_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Order items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Sellers can view store order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.seller_stores s ON o.store_id = s.id WHERE o.id = order_id AND s.user_id = auth.uid())
);

-- Pet care content (public read)
CREATE POLICY "Anyone can view pet guides" ON public.pet_guides FOR SELECT USING (true);
CREATE POLICY "Admins can manage pet guides" ON public.pet_guides FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view pet diseases" ON public.pet_diseases FOR SELECT USING (true);
CREATE POLICY "Admins can manage pet diseases" ON public.pet_diseases FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view pet love" ON public.pet_love FOR SELECT USING (true);
CREATE POLICY "Admins can manage pet love" ON public.pet_love FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view pets info" ON public.pets_info FOR SELECT USING (true);
CREATE POLICY "Admins can manage pets info" ON public.pets_info FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Lost reports
CREATE POLICY "Anyone can view active lost reports" ON public.lost_reports FOR SELECT USING (true);
CREATE POLICY "Users can create lost reports" ON public.lost_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lost reports" ON public.lost_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lost reports" ON public.lost_reports FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all lost reports" ON public.lost_reports FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Found reports
CREATE POLICY "Anyone can view active found reports" ON public.found_reports FOR SELECT USING (true);
CREATE POLICY "Users can create found reports" ON public.found_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own found reports" ON public.found_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own found reports" ON public.found_reports FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all found reports" ON public.found_reports FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Pet matches
CREATE POLICY "Users can view own matches" ON public.pet_matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.lost_reports WHERE id = lost_report_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.found_reports WHERE id = found_report_id AND user_id = auth.uid())
);
CREATE POLICY "System can create matches" ON public.pet_matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all matches" ON public.pet_matches FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Shared experiences
CREATE POLICY "Anyone can view experiences" ON public.shared_experiences FOR SELECT USING (true);
CREATE POLICY "Users can create experiences" ON public.shared_experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiences" ON public.shared_experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiences" ON public.shared_experiences FOR DELETE USING (auth.uid() = user_id);

-- Experience likes
CREATE POLICY "Anyone can view likes" ON public.experience_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON public.experience_likes FOR ALL USING (auth.uid() = user_id);

-- AI chat history
CREATE POLICY "Users can manage own chat history" ON public.ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create pet matching function
CREATE OR REPLACE FUNCTION public.find_pet_matches()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_TABLE_NAME = 'found_reports' THEN
        INSERT INTO public.pet_matches (lost_report_id, found_report_id, match_score)
        SELECT 
            lr.id,
            NEW.id,
            CASE WHEN lr.pet_type = NEW.pet_type THEN 50 ELSE 0 END +
            CASE WHEN LOWER(lr.last_seen_location) LIKE '%' || LOWER(NEW.found_location) || '%' OR LOWER(NEW.found_location) LIKE '%' || LOWER(lr.last_seen_location) || '%' THEN 30 ELSE 0 END +
            CASE WHEN ABS(lr.last_seen_date - NEW.found_date) <= 7 THEN 20 ELSE 0 END
        FROM public.lost_reports lr
        WHERE lr.status = 'active' AND lr.pet_type = NEW.pet_type
        ON CONFLICT (lost_report_id, found_report_id) DO UPDATE SET match_score = EXCLUDED.match_score;
    END IF;
    
    IF TG_TABLE_NAME = 'lost_reports' THEN
        INSERT INTO public.pet_matches (lost_report_id, found_report_id, match_score)
        SELECT 
            NEW.id,
            fr.id,
            CASE WHEN fr.pet_type = NEW.pet_type THEN 50 ELSE 0 END +
            CASE WHEN LOWER(fr.found_location) LIKE '%' || LOWER(NEW.last_seen_location) || '%' OR LOWER(NEW.last_seen_location) LIKE '%' || LOWER(fr.found_location) || '%' THEN 30 ELSE 0 END +
            CASE WHEN ABS(fr.found_date - NEW.last_seen_date) <= 7 THEN 20 ELSE 0 END
        FROM public.found_reports fr
        WHERE fr.status = 'active' AND fr.pet_type = NEW.pet_type
        ON CONFLICT (lost_report_id, found_report_id) DO UPDATE SET match_score = EXCLUDED.match_score;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create matching triggers
CREATE TRIGGER trigger_match_found_reports AFTER INSERT ON public.found_reports FOR EACH ROW EXECUTE FUNCTION public.find_pet_matches();
CREATE TRIGGER trigger_match_lost_reports AFTER INSERT ON public.lost_reports FOR EACH ROW EXECUTE FUNCTION public.find_pet_matches();

-- Insert default categories
INSERT INTO public.product_categories (name, description, icon, pet_type) VALUES
('Food & Treats', 'Pet food, treats, and dietary supplements', 'Utensils', 'dog'),
('Food & Treats', 'Pet food, treats, and dietary supplements', 'Utensils', 'cat'),
('Toys & Play', 'Interactive toys and play equipment', 'Gamepad2', 'dog'),
('Toys & Play', 'Interactive toys and play equipment', 'Gamepad2', 'cat'),
('Health & Wellness', 'Vitamins, supplements, and health products', 'Heart', NULL),
('Grooming', 'Shampoos, brushes, and grooming tools', 'Scissors', NULL),
('Accessories', 'Collars, leashes, and clothing', 'Tag', NULL),
('Beds & Furniture', 'Beds, houses, and pet furniture', 'Home', NULL),
('Training', 'Training aids and equipment', 'GraduationCap', NULL),
('Travel', 'Carriers, crates, and travel accessories', 'Plane', NULL);

-- Insert sample pet guides
INSERT INTO public.pet_guides (title, content, pet_type, gender, age_group, category) VALUES
('Puppy Nutrition Basics', 'Puppies need high-quality protein for muscle development. Feed 3-4 small meals daily until 6 months, then transition to 2 meals. Always provide fresh water.', 'dog', NULL, 'puppy', 'nutrition'),
('Adult Dog Exercise', 'Adult dogs need 30-60 minutes of exercise daily. Mix walks with play sessions. Mental stimulation is equally important.', 'dog', NULL, 'adult', 'exercise'),
('Senior Dog Care', 'Senior dogs need gentle exercise, joint supplements, and regular vet checkups. Adjust diet for lower metabolism.', 'dog', NULL, 'senior', 'health'),
('Kitten Socialization', 'Socialize kittens early with gentle handling. Introduce to various sounds and experiences gradually.', 'cat', NULL, 'kitten', 'behavior'),
('Cat Dental Care', 'Brush cats teeth weekly. Dental treats help maintain oral health. Schedule annual dental checkups.', 'cat', NULL, 'adult', 'health');

-- Insert sample pet diseases
INSERT INTO public.pet_diseases (name, pet_type, symptoms, prevention, when_to_seek_help) VALUES
('Canine Parvovirus', 'dog', ARRAY['Severe vomiting', 'Bloody diarrhea', 'Lethargy', 'Loss of appetite', 'Fever'], 'Vaccinate puppies starting at 6-8 weeks. Keep unvaccinated puppies away from other dogs.', 'Seek immediate veterinary care if symptoms appear. This is a life-threatening condition.'),
('Feline Upper Respiratory Infection', 'cat', ARRAY['Sneezing', 'Runny nose', 'Watery eyes', 'Loss of appetite', 'Fever'], 'Keep cats indoors. Vaccinate against common causes. Reduce stress.', 'If symptoms persist beyond 7 days or breathing becomes difficult.'),
('Hip Dysplasia', 'dog', ARRAY['Limping', 'Difficulty rising', 'Reluctance to jump', 'Decreased activity', 'Pain'], 'Maintain healthy weight. Avoid excessive exercise in puppies. Choose breeders who screen for this.', 'When mobility is significantly affected or pain is evident.');

-- Insert sample pet love info
INSERT INTO public.pet_love (pet_type, category, title, description, icon) VALUES
('dog', 'food', 'Meat-Based Proteins', 'Dogs love chicken, beef, and fish. High-quality protein is essential for their health.', 'Drumstick'),
('dog', 'activity', 'Daily Walks', 'Regular walks provide exercise and mental stimulation through new scents.', 'MapPin'),
('dog', 'emotional', 'Quality Time', 'Dogs thrive on companionship and attention from their owners.', 'Heart'),
('cat', 'food', 'Fresh Water', 'Cats prefer fresh, running water. Consider a pet fountain.', 'Droplet'),
('cat', 'activity', 'Climbing Spaces', 'Cats love vertical spaces. Cat trees satisfy their climbing instincts.', 'ArrowUp'),
('cat', 'emotional', 'Safe Hiding Spots', 'Cats need quiet places to retreat and feel secure.', 'Home');

-- Insert pets info
INSERT INTO public.pets_info (animal_name, can_keep, reason, legal_notes, ethical_notes) VALUES
('Dogs', true, 'Domesticated for thousands of years, bred for companionship', 'Generally legal with breed-specific restrictions in some areas', 'Ensure adequate space, exercise, and socialization'),
('Cats', true, 'Independent yet affectionate, suitable for various living situations', 'Legal in most areas with some landlord restrictions', 'Keep indoors to protect wildlife and cat health'),
('Rabbits', true, 'Social and gentle, can be litter trained', 'Legal in most areas', 'Need space to hop and socialize with humans daily'),
('Fish', true, 'Low maintenance, calming to observe', 'Legal everywhere', 'Research specific species needs for tank size and water conditions'),
('Wild Birds', false, 'Belong in their natural habitat', 'Illegal to keep most wild bird species', 'Capturing disrupts ecosystems and causes stress'),
('Exotic Big Cats', false, 'Dangerous predators with complex needs', 'Illegal in most jurisdictions', 'Cannot provide adequate care in domestic settings'),
('Primates', false, 'Highly intelligent with complex social needs', 'Illegal in many areas', 'Suffer psychological harm in captivity');