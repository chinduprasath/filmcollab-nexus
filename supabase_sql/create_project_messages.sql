-- Create project_messages table for project group chat
CREATE TABLE IF NOT EXISTS public.project_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Users can view messages if they are the creator of the project OR if they are an accepted member
CREATE POLICY "Users can view project messages" ON public.project_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects WHERE id = project_messages.project_id AND created_by = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid() AND role != 'Applicant'
        )
    );

-- Users can insert messages if they are the creator of the project OR if they are an accepted member
CREATE POLICY "Users can insert project messages" ON public.project_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects WHERE id = project_messages.project_id AND created_by = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.project_members WHERE project_id = project_messages.project_id AND user_id = auth.uid() AND role != 'Applicant'
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created_at ON public.project_messages(created_at);
