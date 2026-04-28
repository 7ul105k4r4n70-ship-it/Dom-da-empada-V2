CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    plate TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    photo_url TEXT,
    current_km INTEGER DEFAULT 0,
    next_oil_change_km INTEGER,
    oil_change_interval INTEGER DEFAULT 10000,
    next_revision_km INTEGER,
    revision_interval INTEGER DEFAULT 20000,
    region TEXT NOT NULL CHECK (region IN ('Recife', 'Salvador')),
    status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Manutenção', 'Inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Enable public access policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.vehicles;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON public.vehicles;
    DROP POLICY IF EXISTS "Enable update access for all users" ON public.vehicles;
    DROP POLICY IF EXISTS "Enable delete access for all users" ON public.vehicles;
END $$;

CREATE POLICY "Enable read access for all users" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.vehicles FOR DELETE USING (true);
