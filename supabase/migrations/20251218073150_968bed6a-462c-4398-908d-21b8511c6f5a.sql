-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'admin', 'nurse')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  contact TEXT,
  email TEXT,
  address TEXT,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_records table for storing patient health data
CREATE TABLE public.health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  glucose_level NUMERIC,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  bmi NUMERIC,
  hba1c NUMERIC,
  insulin_level NUMERIC,
  skin_thickness NUMERIC,
  pregnancies INTEGER DEFAULT 0,
  diabetes_pedigree NUMERIC,
  age INTEGER,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_diagnoses table for storing AI diagnosis results
CREATE TABLE public.ai_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  health_record_id UUID REFERENCES public.health_records(id) ON DELETE SET NULL,
  diagnosed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  risk_score NUMERIC NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  prediction TEXT NOT NULL,
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 100),
  feature_importance JSONB,
  recommendations TEXT[],
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for health alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Patients policies (authenticated users can manage patients)
CREATE POLICY "Authenticated users can view patients" ON public.patients
  FOR SELECT TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can create patients" ON public.patients
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
  
CREATE POLICY "Users can update patients they created" ON public.patients
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);
  
CREATE POLICY "Users can delete patients they created" ON public.patients
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Health records policies
CREATE POLICY "Authenticated users can view health records" ON public.health_records
  FOR SELECT TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can create health records" ON public.health_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = recorded_by);
  
CREATE POLICY "Users can update records they created" ON public.health_records
  FOR UPDATE TO authenticated USING (auth.uid() = recorded_by);

-- AI diagnoses policies
CREATE POLICY "Authenticated users can view diagnoses" ON public.ai_diagnoses
  FOR SELECT TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can create diagnoses" ON public.ai_diagnoses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = diagnosed_by);

-- Alerts policies
CREATE POLICY "Authenticated users can view alerts" ON public.alerts
  FOR SELECT TO authenticated USING (true);
  
CREATE POLICY "Authenticated users can create alerts" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
  
CREATE POLICY "Authenticated users can update alerts" ON public.alerts
  FOR UPDATE TO authenticated USING (true);

-- Create trigger for automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;