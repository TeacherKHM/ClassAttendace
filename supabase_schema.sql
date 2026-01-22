-- 1. Create Students Table
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    classroom TEXT,
    workshop TEXT,
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Attendance Table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    UNIQUE(date, student_id)
);

-- 3. Create Preceptoria Table
CREATE TABLE public.preceptoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL, -- 'Student' or 'Family'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
-- For development/testing, you can disable RLS or add policies.
-- Here we add simple policies for public access (make sure to restrict this in production!)

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preceptoria ENABLE ROW LEVEL SECURITY;

-- Allow all for testing (since we are using the anon key)
CREATE POLICY "Public Access" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.preceptoria FOR ALL USING (true) WITH CHECK (true);
