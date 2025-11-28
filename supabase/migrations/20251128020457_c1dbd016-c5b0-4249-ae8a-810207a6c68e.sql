-- Drop the incorrect trigger and function
DROP TRIGGER IF EXISTS on_profile_referral_process ON public.profiles;
DROP FUNCTION IF EXISTS public.process_referral_signup();

-- Create function to process referral on auth.users table
CREATE OR REPLACE FUNCTION public.handle_referral_on_signup()
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
  
  -- If there's a referral code, process it after a short delay to ensure profile exists
  IF referral_code_from_signup IS NOT NULL THEN
    -- Find the referrer by their referral code
    SELECT id INTO referrer_user_id
    FROM public.profiles
    WHERE referral_code = referral_code_from_signup;
    
    -- If referrer found, create the referral record
    IF referrer_user_id IS NOT NULL AND referrer_user_id != NEW.id THEN
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

-- Trigger on auth.users after profile is created
-- This will run after handle_new_user creates the profile
CREATE TRIGGER on_auth_user_referral
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_on_signup();