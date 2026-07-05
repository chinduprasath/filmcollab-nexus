import { createClient } from '@supabase/supabase-js';
const supabase = createClient("https://ylxrchemtsxxtrjhysff.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseHJjaGVtdHN4eHRyamh5c2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTUyMDcsImV4cCI6MjA3MjEzMTIwN30.fh1tpiIvmSZNtje5Hu-SskCsC5Sin3oWvkUht8JTkXs");
async function run() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (data && data.length > 0) console.log(Object.keys(data[0]));
}
run();
