import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import net from 'net';

function backendCheckPlugin(): Plugin {
  let backendOnline = false;
  let lastCheckTime = 0;

  const checkBackend = (): Promise<boolean> => {
    const now = Date.now();
    // Cache the check for 2 seconds to avoid excessive socket connection attempts
    if (now - lastCheckTime < 2000) {
      return Promise.resolve(backendOnline);
    }
    lastCheckTime = now;
    return new Promise((resolve) => {
      const socket = net.createConnection({ port: 8080, host: '127.0.0.1', timeout: 300 });
      socket.once('connect', () => {
        backendOnline = true;
        socket.destroy();
        resolve(true);
      });
      socket.once('error', () => {
        backendOnline = false;
        socket.destroy();
        resolve(false);
      });
      socket.once('timeout', () => {
        backendOnline = false;
        socket.destroy();
        resolve(false);
      });
    });
  };

  return {
    name: 'spring-boot-backend-checker',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          const isOnline = await checkBackend();
          if (!isOnline) {
            // Backend port 8080 is offline - serve graceful offline response directly
            // and do NOT pass to proxyMiddleware, preventing ECONNREFUSED terminal error logs!
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ offline: true, message: 'Spring Boot backend offline (Client Demo Mode)' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), backendCheckPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ offline: true, message: 'Spring Boot backend offline' }));
            }
          });
        },
      },
    },
  },
});
