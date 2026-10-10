import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const port = Number(process.env.CAUSOME_PORT ?? 4322);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid CAUSOME_PORT');

export default defineConfig({
  output: 'static',
  server: { host: '127.0.0.1', port },
  base: process.env.CAUSOME_BASE_PATH ?? '/',
  integrations: [react()],
  trailingSlash: 'always',
});
