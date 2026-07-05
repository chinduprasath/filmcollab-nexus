-- ============================================================
-- SQL SCRIPT: CREATE & POPULATE MOVIE/FILM INDUSTRY CATEGORIES
-- ============================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- This script creates a professional 'categories' table and inserts standard roles of the movie/film industry.

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Create Select Policy to allow anyone (anonymous or authenticated) to read categories
DROP POLICY IF EXISTS "Allow public read access for categories" ON public.categories;
CREATE POLICY "Allow public read access for categories" ON public.categories
    FOR SELECT USING (true);

-- 4. Seed Categories for the Movie and Film Industry
INSERT INTO public.categories (name, department, description) VALUES
-- Direction & Production
('Director', 'Direction', 'Responsible for directing the artistic and dramatic aspects of a film, while visualizing the script.'),
('Assistant Director', 'Direction', 'Supports the Director with tracking progress, managing schedules, and coordinating crew.'),
('Producer', 'Production', 'Oversees film production from inception to completion, managing budgeting, hiring, and logistics.'),
('Executive Producer', 'Production', 'Focuses on financing, legal aspects, high-level business deals, and overall executive management.'),
('Line Producer', 'Production', 'Manages the physical aspects of the production, including scheduling, daily operations, and budget execution.'),

-- Writing
('Script Writer', 'Writing', 'Creates the story, dialogue, and structure of a film in the form of a screenplay.'),
('Screenplay Writer', 'Writing', 'Adapts stories or writes original screenplays translating visual scenes to page format.'),
('Dialogue Writer', 'Writing', 'Focuses on writing realistic, impactful, or stylized dialogue for film characters.'),

-- Camera & Lighting
('Cinematographer / DOP', 'Camera', 'Director of Photography. Visualizes the film, controls lighting, cameras, and framing.'),
('Camera Operator', 'Camera', 'Operates the camera physically under the direction of the DOP.'),
('Steadicam Operator', 'Camera', 'Specialist camera operator using a stabilizing rig for smooth dynamic tracking shots.'),
('Drone Operator', 'Camera', 'Operates aerial camera platforms for high-altitude shots and sweeping panoramas.'),
('Gaffer', 'Lighting', 'Head of the electrical department, working closely with the DOP to design lighting setups.'),

-- Actors & Performers
('Lead Actor / Actress', 'Performance', 'Performs the primary roles and main characters in the theatrical or film narrative.'),
('Supporting Actor / Actress', 'Performance', 'Performs key secondary roles that support the main cast.'),
('Voice Over Artist', 'Performance', 'Provides off-camera voice performances for narration, animation, or commercial overlays.'),
('Stunt Artist', 'Performance', 'Performs high-risk physical action scenes, fighting sequences, or vehicular stunts.'),

-- Music & Audio
('Music Director', 'Sound', 'Composes original instrumental scores, selects songs, and oversees the musical direction of a film.'),
('Sound Engineer', 'Sound', 'Manages audio recording on set or post-production sound mixing, leveling, and mastering.'),
('Foley Artist', 'Sound', 'Re-creates ambient and everyday sound effects (steps, clothing rustling, breaking glass) in sync with the film.'),

-- Art & Set Design
('Production Designer', 'Art', 'Responsible for the visual concept and overall look of sets, locations, costumes, and props.'),
('Art Director', 'Art', 'Coordinates set building, painting, and construction based on the production design.'),
('Costume Designer', 'Art', 'Designs, sources, and manages all costumes and outfits worn by performers.'),
('Makeup Artist', 'Art', 'Applies cosmetic and character makeup or prosthetic appliances to actors.'),

-- Post-Production & Visual Effects
('Video Editor', 'Post-Production', 'Cuts and assembles raw footage into a cohesive, rhythmic, and well-paced movie structure.'),
('VFX Artist', 'Post-Production', 'Creates digital environment expansions, CG creatures, and composite simulations for visual effects.'),
('Motion Graphics Designer', 'Post-Production', 'Designs title sequences, lower thirds, animated posters, and kinetic infographics.')
ON CONFLICT (name) DO NOTHING;

-- 5. Select items to verify insertion
SELECT * FROM public.categories ORDER BY department, name;
