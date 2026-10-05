import http from 'http';

function post(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'Request timeout' });
    });
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing Login with demo@titanova.com / demo123 ---');
  const demoLogin = await post('/api/auth/login', { email: 'demo@titanova.com', password: 'demo123' });
  console.log('Result:', JSON.stringify(demoLogin, null, 2));

  console.log('\n--- 2. Testing Register with test user ---');
  const testEmail = `test_${Date.now()}@example.com`;
  const reg = await post('/api/auth/register', { name: 'Test User', email: testEmail, password: 'password123' });
  console.log('Result:', JSON.stringify(reg, null, 2));

  console.log('\n--- 3. Testing Login with newly registered user ---');
  const userLogin = await post('/api/auth/login', { email: testEmail, password: 'password123' });
  console.log('Result:', JSON.stringify(userLogin, null, 2));

  console.log('\n--- 4. Testing Forgot Password with test user ---');
  const forgot = await post('/api/auth/forgot-password', { email: testEmail });
  console.log('Result:', JSON.stringify(forgot, null, 2));

  process.exit(0);
}

runTests();
