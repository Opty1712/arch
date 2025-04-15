#!/usr/bin/env node

import { createServer } from 'vite';

async function startViteServer() {
  try {
    const server = await createServer({
      // Vite config options here
      configFile: './vite.config.ts',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
    });
    
    await server.listen();
    
    server.printUrls();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

startViteServer();