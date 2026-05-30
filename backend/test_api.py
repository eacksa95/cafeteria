#!/usr/bin/env python
"""
test_api.py — Test rápido de endpoints Cafetería
==================================================
Uso:
  .venv/Scripts/python test_api.py              # local (localhost:8001)
  .venv/Scripts/python test_api.py prod         # producción en Railway

Variables de entorno:
  TEST_USER   usuario para login  (default: admin)
  TEST_PASS   contraseña          (REQUERIDA para tests con auth)

Ejemplos:
  TEST_PASS=mipass .venv/Scripts/python test_api.py
  TEST_PASS=mipass .venv/Scripts/python test_api.py prod
"""
import os, sys, requests

PROD  = 'prod' in sys.argv[1:]
BASE  = 'https://cafeteria-production-c6ba.up.railway.app' if PROD else 'http://localhost:8001'
USER  = os.environ.get('TEST_USER', 'admin')
PASS  = os.environ.get('TEST_PASS', '')

token = None
passed = 0
failed = 0


def log(label, r, expected=None):
    global passed, failed
    ok = r.ok if expected is None else r.status_code == expected
    icon = '✓' if ok else '✗'
    print(f'  {icon} {label:45} {r.status_code}')
    if not ok:
        failed += 1
        try:    print(f'      → {r.json()}')
        except: print(f'      → {r.text[:120]}')
    else:
        passed += 1
    return r


def get(path, auth=True):
    h = {'Authorization': f'Bearer {token}'} if auth and token else {}
    return requests.get(f'{BASE}{path}', headers=h, timeout=10)


def post(path, data, auth=True):
    h = {'Content-Type': 'application/json'}
    if auth and token: h['Authorization'] = f'Bearer {token}'
    return requests.post(f'{BASE}{path}', json=data, headers=h, timeout=10)


def patch(path, data, auth=True):
    h = {'Content-Type': 'application/json'}
    if auth and token: h['Authorization'] = f'Bearer {token}'
    return requests.patch(f'{BASE}{path}', json=data, headers=h, timeout=10)


print(f'\n{"="*55}')
print(f'  API Test — {"PRODUCCIÓN" if PROD else "LOCAL"}')
print(f'  {BASE}')
print(f'{"="*55}\n')

# ── Endpoints públicos (sin auth) ─────────────────────────
print('[Público — sin login]')
log('GET /api/productos/menu/', get('/api/productos/menu/', auth=False))

# ── Auth ──────────────────────────────────────────────────
print('\n[Autenticación]')
if not PASS:
    print('  ! Seteá TEST_PASS=tupassword para continuar con los tests de auth.')
    print(f'\n  Resultado: {passed} OK, {failed} FAIL\n')
    sys.exit(0 if failed == 0 else 1)

r = post('/api/token/', {'username': USER, 'password': PASS}, auth=False)
log('POST /api/token/ (login)', r)
if not r.ok:
    print('\n  ✗ Login fallido — abortando.\n')
    sys.exit(1)
token = r.json().get('access')

# ── Usuarios ──────────────────────────────────────────────
print('\n[Usuarios]')
r_users = log('GET /users/', get('/users/'))
if r_users.ok:
    users = r_users.json()
    print(f'      → {len(users)} usuarios en DB')
    if users:
        uid = users[0]['id']
        log(f'GET /users/{uid}/', get(f'/users/{uid}/'))

# ── Productos ─────────────────────────────────────────────
print('\n[Productos]')
r_prods = log('GET /productos/', get('/productos/'))
if r_prods.ok:
    prods = r_prods.json()
    print(f'      → {len(prods)} productos en DB')
    if prods:
        pid = prods[0]['id']
        # Test: mozo NO puede cambiar precio (espera 403)
        log('PATCH precio como admin (esperado 200 o 403)', patch(f'/productos/{pid}/', {'precio': prods[0]['precio']}))

# ── Pedidos ───────────────────────────────────────────────
print('\n[Pedidos]')
r_peds = log('GET /pedidos/', get('/pedidos/'))
if r_peds.ok:
    peds = r_peds.json()
    print(f'      → {len(peds)} pedidos en DB')

# ── Endpoints de registro (público) ───────────────────────
print('\n[Registro público]')
test_user = {'username': '_test_tmp_', 'password': 'Test1234!', 'group_name': 'mozo'}
r_reg = log('POST /users/register/ (rol=mozo)', post('/users/register/', test_user, auth=False))

# ── Resumen ───────────────────────────────────────────────
total = passed + failed
print(f'\n{"="*55}')
print(f'  Resultado: {passed}/{total} OK  |  {failed} FAIL')
print(f'{"="*55}\n')
sys.exit(0 if failed == 0 else 1)
