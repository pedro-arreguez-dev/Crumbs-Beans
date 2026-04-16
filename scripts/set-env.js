const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.ts');

// We only replace the environment variables if we are in a Netlify deployment environment 
// so we don't accidentally overwrite local configurations.
if (process.env.NETLIFY === 'true' || process.env.CI === 'true') {
  console.log('Netlify build detected. Generating environment.ts from environment variables...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY are required in Netlify Environment Variables.');
    process.exit(1);
  }

  const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseAnonKey: '${process.env.SUPABASE_ANON_KEY}'
};
`;

  fs.writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
  console.log(`Output generated at ${targetPath}`);
} else {
  console.log('Local environment detected. Skipping environment generation.');
}
