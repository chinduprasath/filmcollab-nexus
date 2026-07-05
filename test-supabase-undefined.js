import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "http://localhost:3000/api/supabase";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseHJjaGVtdHN4eHRyamh5c2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTUyMDcsImV4cCI6MjA3MjEzMTIwN30.fh1tpiIvmSZNtje5Hu-SskCsC5Sin3oWvkUht8JTkXs";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function run() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', undefined).maybeSingle();
    console.log('Result:', { data, error });
  } catch (e) {
    console.log('Exception:', e.message);
  }
}
run();
