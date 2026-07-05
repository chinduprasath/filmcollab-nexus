import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://ylxrchemtsxxtrjhysff.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlseHJjaGVtdHN4eHRyamh5c2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTUyMDcsImV4cCI6MjA3MjEzMTIwN30.fh1tpiIvmSZNtje5Hu-SskCsC5Sin3oWvkUht8JTkXs";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const testId = '4f8d27a1-1368-458c-91e3-906edfdae9f4';
  const { data: insertData, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: testId,
      full_name: 'Test Insertion',
      username: 'test_insert',
      email: 'test_insert@example.com',
      role: 'USER',
      category: 'user'
    })
    .select();
  
  console.log('Insert Result:', { insertData, insertError });

  const { data: selectData, error: selectError } = await supabase
    .from('profiles')
    .select('*');
  console.log('Select Result:', { selectData, selectError });
}
run();
