-- Add observations column to orders table
-- This stores franchisee notes from V3 app

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS observations text;
