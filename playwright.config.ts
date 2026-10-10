import { defineConfig, devices } from '@playwright/test';

const basePath = (process.env.CAUSOME_BASE_PATH ?? '').replace(/\/$/, '');
const port = Number(process.env.CAUSOME_PORT ?? 4322);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid CAUSOME_PORT');
const baseURL = `http://127.0.0.1:${port}${basePath}/`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: { command: `pnpm --filter @causome/web preview --host 127.0.0.1 --port ${port}`, url: baseURL, reuseExistingServer: !process.env.CI },
});
