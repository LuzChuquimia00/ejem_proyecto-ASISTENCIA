import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config'; // Esto carga las variables de entorno.

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Global Setup and Teardown
  globalSetup: './tests/global.setup.ts',
  globalTeardown: './tests/global.teardown.ts',
  testDir: './tests',

  // Test Execution Configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // Shared Settings for All Projects
  use: {
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
  },

  // Browser Projects
  projects: [
    // Proyecto para pruebas de API
    {
      name: 'api',
      testDir: './tests/api', // Solo busca tests en la carpeta 'api'
      use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL_API, // URL del backend desde .env
        trace: 'on-first-retry',
      },
    },

    // Proyecto para pruebas visuales (UI)
    {
      name: 'web',
      testDir: './tests/web', // Suponiendo que tus tests visuales están aquí
      use: { 
        baseURL: process.env.PLAYWRIGHT_BASE_URL_WEB, // URL del frontend desde .env
        ...devices['Desktop Chrome'],
        trace: 'on-first-retry',
      },
    },
  ],

  // Local Development Server
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
