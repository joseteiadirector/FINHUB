-- Create referrals table to track who referred whom
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referred_user_id)
);

-- Add referral_code to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referred_by UUID REFERENCES auth.users(id);

-- Enable RLS on referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals
CREATE POLICY "Users can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = referrer_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8 character code
    code := substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Function to automatically generate referral code for new users
CREATE OR REPLACE FUNCTION public.generate_user_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate referral code if not already set
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to generate referral code on profile insert
CREATE TRIGGER on_profile_created_generate_referral
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_user_referral_code();

-- Create view for referral stats
CREATE OR REPLACE VIEW public.referral_stats AS
SELECT 
  p.id as user_id,
  p.referral_code,
  COUNT(r.id) as referral_count,
  CASE 
    WHEN COUNT(r.id) >= 51 THEN 'diamond'
    WHEN COUNT(r.id) >= 31 THEN 'platinum'
    WHEN COUNT(r.id) >= 16 THEN 'gold'
    WHEN COUNT(r.id) >= 6 THEN 'silver'
    WHEN COUNT(r.id) >= 1 THEN 'bronze'
    ELSE 'none'
  END as badge_level
FROM public.profiles p
LEFT JOIN public.referrals r ON p.id = r.referrer_id
GROUP BY p.id, p.referral_code;