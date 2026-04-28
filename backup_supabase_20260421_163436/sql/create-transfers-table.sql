CREATE TABLE IF NOT EXISTS public.transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin TEXT NOT NULL CHECK (origin IN ('Recife', 'Salvador')),
    destination TEXT NOT NULL CHECK (destination IN ('Recife', 'Salvador')),
    items JSONB NOT NULL, -- Array of { product_id: string, name: string, quantity: number }
    total_items INTEGER NOT NULL,
    status TEXT DEFAULT 'Concluído' CHECK (status IN ('Pendente', 'Concluído', 'Cancelado')),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Enable public access policies (matching project pattern)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.transfers;
    DROP POLICY IF EXISTS "Enable insert access for all users" ON public.transfers;
    DROP POLICY IF EXISTS "Enable update access for all users" ON public.transfers;
    DROP POLICY IF EXISTS "Enable delete access for all users" ON public.transfers;
END $$;

CREATE POLICY "Enable read access for all users" ON public.transfers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.transfers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.transfers FOR DELETE USING (true);
