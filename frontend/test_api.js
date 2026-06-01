#!/usr/bin/env node
/**
 * test_api.js — Performance y navegabilidad de endpoints
 * =========================================================
 * Uso:
 *   node test_api.js              → local (localhost:8001)
 *   node test_api.js prod         → producción (Railway)
 *
 * Variables de entorno opcionales:
 *   TEST_USER=admin  TEST_PASS=mipassword  node test_api.js prod
 */

const PROD  = process.argv.includes('prod');
const BASE  = PROD
  ? 'https://cafeteria-production-c6ba.up.railway.app'
  : 'http://localhost:8001';
const USER  = process.env.TEST_USER || 'admin';
const PASS  = process.env.TEST_PASS || '';
const SLA   = 2000; // ms máximo aceptable por request

let token   = null;
let passed  = 0;
let failed  = 0;
let total   = 0;

async function req(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;
  const t0 = Date.now();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const ms = Date.now() - t0;
  return { res, ms, ok: res.ok };
}

function log(label, ok, ms, status, note = '') {
  total++;
  const icon    = ok ? '✓' : '✗';
  const slow    = ms > SLA ? ` ⚠ lento (${ms}ms)` : '';
  const noteStr = note ? `  → ${note}` : '';
  console.log(`  ${icon} ${label.padEnd(42)} ${String(status).padStart(3)}  ${ms}ms${slow}${noteStr}`);
  if (ok) passed++; else failed++;
}

async function run() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  API Performance Test — ${PROD ? 'PRODUCCIÓN' : 'LOCAL'}`);
  console.log(`  ${BASE}`);
  console.log(`${'═'.repeat(60)}\n`);

  // ── Públicos (sin auth) ──────────────────────────────────
  console.log('[Endpoints públicos]');

  let r = await req('GET', '/api/productos/menu/', null, false);
  let data = r.ok ? await r.res.json() : [];
  log('GET /api/productos/menu/', r.ok, r.ms, r.res.status, r.ok ? `${data.length} productos` : '');

  r = await req('GET', '/categorias/', null, false);
  data = r.ok ? await r.res.json() : [];
  log('GET /categorias/', r.ok, r.ms, r.res.status, r.ok ? `${data.length} categorías` : '');

  r = await req('GET', '/api/productos/menu-completo/', null, false);
  log('GET /api/productos/menu-completo/', r.ok, r.ms, r.res.status);

  // ── Auth ────────────────────────────────────────────────
  console.log('\n[Autenticación]');

  if (!PASS) {
    console.log('  ! Seteá TEST_PASS=mipassword para tests con auth\n');
  } else {
    r = await req('POST', '/api/token/', { username: USER, password: PASS }, false);
    log('POST /api/token/ (login)', r.ok, r.ms, r.res.status);
    if (!r.ok) { console.log('\n  ✗ Login fallido — abortando tests auth\n'); }
    else {
      const body = await r.res.json();
      token = body.access;

      // Usuarios
      console.log('\n[Usuarios]');
      r = await req('GET', '/users/');
      data = r.ok ? await r.res.json() : [];
      log('GET /users/', r.ok, r.ms, r.res.status, r.ok ? `${data.length} usuarios` : '');

      // Productos autenticado
      console.log('\n[Productos]');
      r = await req('GET', '/productos/');
      data = r.ok ? await r.res.json() : [];
      log('GET /productos/', r.ok, r.ms, r.res.status, r.ok ? `${data.length} productos` : '');

      // Pedidos
      console.log('\n[Pedidos]');
      r = await req('GET', '/pedidos/');
      data = r.ok ? await r.res.json() : [];
      log('GET /pedidos/', r.ok, r.ms, r.res.status, r.ok ? `${data.length} pedidos` : '');
    }
  }

  // ── Resumen ─────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Resultado: ${passed}/${total} OK   ${failed} FAIL   SLA: <${SLA}ms`);
  console.log(`${'═'.repeat(60)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
