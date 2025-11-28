-- Function to process referral when a new user signs up
CREATE OR REPLACE FUNCTION public.process_referral_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_code_from_signup TEXT;
  referrer_user_id UUID;
BEGIN
  -- Get referral code from user metadata
  referral_code_from_signup := NEW.raw_user_meta_data->>'referral_code';
  
  -- If there's a referral code, process it
  IF referral_code_from_signup IS NOT NULL THEN
    -- Find the referrer by their referral code
    SELECT id INTO referrer_user_id
    FROM public.profiles
    WHERE referral_code = referral_code_from_signup;
    
    -- If referrer found, create the referral record
    IF referrer_user_id IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_user_id)
      VALUES (referrer_user_id, NEW.id)
      ON CONFLICT (referred_user_id) DO NOTHING;
      
      -- Update the referred_by field in the new user's profile
      UPDATE public.profiles
      SET referred_by = referrer_user_id
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to process referral after profile is created
CREATE OR REPLACE TRIGGER on_profile_referral_process
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.process_referral_signup();