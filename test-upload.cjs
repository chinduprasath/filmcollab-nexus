const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=[\"']?(.*?)[\"']?(?:\r|\n|$)/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=[\"']?(.*?)[\"']?(?:\r|\n|$)/);
const url = urlMatch ? urlMatch[1] : null;
const key = keyMatch ? keyMatch[1] : null;

const supabase = createClient(url, key);

async function testUpload() {
  const { data, error } = await supabase.storage.from('post-media').upload('test.txt', 'hello');
  if (error) {
    console.error('post-media bucket error:', error.message);
  } else {
    console.log('post-media upload success:', data);
    await supabase.storage.from('post-media').remove(['test.txt']);
  }
}
testUpload();
