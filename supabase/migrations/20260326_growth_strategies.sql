-- Migration: growth_strategies
-- Description: Table to store AI-generated growth strategies for Facebook pages.

CREATE TABLE IF NOT EXISTS growth_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  niche text NOT NULL,
  style text NOT NULL,
  frequency text NOT NULL,
  duration_days integer NOT NULL,
  strategy_json jsonb NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE growth_strategies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own growth strategies"
  ON growth_strategies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own growth strategies"
  ON growth_strategies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own growth strategies"
  ON growth_strategies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own growth strategies"
  ON growth_strategies FOR DELETE
  USING (auth.uid() = user_id);
