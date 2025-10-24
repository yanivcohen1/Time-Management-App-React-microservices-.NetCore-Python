const yaml = require('js-yaml');
const fs = require('fs');
const { spawn } = require('child_process');

try {
  const config = yaml.load(fs.readFileSync('./public/config.yaml', 'utf8'));
  if (config.port) {
    process.env.PORT = config.port;
  }
  const child = spawn('npx', ['react-scripts', 'start'], {
    stdio: 'inherit',
    shell: true
  });
  child.on('close', (code) => {
    process.exit(code);
  });
} catch (e) {
  console.error('Error loading config:', e);
  process.exit(1);
}