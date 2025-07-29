-- Crear tabla principal de prospectos
CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  first_contact_date DATE NOT NULL,
  assigned_to TEXT NOT NULL,
  current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
  stage_progress JSONB DEFAULT '{}',
  is_lost BOOLEAN DEFAULT FALSE,
  lost_reason TEXT,
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  estimated_value DECIMAL(10,2),
  expected_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_action TEXT,
  next_step TEXT,
  tags TEXT[]
);

-- Crear tabla de archivos adjuntos
CREATE TABLE public.prospect_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de actividades/historial
CREATE TABLE public.prospect_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  stage INTEGER,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_activities ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para prospects
CREATE POLICY "Users can view all prospects" 
ON public.prospects 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create prospects" 
ON public.prospects 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update prospects" 
ON public.prospects 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Users can delete prospects" 
ON public.prospects 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas RLS para prospect_files
CREATE POLICY "Users can view all prospect files" 
ON public.prospect_files 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create prospect files" 
ON public.prospect_files 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update prospect files" 
ON public.prospect_files 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Users can delete prospect files" 
ON public.prospect_files 
FOR DELETE 
TO authenticated
USING (true);

-- Políticas RLS para prospect_activities
CREATE POLICY "Users can view all prospect activities" 
ON public.prospect_activities 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create prospect activities" 
ON public.prospect_activities 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update prospect activities" 
ON public.prospect_activities 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Users can delete prospect activities" 
ON public.prospect_activities 
FOR DELETE 
TO authenticated
USING (true);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at en prospects
CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON public.prospects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Crear bucket de storage para archivos de prospectos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prospect-files', 'prospect-files', false);

-- Políticas de storage para archivos de prospectos
CREATE POLICY "Users can view prospect files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'prospect-files');

CREATE POLICY "Users can upload prospect files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'prospect-files');

CREATE POLICY "Users can update prospect files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'prospect-files');

CREATE POLICY "Users can delete prospect files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'prospect-files');