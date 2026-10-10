/** Provider-neutral structured-output bridge. Invoke only with an explicitly configured extractor. */
let input = '';
for await (const chunk of process.stdin) input += chunk;
try {
  const endpoint = new URL(process.env.CAUSOME_EXTRACTOR_URL ?? '');
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname))) throw new Error('Extractor endpoint must use HTTPS or localhost');
  const response = await fetch(endpoint, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(90_000),
    headers: { 'Content-Type': 'application/json', ...(process.env.CAUSOME_EXTRACTOR_KEY ? { Authorization: `Bearer ${process.env.CAUSOME_EXTRACTOR_KEY}` } : {}) }, body: input });
  if (!response.ok) throw new Error(`Extractor HTTP ${response.status}`);
  console.log(JSON.stringify(await response.json()));
} catch (error) { console.error(error.message); process.exitCode = 1; }
