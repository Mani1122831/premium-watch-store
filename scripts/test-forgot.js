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
    req.write(data);
    req.end();
  });
}

async function testForgotPassword() {
  console.log('Sending forgot-password request for kasanimanikanta2005@gmail.com...');
  const res = await post('/api/auth/forgot-password', { email: 'kasanimanikanta2005@gmail.com' });
  console.log('Response:', JSON.stringify(res, null, 2));
}

testForgotPassword();
