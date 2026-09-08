import { defineConfig, devices } from '@playwright/test'; 

 

export default defineConfig({ 

 

  testDir: './tests', 

 

  reporter: [ 

    ['list'], 

    ['html'], 

    [ 

      'json', 

      { 

        outputFile: 'test-results/results.json' 

      } 

    ] 

  ], 

 

  use: { 
    // baseURL: 'https://www.saucedemo.com', 


    screenshot: 'only-on-failure', 

 

    trace: 'retain-on-failure', 

 

    video: 'retain-on-failure' 

  }, 

 

  projects: [ 

    { 

      name: 'chromium', 

      use: { 

        ...devices['Desktop Chrome'] 

      } 

    } 

  ] 

}); 