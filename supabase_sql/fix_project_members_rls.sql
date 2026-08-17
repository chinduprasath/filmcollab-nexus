-- RLS Policy to allow project creators to manage (UPDATE and DELETE) members
-- Run this query in your Supabase SQL Editor.

CREATE POLICY "Project creators can manage members" ON project_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_members.project_id 
      AND created_by = auth.uid()
    )
  );
