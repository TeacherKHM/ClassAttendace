-- Add preceptor column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS preceptor TEXT;

-- Optional: Update enum types if you want strict enforcement at DB level
-- For now, we will handle enforcement in the UI as requested.
