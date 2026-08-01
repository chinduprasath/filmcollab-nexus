-- 1. Trigger for New Projects
CREATE OR REPLACE FUNCTION public.handle_new_project_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  user_record RECORD;
BEGIN
  -- Notify all users about the new project
  FOR user_record IN SELECT id FROM public.profiles LOOP
    INSERT INTO public.notifications (
      user_id,
      title,
      description,
      type,
      priority,
      status,
      action_url
    ) VALUES (
      user_record.id,
      'New Project Posted',
      'A new project has been posted: ' || NEW.title || '.',
      'project',
      'high',
      'unread',
      '/projects/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_new_project_notification ON public.projects;
CREATE TRIGGER trigger_new_project_notification
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_project_notifications();


-- 2. Trigger for New Locations
CREATE OR REPLACE FUNCTION public.handle_new_location_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  user_record RECORD;
BEGIN
  -- Notify all users about the new location
  FOR user_record IN SELECT id FROM public.profiles LOOP
    INSERT INTO public.notifications (
      user_id,
      title,
      description,
      type,
      priority,
      status,
      action_url
    ) VALUES (
      user_record.id,
      'New Shooting Location',
      'A new location has been added: ' || NEW.name || ' in ' || NEW.city || '.',
      'system',
      'high',
      'unread',
      '/locations/' || NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_new_location_notification ON public.shooting_locations;
CREATE TRIGGER trigger_new_location_notification
AFTER INSERT ON public.shooting_locations
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_location_notifications();


-- 3. Trigger for New Users (Welcome Notification)
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Notify the new user welcoming them
  INSERT INTO public.notifications (
    user_id,
    title,
    description,
    type,
    priority,
    status,
    action_url
  ) VALUES (
    NEW.id,
    'Welcome to FilmCollab!',
    'Your profile has been created successfully. Explore jobs, projects, and locations!',
    'system',
    'high',
    'unread',
    '/profile'
  );
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_new_user_welcome_notification ON public.profiles;
CREATE TRIGGER trigger_new_user_welcome_notification
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_welcome_notification();
