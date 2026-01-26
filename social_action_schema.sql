-- Create Social Action Table
CREATE TABLE public.social_action (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    place TEXT,
    acceptance_letter BOOLEAN DEFAULT FALSE,
    unit1_hours DECIMAL(5,2) DEFAULT 0,
    unit2_hours DECIMAL(5,2) DEFAULT 0,
    unit3_hours DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- Enable RLS
ALTER TABLE public.social_action ENABLE ROW LEVEL SECURITY;

-- Allow all for testing
CREATE POLICY "Public Access" ON public.social_action FOR ALL USING (true) WITH CHECK (true);
