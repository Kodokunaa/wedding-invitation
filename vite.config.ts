import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig, loadEnv } from 'vite';
import { createRsvpHandler } from './api/rsvp.mjs';
export default defineConfig(({ mode }) => ({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [
    {
      name: 'local-rsvp-api',
      configureServer(server) {
        // HTML must not outlive the client modules during local development.
        server.middlewares.use((req, res, next) => {
          if (req.headers.accept?.includes('text/html')) {
            res.setHeader('Cache-Control', 'no-store, max-age=0');
          }
          next();
        });
        const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
        const handle = createRsvpHandler({ env });
        server.middlewares.use('/api/rsvp', async (req, res) => {
          try {
            const chunks: Buffer[] = [];
            let length = 0;
            for await (const chunk of req) {
              length += chunk.length;
              if (length > 8192) {
                res.writeHead(413);
                res.end();
                return;
              }
              chunks.push(chunk);
            }
            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers))
              if (value)
                headers.set(
                  key,
                  Array.isArray(value) ? value.join(',') : value,
                );
            const request = new Request(`http://${req.headers.host}/api/rsvp`, {
              method: req.method,
              headers,
              ...(req.method === 'POST' ? { body: Buffer.concat(chunks) } : {}),
            });
            const response = await handle(request);
            res.writeHead(
              response.status,
              Object.fromEntries(response.headers),
            );
            res.end(await response.text());
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({ error: 'RSVP is temporarily unavailable.' }),
            );
          }
        });
      },
    },
    vinext(),
  ],
}));

