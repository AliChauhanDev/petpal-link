
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create pet types enum
CREATE TYPE public.pet_type AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'other');

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  pet_type pet_type NOT NULL DEFAULT 'dog',
  breed TEXT,
  age TEXT,
  description TEXT,
  image_url TEXT,
  color TEXT,
  gender TEXT,
  is_lost BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lost_reports table
CREATE TABLE public.lost_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  pet_type pet_type NOT NULL,
  description TEXT,
  last_seen_location TEXT NOT NULL,
  last_seen_date DATE NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'found', 'closed')),
  reward TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create found_reports table
CREATE TABLE public.found_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_name TEXT,
  pet_type pet_type NOT NULL,
  description TEXT,
  found_location TEXT NOT NULL,
  found_date DATE NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pets policies
CREATE POLICY "Users can view all pets" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Users can insert own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

-- Lost reports policies
CREATE POLICY "Anyone can view lost reports" ON public.lost_reports FOR SELECT USING (true);
CREATE POLICY "Users can insert own lost reports" ON public.lost_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lost reports" ON public.lost_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lost reports" ON public.lost_reports FOR DELETE USING (auth.uid() = user_id);

-- Found reports policies
CREATE POLICY "Anyone can view found reports" ON public.found_reports FOR SELECT USING (true);
CREATE POLICY "Users can insert own found reports" ON public.found_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own found reports" ON public.found_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own found reports" ON public.found_reports FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lost_reports_updated_at BEFORE UPDATE ON public.lost_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_found_reports_updated_at BEFORE UPDATE ON public.found_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', true);

-- Storage policies
CREATE POLICY "Anyone can view pet images" ON storage.objects FOR SELECT USING (bucket_id = 'pet-images');
CREATE POLICY "Authenticated users can upload pet images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pet-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own pet images" ON storage.objects FOR UPDATE USING (bucket_id = 'pet-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own pet images" ON storage.objects FOR DELETE USING (bucket_id = 'pet-images' AND auth.role() = 'authenticated');
