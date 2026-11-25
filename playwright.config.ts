import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'chromium-headless-shell',
      use: { ...devices['Desktop Chrome'], channel: 'chromium-headless-shell' },
    },
  ],
});
