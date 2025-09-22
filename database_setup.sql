-- Run this SQL in your Supabase Dashboard SQL Editor

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type VARCHAR(50) NOT NULL, -- Film, Television, Web Series, etc.
  category VARCHAR(50) NOT NULL, -- Feature Film, Short Film, Web Series, etc.
  status VARCHAR(50) NOT NULL DEFAULT 'planning', -- planning, ongoing, completed, cancelled
  location VARCHAR(255),
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  budget_currency VARCHAR(10) DEFAULT 'INR',
  duration_minutes INTEGER,
  episodes INTEGER, -- For series
  team_size INTEGER DEFAULT 1,
  tags TEXT[], -- Array of tags like 'featured', 'popular'
  skills_required TEXT[], -- Array of required skills
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT FALSE,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table for team members
CREATE TABLE IF NOT EXISTS project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(100), -- Director, Producer, Actor, etc.
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create project_likes table for likes
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_popular ON projects(popular);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for project_members
CREATE POLICY "Anyone can view project members" ON project_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join projects" ON project_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave projects" ON project_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for project_likes
CREATE POLICY "Anyone can view project likes" ON project_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like projects" ON project_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike projects" ON project_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO projects (title, description, project_type, category, status, location, budget_min, budget_max, team_size, skills_required, created_by, featured, popular) VALUES
('The Silent Echo', 'A psychological thriller about a detective who discovers that the victims of a serial killer are all connected to a mysterious radio frequency that only he can hear.', 'Film', 'Feature Film', 'ongoing', 'Los Angeles, CA', 25000000, 35000000, 2, ARRAY['Director', 'Cinematographer', 'Lead Actor', 'Sound Designer'], (SELECT id FROM auth.users LIMIT 1), true, true),
('Urban Dreams', 'A coming-of-age story following four friends navigating life, love, and career aspirations in the bustling city of New York.', 'Television', 'Web Series', 'planning', 'New York, NY', 18000000, 25000000, 1, ARRAY['Showrunner', 'Casting Director'], (SELECT id FROM auth.users LIMIT 1), false, true);
