import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'dist/server/wrangler.json');

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // If Astro generated an 'assets' binding, rename it to avoid the 'ASSETS' reserved word error
  if (config.assets && config.assets.binding === 'ASSETS') {
    console.log('Renaming reserved ASSETS binding to avoid Cloudflare Pages conflict...');
    config.assets.binding = 'PROJECT_ASSETS';
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
