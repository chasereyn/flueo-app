-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_product_id TEXT,
  plan_name VARCHAR(50),
  subscription_status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  english_text TEXT NOT NULL,
  spanish_text TEXT,
  ai_translated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  journal_entry_id INTEGER REFERENCES public.journal_entries(id),
  english_text TEXT NOT NULL,
  spanish_text TEXT NOT NULL,
  context_sentence TEXT,
  notes TEXT,
  quality SMALLINT NOT NULL DEFAULT 0 CHECK (quality >= 0 AND quality <= 5),
  repetition_count SMALLINT NOT NULL DEFAULT 0,
  easiness_factor REAL NOT NULL DEFAULT 2.5 CHECK (easiness_factor >= 1.3),
  interval_days INTEGER NOT NULL DEFAULT 0 CHECK (interval_days >= 0),
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  suspended BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45)
);

-- Create invitations table
CREATE TABLE public.invitations (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
);

-- Create RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Journal entries policies
CREATE POLICY "Users can view own journal entries" 
  ON public.journal_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal entries" 
  ON public.journal_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" 
  ON public.journal_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" 
  ON public.journal_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can view own flashcards" 
  ON public.flashcards FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own flashcards" 
  ON public.flashcards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcards" 
  ON public.flashcards FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcards" 
  ON public.flashcards FOR DELETE 
  USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Invitations policies
CREATE POLICY "Users can view invitations they sent" 
  ON public.invitations FOR SELECT 
  USING (auth.uid() = invited_by);

CREATE POLICY "Users can create invitations" 
  ON public.invitations FOR INSERT 
  WITH CHECK (auth.uid() = invited_by);

-- Create indexes for performance
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON public.flashcards(next_review);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_invitations_invited_by ON public.invitations(invited_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
    BEFORE UPDATE ON public.flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();