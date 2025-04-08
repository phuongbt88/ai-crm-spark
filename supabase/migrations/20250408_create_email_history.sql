
-- Create email history table
CREATE TABLE IF NOT EXISTS public.email_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  direction TEXT NOT NULL, -- 'sent' or 'received'
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  reply_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Create policy for all access (simplifying for demo purposes)
CREATE POLICY "Allow all access to email_history"
  ON public.email_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
