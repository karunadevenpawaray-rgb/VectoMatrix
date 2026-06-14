/**
 * Super Admin Creation Tool
 * 
 * Registers a new auth user via Supabase Auth and provides the SQL query to insert
 * their profile into the public.super_admins database table.
 */

const fs = require('fs');
const path = require('path');

// Helper to resolve env vars from admin app
const envPath = path.resolve(__dirname, '../admin/.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const matchUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  const matchKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (matchUrl) supabaseUrl = matchUrl[1].trim().replace(/['"]/g, '');
  if (matchKey) supabaseAnonKey = matchKey[1].trim().replace(/['"]/g, '');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Could not read Supabase configurations from admin/.env file.');
  process.exit(1);
}

// Dynamically locate supabase-js from workspace
let createClient;
try {
  createClient = require(path.resolve(__dirname, '../admin/node_modules/@supabase/supabase-js')).createClient;
} catch (e) {
  try {
    createClient = require('@supabase/supabase-js').createClient;
  } catch (err) {
    console.error('Error: @supabase/supabase-js not found. Please run npm install inside admin directory first.');
    process.exit(1);
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('\nUsage: node scripts/create-superadmin.js <email> <password>\n');
  process.exit(0);
}

const email = args[0];
const password = args[1];

const run = async () => {
  console.log(`\nAttempting to register user: ${email}...`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('\n❌ Signup Error:', error.message);
      process.exit(1);
    }

    if (!data || !data.user) {
      console.error('\n❌ Signup failed: No user returned.');
      process.exit(1);
    }

    const userId = data.user.id;
    console.log('\n✅ User successfully registered in Supabase Auth!');
    console.log(`User ID (Auth ID): ${userId}`);
    console.log(`Status: ${data.user.confirmed_at ? 'Verified' : 'Verification Email Sent'}`);
    
    console.log('\n========================================================================');
    console.log('👉 STEP 2: ACTIVATE SUPER ADMIN ROLE');
    console.log('Execute the following SQL command in your Supabase Dashboard SQL Editor:');
    console.log('========================================================================\n');
    console.log(`INSERT INTO public.super_admins (auth_id, email)`);
    console.log(`VALUES ('${userId}', '${email}')`);
    console.log(`ON CONFLICT (auth_id) DO NOTHING;\n`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('\n❌ Unexpected error:', err.message || err);
  }
};

run();
