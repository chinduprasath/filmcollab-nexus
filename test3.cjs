const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=[\"']?(.*?)[\"']?(?:\r|\n|$)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=[\"']?(.*?)[\"']?(?:\r|\n|$)/);
const url = urlMatch ? urlMatch[1] : null;
const key = keyMatch ? keyMatch[1] : null;

const supabase = createClient(url, key);

supabase.from('profiles').select('id, full_name, username, tags').eq('username', 'director').then(res => {
  console.log("DB Tags:", JSON.stringify(res.data, null, 2));
}).catch(console.error);
