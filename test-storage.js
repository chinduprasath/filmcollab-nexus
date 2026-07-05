import { createClient } from '@supabase/supabase-js';
const supabase = createClient("https://ylxrchemtsxxtrjhysff.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseHJjaGVtdHN4eHRyamh5c2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTUyMDcsImV4cCI6MjA3MjEzMTIwN30.fh1tpiIvmSZNtje5Hu-SskCsC5Sin3oWvkUht8JTkXs");
async function run() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data?.map(b => b.name));
}
run();
