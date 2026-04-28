const url = 'https://portal-motorista.vercel.app';
const html = await (await fetch(url)).text();
const scriptMatch = html.match(/src="([^"]+\.js)"/g);
console.log('Scripts:', scriptMatch?.slice(0, 3));

if (scriptMatch && scriptMatch[0]) {
  const src = scriptMatch[0].match(/src="([^"]+)"/)[1];
  const scriptUrl = src.startsWith('http') ? src : 'https://portal-motorista.vercel.app' + src;
  console.log('Script URL:', scriptUrl);
  const js = await (await fetch(scriptUrl)).text();
  console.log('watchPosition:', js.includes('watchPosition'));
  console.log('navigator.geolocation:', js.includes('navigator.geolocation'));
  console.log('clearWatch:', js.includes('clearWatch'));
}
