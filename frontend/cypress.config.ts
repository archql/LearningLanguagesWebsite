import { defineConfig } from 'cypress';
import coverage from '@cypress/code-coverage/task';


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',  // Make sure your Angular app runs here
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      coverage(on, config)
      return config;
    },
  },
});