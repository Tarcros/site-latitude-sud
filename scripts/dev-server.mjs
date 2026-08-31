/* Serveur de développement qui rejoue les règles de vercel.json.
   Sans lui, /photographie/hfwi renvoie 404 en local et on ne teste
   pas ce qui sera réellement déployé.

   Usage : node scripts/dev-server.mjs [port]   (défaut 4300)      */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2] || 4300);
const conf = JSON.parse(await readFile(join(RACINE, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json'
};

/* `/catalogue/:slug` → expression régulière, comme le fait Vercel. */
function versRegex(source) {
  const motif = source
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/:[A-Za-z_][A-Za-z0-9_]*\*/g, '.+')
    .replace(/:[A-Za-z_][A-Za-z0-9_]*/g, '[^/]+')
    .replace(/\(\.\*\)/g, '.*');
  return new RegExp('^' + motif + '$');
}

const redirections = (conf.redirects || []).map(r => ({ ...r, re: versRegex(r.source) }));
const reecritures = (conf.rewrites || []).map(r => ({ ...r, re: versRegex(r.source) }));

async function fichier(chemin) {
  const abs = join(RACINE, decodeURIComponent(chemin));
  if (!abs.startsWith(RACINE)) return null;
  try {
    const s = await stat(abs);
    if (s.isDirectory()) return fichier(join(chemin, 'index.html'));
    return abs;
  } catch { return null; }
}

createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');
  let chemin = u.pathname.replace(/\/+$/, '') || '/';

  for (const r of redirections) {
    if (r.re.test(chemin)) {
      res.writeHead(r.permanent ? 308 : 307, { Location: r.destination + u.search });
      return res.end();
    }
  }

  let cible = chemin === '/' ? '/index.html' : chemin;
  let abs = await fichier(cible);

  if (!abs) {
    for (const r of reecritures) {
      if (r.re.test(chemin)) { abs = await fichier(r.destination); break; }
    }
  }

  if (!abs) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 — ' + chemin);
  }

  const corps = await readFile(abs);
  res.writeHead(200, {
    'Content-Type': TYPES[extname(abs)] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  res.end(corps);
}).listen(PORT, () => {
  console.log(`Serveur (règles vercel.json) → http://localhost:${PORT}`);
  console.log(`  ${redirections.length} redirections, ${reecritures.length} réécritures`);
});
