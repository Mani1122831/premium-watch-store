import { spawn } from 'child_process';

console.log('----------------------------------------------------');
console.log('  TITANOVA HAUTE HORLOGERIE - LAUNCHING FULL STACK');
console.log('----------------------------------------------------');
console.log('1. Starting Express API & MongoDB Atlas backend on http://localhost:5000');
console.log('2. Starting Vite Frontend Storefront on http://localhost:5174');
console.log('----------------------------------------------------\n');

const server = spawn('node', ['server/index.js'], { stdio: 'inherit', shell: true });
const client = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  console.log('\nGracefully terminating TITANOVA development instances...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  client.kill('SIGTERM');
  process.exit(0);
});
