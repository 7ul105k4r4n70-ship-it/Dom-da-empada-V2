import fetch from 'node-fetch';

const url = 'http://72.60.61.216:8000/rest/v1/orders?select=*&limit=1';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.IAFUHJEIiSRSu-9--LsNS_o_pQKE32hJPBdtVpFCHGE';

try {
  const res = await fetch(url, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    }
  });
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    const cols = Object.keys(data[0]);
    console.log('Columns in orders:', cols);
    console.log('Has observations:', cols.includes('observations'));
  } else {
    console.log('No data returned');
  }
} catch (err) {
  console.error('Error:', err.message);
}
