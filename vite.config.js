import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // Accept all hosts, including 0.0.0.0 and mobile IPs
    port: 5173,              // Your dev port
    strictPort: true,
    https: false,            // Keep false unless you're serving with HTTPS directly
    cors: true, 
    allowedHosts: ["lock-watts-disease-andrew.trycloudflare.com"], //Frontend link
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
