const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 10000;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qfrmfwtgnjzlawhhwmnp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_deCqDep8bLWg7H34xlfalA_Z8euE7q4';
if(!process.env.SUPABASE_KEY) console.warn('ATENCION: falta la variable SUPABASE_KEY en Render; se esta usando la clave que esta escrita en el codigo.');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '50mb' }));

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#185FA5">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>Distribuidora HAP – Sistema de gestión</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #f7f6f3; --bg2: #ffffff; --text: #1a1a18; --text2: #6b6a66; --text3: #9e9c97;
  --border: #e0ded9; --border2: #c8c6c0; --blue: #185FA5; --blue-light: #e6f1fb;
  --blue-text: #0C447C; --green: #3B6D11; --green-light: #EAF3DE;
  --amber: #854F0B; --amber-light: #FAEEDA; --red: #A32D2D; --red-light: #FCEBEB;
  --radius: 8px; --radius-lg: 12px;
}
:root[data-tema="oscuro"] {
  color-scheme: dark;
  --bg: #16171a; --bg2: #212328; --text: #ecebe7; --text2: #b3b1ab; --text3: #8a8882;
  --border: #373a41; --border2: #4a4e57; --blue: #6aaef0; --blue-light: #1c3550;
  --blue-text: #a9d3fb; --green: #8fcf5a; --green-light: #243a17;
  --amber: #e5a95c; --amber-light: #3d2d12; --red: #f08a8a; --red-light: #432324;
}
:root[data-tema="oscuro"] input, :root[data-tema="oscuro"] select, :root[data-tema="oscuro"] textarea { background: var(--bg2); color: var(--text); border-color: var(--border2); }
:root[data-tema="oscuro"] .btn-primary { color: #0b1b2b; }
:root[data-tema="oscuro"] ::placeholder { color: var(--text3); }
:root[data-tema="oscuro"] .login-box { box-shadow: 0 4px 24px rgba(0,0,0,0.5); }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }
.app { display: flex; min-height: 100vh; }
.sidebar { width: 220px; min-width: 220px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 10; overflow-y: auto; }
.main { margin-left: 220px; flex: 1; padding: 2rem; max-width: 1100px; }
.sidebar-logo { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); }
.sidebar-logo h1 { font-size: 15px; font-weight: 700; color: var(--text); }
.sidebar-logo p { font-size: 11px; color: var(--text3); margin-top: 2px; }
.nav-section { padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
.nav-label { font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; padding: 0 1rem 0.4rem; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 1rem; cursor: pointer; font-size: 13px; color: var(--text2); border-left: 2px solid transparent; transition: all 0.12s; }
.nav-item:hover { background: var(--bg); color: var(--text); }
.nav-item.active { background: var(--blue-light); color: var(--blue-text); border-left-color: var(--blue); font-weight: 600; }
.section { display: none; } .section.active { display: block; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.section-header h2 { font-size: 20px; font-weight: 600; }

.dash-2col{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:16px;align-items:start}
@media(max-width:900px){.dash-2col{grid-template-columns:1fr}}
.rec-item{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid var(--border,#e5e5e5);font-size:13px}
.rec-item.vencido .rec-t{color:#c0392b;font-weight:600}
.rec-item.hecho .rec-t{text-decoration:line-through;color:var(--text3)}
.rec-cuando{font-size:11px;color:var(--text3)}
#rec-avisos{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;width:min(92vw,420px)}
.rec-aviso{background:#fff8e1;border:2px solid #f5a623;border-radius:10px;padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.25);font-size:14px;color:#222}
.rec-aviso b{display:block;margin-bottom:6px;font-size:15px}
.rec-aviso button{margin:6px 6px 0 0}
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 1.5rem; }
.stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem 1.25rem; }
.stat-card .slabel { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.stat-card .svalue { font-size: 24px; font-weight: 700; }
.stat-card .ssub { font-size: 11px; color: var(--text3); margin-top: 2px; }
.stat-blue .svalue { color: var(--blue); } .stat-green .svalue { color: var(--green); } .stat-amber .svalue { color: var(--amber); }
.card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 1.25rem; overflow: hidden; }
.card-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.card-header h3 { font-size: 13px; font-weight: 600; color: var(--text2); }
.card-body { padding: 1.25rem; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; font-weight: 600; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--bg); }
td { padding: 11px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: var(--bg); }
.empty-row td { text-align: center; color: var(--text3); padding: 2.5rem; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.badge-ok { background: var(--green-light); color: var(--green); }
.badge-low { background: var(--amber-light); color: var(--amber); }
.badge-out { background: var(--red-light); color: var(--red); }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid var(--border2); background: var(--bg2); color: var(--text); transition: all 0.12s; }
.btn:hover { background: var(--bg); }
.btn:active { transform: scale(0.98); }
.btn-primary { background: var(--blue); color: #fff; border-color: var(--blue); }
.btn-primary:hover { background: var(--blue-text); }
.btn-sm { padding: 5px 10px; font-size: 12px; }
.btn-danger { color: var(--red); }
.btn-danger:hover { background: var(--red-light); border-color: var(--red); }
.btn-green { background: var(--green); color: #fff; border-color: var(--green); }
.btn-green:hover { background: #27500A; }
.search-wrap { position: relative; margin-bottom: 1rem; }
.search-wrap input { width: 100%; padding: 9px 12px 9px 36px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; background: var(--bg2); color: var(--text); }
.search-wrap input:focus { outline: none; border-color: var(--blue); }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); }
.form-grid { display: grid; gap: 12px; }
.form-grid-2 { grid-template-columns: 1fr 1fr; }
.form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
.form-group label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 5px; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 8px 11px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg2); color: var(--text); }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--blue); }
.form-group textarea { resize: vertical; min-height: 60px; }
.modal-backdrop { display: none; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.4); align-items: center; justify-content: center; }
.modal-backdrop.open { display: flex; }
.modal { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; width: 560px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
.modal-wide { width: 700px; }
.modal h3 { font-size: 16px; font-weight: 600; margin-bottom: 1.25rem; }
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.linea-header { display: grid; grid-template-columns: 70px 2fr 75px 120px 110px 36px; gap: 6px; margin-bottom: 6px; }
.linea-header span { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; }
.linea-item { display: grid; grid-template-columns: 70px 2fr 75px 120px 110px 36px; gap: 6px; align-items: start; margin-bottom: 7px; }
.linea-item input, .linea-item select { margin: 0; }
.inp { padding: 7px 9px; font-size: 13px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg2); color: var(--text); width: 100%; }
.inp:focus { outline: none; border-color: var(--blue); }
.total-section { border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 0.5rem; }
.total-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 13px; color: var(--text2); }
.total-row.main { font-size: 16px; font-weight: 700; color: var(--text); padding-top: 6px; margin-top: 4px; border-top: 1px solid var(--border); }
#print-area { display: none; }

/* ===== LOGIN ===== */
#login-screen { display:flex; align-items:center; justify-content:center; min-height:100vh; background:var(--bg); }
.login-box { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:2.5rem 2rem; width:340px; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
.login-box h1 { font-size:22px; font-weight:800; margin-bottom:4px; }
.login-box p { font-size:12px; color:var(--text3); margin-bottom:2rem; }
.login-btns { display:flex; flex-direction:column; gap:10px; margin-bottom:1rem; }
.btn-login-emp { background:var(--green); color:#fff; border:none; border-radius:var(--radius); padding:12px; font-size:14px; font-weight:600; cursor:pointer; }
.btn-login-emp:hover { background:#27500A; }
.btn-login-adm { background:var(--blue); color:#fff; border:none; border-radius:var(--radius); padding:12px; font-size:14px; font-weight:600; cursor:pointer; }
.btn-login-adm:hover { background:var(--blue-text); }
.login-pass-wrap { display:none; margin-top:10px; }
.login-pass-wrap input { width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius); font-size:14px; text-align:center; letter-spacing:4px; margin-bottom:8px; }
.login-error { color:var(--red); font-size:12px; margin-top:4px; display:none; }
.rol-badge { font-size:11px; font-weight:700; padding:2px 8px; border-radius:100px; margin-left:8px; }
.rol-admin { background:var(--blue-light); color:var(--blue-text); }
.rol-emp { background:var(--green-light); color:var(--green); }
.filtro-btn { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); background: var(--bg2); color: var(--text2); transition: all 0.12s; }
.filtro-btn:hover { background: var(--bg); }
.filtro-btn.active { background: var(--text); color: #fff; border-color: var(--text); }
.filtro-g.active { background: #185FA5; border-color: #185FA5; color: #fff; }
.filtro-l.active { background: #3B6D11; border-color: #3B6D11; color: #fff; }
.filtro-e.active { background: #854F0B; border-color: #854F0B; color: #fff; }
.filtro-n.active { background: #6b6a66; border-color: #6b6a66; color: #fff; }
.tabla-listas th, .tabla-listas td { padding: 8px 6px; }
.tabla-listas .lp-sticky1 { position: sticky; left: 0; z-index: 2; background: var(--bg2); width: 34px; min-width: 34px; max-width: 34px; padding-left: 10px; }
.tabla-listas .lp-sticky2 { position: sticky; left: 34px; z-index: 2; background: var(--bg2); min-width: 190px; max-width: 240px; box-shadow: 1px 0 0 var(--border); }
.tabla-listas th.lp-sticky1, .tabla-listas th.lp-sticky2 { background: var(--bg); z-index: 3; }
.filtro-x-del { margin-left: 6px; opacity: 0.55; font-size: 11px; }
.filtro-x-del:hover { opacity: 1; color: #A32D2D; }
.filtro-x.active { background: #0F766E; border-color: #0F766E; color: #fff; }

/* AUTOCOMPLETE */
.ac-wrap { position: relative; }
.ac-list { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); box-shadow: 0 4px 16px rgba(0,0,0,0.12); z-index: 200; max-height: 220px; overflow-y: auto; display: none; }
.ac-list.open { display: block; }
.ac-item { padding: 8px 12px; cursor: pointer; font-size: 13px; border-bottom: 1px solid var(--border); }
.ac-item:last-child { border-bottom: none; }
.ac-item:hover, .ac-item.selected { background: var(--blue-light); color: var(--blue-text); }
.ac-item .ac-sub { font-size: 11px; color: var(--text3); margin-top: 1px; }
.ac-empty { padding: 10px 12px; font-size: 13px; color: var(--text3); }

/* ===== ESTILOS DE IMPRESIÓN ===== */
.pg-scroll { max-height: 68vh; overflow: auto; border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--bg2); }
.pg-table { border-collapse: separate; border-spacing: 0; width: max-content; min-width: 100%; font-size: 13px; }
.pg-table th { position: sticky; top: 0; z-index: 2; background: var(--bg); color: var(--text3); font-size: 11px; text-transform: uppercase; padding: 8px 6px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
.pg-table td { padding: 0; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); }
.pg-table td.pg-n { padding: 0 6px; color: var(--text3); font-size: 11px; text-align: right; min-width: 34px; }
.pg-in { width: 100%; box-sizing: border-box; border: 0; background: transparent; color: var(--text); padding: 7px 6px; font-size: 13px; font-family: inherit; }
.pg-in:focus { outline: 2px solid var(--blue); outline-offset: -2px; background: var(--bg2); }
.pg-in.pg-num { text-align: right; }
.pg-in.pg-ch { background: var(--amber-light); }
tr.pg-new td { background: var(--green-light); }
tr.pg-del td { background: var(--red-light); }
tr.pg-del .pg-in { text-decoration: line-through; color: var(--text3); }
.pg-bar { position: sticky; bottom: 0; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 10px 0; background: var(--bg); }

.m-top,.m-fondo{display:none}
@media(max-width:800px){
  html,body{overflow-x:hidden}
  .m-top{display:flex;position:fixed;top:0;left:0;right:0;height:48px;z-index:20;background:var(--bg2);border-bottom:1px solid var(--border);align-items:center;gap:10px;padding:0 12px;font-weight:700;font-size:15px}
  .m-top button{font-size:24px;background:none;border:none;color:var(--text);cursor:pointer;padding:4px 8px}
  .sidebar{transform:translateX(-105%);transition:transform .2s;z-index:50;width:260px;min-width:260px;box-shadow:0 0 24px rgba(0,0,0,.3)}
  .app.menu-abierto .sidebar{transform:none}
  .app.menu-abierto .m-fondo{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:40}
  .main{margin-left:0;padding:60px 10px 20px;max-width:100%;width:100%}
  .nav-item{padding:12px 1rem;font-size:15px}
  .section-header{flex-wrap:wrap;gap:8px}
  .section-header h2{font-size:18px}
  .stats-grid{grid-template-columns:1fr 1fr;gap:8px}
  .stat-card{padding:.75rem}
  .stat-card .svalue{font-size:20px}
  .card{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .card-header{flex-wrap:wrap;gap:8px;padding:.75rem}
  .card-body{padding:.75rem}
  table{font-size:12px}
  th,td{padding:8px 8px}
  .form-grid-2,.form-grid-3{grid-template-columns:1fr}
  [style*="grid-template-columns"]:not(.stats-grid){grid-template-columns:1fr!important}
  input,select,textarea{font-size:16px!important;max-width:100%}
  .btn{min-height:38px}
  .modal,.modal-wide{width:100vw;max-width:100vw;max-height:100vh;height:100vh;border-radius:0;padding:1rem}
  .modal-footer{flex-wrap:wrap;position:sticky;bottom:0;background:var(--bg2)}
  .login-box{width:92vw;max-width:92vw}
}
@media print {
  :root[data-tema="oscuro"] { color-scheme: light; --bg: #f7f6f3; --bg2: #ffffff; --text: #1a1a18; --text2: #6b6a66; --text3: #9e9c97; --border: #e0ded9; --border2: #c8c6c0; --blue: #185FA5; --blue-light: #e6f1fb; --blue-text: #0C447C; --green: #3B6D11; --green-light: #EAF3DE; --amber: #854F0B; --amber-light: #FAEEDA; --red: #A32D2D; --red-light: #FCEBEB; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background: #fff; margin: 0; padding: 0; }
  .app { display: none !important; }
  #print-area { display: block !important; }
  @page { size: 220mm 165mm; margin: 5mm 3mm 5mm 3mm; }
  .presup-hoja { height: 154.5mm; }
}

.presup-hoja { width: 100%; display: flex; flex-direction: row; align-items: stretch; font-family: Arial, sans-serif; font-size: 9px; }
.presup-col { border: 1px solid #000; padding: 6px 8px; box-sizing: border-box; width: 100%; flex: 1; display: flex; flex-direction: column; }
.ph-tabla-wrap { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.ph-tabla-wrap .ph-table { flex: 1; }
.ph-table tbody tr { height: 6%; }
.ph-table { border-bottom: 1px solid #888; }
.ph-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1.5px solid #000; }
.ph-logo-wrap { display: flex; flex-direction: column; }
.ph-empresa-nombre { font-size: 18px; font-weight: 900; line-height: 16px; text-transform: uppercase; }
.ph-empresa-sub { font-size: 12.5px; line-height: 15px; font-weight: 700; text-transform: uppercase; color: #222; margin-top: 2px; }
.ph-empresa-info { font-size: 12px; color: #444; margin-top: 3px; line-height: 13px; }
.ph-orig-box { border: 2px solid #000; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 17px; line-height: 18px; font-weight: 900; margin: 0 8px; flex-shrink: 0; }
.ph-titulo-wrap { text-align: right; }
.ph-titulo-wrap .ptitulo { font-size: 21px; line-height: 24px; font-weight: 900; text-transform: uppercase; }
.ph-titulo-wrap .pnodoc { font-size: 9.5px; line-height: 12px; color: #555; margin-top: 2px; }
.ph-titulo-wrap .pnum { font-size: 16.5px; line-height: 19px; font-weight: 700; margin-top: 3px; }
.ph-titulo-wrap .pfecha { font-size: 13px; line-height: 15px; margin-top: 2px; }
.ph-fecha-line { border-bottom: 1px solid #888; display: inline-block; min-width: 70px; }
.ph-cliente-row { font-size: 15.5px; line-height: 18px; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1.5px solid #000; display: flex; gap: 6px; align-items: baseline; }
.ph-cliente-row .clabel { font-weight: 700; white-space: nowrap; }
.ph-cliente-row .cval { font-weight: 700; color: #00008B; border-bottom: 1px solid #aaa; flex: 1; min-width: 40px; }
.ph-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; table-layout: fixed; }
.ph-table th { background: #222; color: #fff; font-size: 12.5px; font-weight: 700; text-align: center; border: 1px solid #000; padding: 4px; text-transform: uppercase; line-height: 16px; }
.ph-table th.left { text-align: left; }
.ph-table td { border: 1px solid #bbb; padding: 3px 5px; font-size: 14.5px; line-height: 16px; height: 22px; overflow: hidden; white-space: nowrap; }
.presup-col.con-deuda .ph-table td { padding-top: 1px; padding-bottom: 1px; height: 19px; }
.presup-col.con-deuda .ph-table tbody tr { height: 19px; }
.ph-table td.right { text-align: right; }
.ph-table td.center { text-align: center; }
.ph-table tr.empty td { color: #ccc; }
.ph-footer { display: flex; justify-content: flex-end; margin-top: 8px; border-top: 1.5px solid #000; padding-top: 5px; }
.ph-total-box { border: 1.5px solid #000; padding: 6px 14px; display: flex; align-items: center; gap: 8px; }
.ph-total-box .tflecha { font-size: 19px; line-height: 23px; }
.ph-total-box .tlabel { font-size: 16px; line-height: 19px; font-weight: 900; text-transform: uppercase; white-space: nowrap; }
.ph-total-box .tval { font-size: 19px; line-height: 22px; font-weight: 900; min-width: 75px; text-align: right; border-bottom: 1.5px solid #000; }
.ph-copia-label { font-size: 11px; line-height: 13px; color: #aaa; text-align: right; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
.divider-cut { border: none; border-left: 1.5px dashed #bbb; margin: 0 2mm; width: 0; }
</style>
</head>
<body>

<!-- LOGIN -->
<script type="application/json" id="db-defaults-data">{"actividad": [], "contador": {"presupuesto": 547442}, "proveedores": [], "caja": [], "config": {"dir": "Renefavaloro 4933", "iva": "Responsable Inscripto", "pie": "Precios sujetos a variación sin previo aviso. DOCUMENTO NO VÁLIDO COMO FACTURA.", "tel": "1160089998", "cuit": "", "dias": 15, "email": "", "filas": 12, "nombre": "Distribuidora HAP"}, "productos": [], "clientes": [], "listas_precio": {}, "empleados": [], "presupuestos": []}</script>
<div id="login-screen" style="display:flex">
  <div class="login-box">
    <h1>📦 Distribuidora HAP</h1>
    <p>Sistema de gestión</p>
    <div class="login-btns" id="login-btns-empleados">
      <!-- Se genera dinámicamente con los empleados -->
    </div>
    <button class="btn-login-adm" onclick="mostrarPassAdmin()" style="margin-bottom:10px">🔐 Administrador</button>
    <div class="login-pass-wrap" id="login-pass-wrap">
      <input type="password" id="login-pass" placeholder="Contraseña" onkeydown="if(event.key==='Enter')verificarAdmin()">
      <button class="btn btn-primary" style="width:100%" onclick="verificarAdmin()">Ingresar</button>
      <div class="login-error" id="login-error">Contraseña incorrecta</div>
    </div>
  </div>
</div>

<div class="app" id="main-app" style="display:none">
  <div class="m-top"><button onclick="menuMovil()" aria-label="Menu">☰</button><span>📦 Distribuidora HAP</span></div>
  <div class="m-fondo" onclick="menuMovil(false)"></div>
  <nav class="sidebar">
    <div class="sidebar-logo">
      <h1>📦 Distribuidora HAP</h1>
      <p>Artículos de polietileno</p>
      <div style="margin-top:6px;display:flex;align-items:center;justify-content:space-between">
        <span id="rol-badge" class="rol-badge"></span>
        <div style="display:flex;gap:6px;align-items:center">
          <button id="btn-tema" onclick="alternarTema()" style="font-size:11px;color:var(--text3);background:none;border:none;cursor:pointer;padding:0" title="Pasar a modo oscuro">🌙</button>
          <button onclick="sincronizar()" style="font-size:11px;color:var(--text3);background:none;border:none;cursor:pointer;padding:0" title="Actualizar datos">🔄</button>
          <button onclick="cerrarSesion()" style="font-size:11px;color:var(--text3);background:none;border:none;cursor:pointer;padding:0">↩ Salir</button>
        </div>
      </div>
    </div>
    <div class="nav-section">
      <div class="nav-label">General</div>
      <div class="nav-item active" onclick="showSection('dashboard',this)">🏠 Inicio</div>
    </div>
    <div class="nav-section">
      <div class="nav-label">Gestión</div>
      <div class="nav-item" onclick="showSection('productos',this)">📦 Productos / Stock</div>
      <div class="nav-item" onclick="showSection('controlstock',this)">📋 Control de stock</div>
      <div class="nav-item" onclick="showSection('listas',this)">💲 Listas de precios</div>
      <div class="nav-item" onclick="showSection('clientes',this)">👥 Clientes</div>
      <div class="nav-item" onclick="showSection('presupuestos',this)">📋 Presupuestos</div>
      <div class="nav-item" onclick="showSection('entrega',this)">📦 Pendiente de entrega</div>
      <div class="nav-item" onclick="showSection('deudores',this)">🔴 Deudores</div>
      <div class="nav-item" onclick="showSection('afavor',this)">🟢 A favor</div>
      <div class="nav-item" onclick="showSection('proveedores',this)">🏭 Proveedores</div>
    </div>
    <div class="nav-section">
      <div class="nav-label">Admin</div>
      <div class="nav-item" onclick="showSection('actividad',this)">📋 Actividad</div>
    </div>
    <div class="nav-section">
      <div class="nav-label">Finanzas</div>
      <div class="nav-item" onclick="showSection('caja',this)">💰 Caja</div>
      <div class="nav-item" onclick="showSection('ganancia',this)">📈 Ganancia</div>
      <div class="nav-item" onclick="showSection('ventas',this)">📊 Ventas</div>
      <div class="nav-item" onclick="showSection('contabilidad',this)">🧮 Contabilidad</div>
    </div>
    <div class="nav-section">
      <div class="nav-label">Mi empresa</div>
      <div class="nav-item" onclick="showSection('config',this)">⚙️ Configuración</div>
    </div>
  </nav>

  <div class="main">

    <!-- DASHBOARD -->
    <div id="dashboard" class="section active">
      <div class="section-header">
        <h2>Bienvenido 👋</h2>
        <span style="font-size:12px;color:var(--text3)" id="fecha-hoy"></span>
      </div>
      <div class="stats-grid">
        <div class="stat-card stat-blue"><div class="slabel">Presupuestos</div><div class="svalue" id="s-pres">0</div><div class="ssub">en total</div></div>
        <div class="stat-card stat-green"><div class="slabel">Productos</div><div class="svalue" id="s-prod">0</div><div class="ssub">registrados</div></div>
        <div class="stat-card stat-amber"><div class="slabel">Stock bajo</div><div class="svalue" id="s-bajo">0</div><div class="ssub">requieren reposición</div></div>
        <div class="stat-card"><div class="slabel">Clientes</div><div class="svalue" id="s-cli">0</div><div class="ssub">registrados</div></div>
      </div>
      <div class="dash-2col">
      <div>
      <div class="card">
        <div class="card-header"><h3>Últimos presupuestos</h3></div>
        <table><thead><tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody id="dash-pres"></tbody></table>
      </div>
      <div class="card">
        <div class="card-header"><h3>Alertas de stock</h3></div>
        <table><thead><tr><th>Producto</th><th>Stock actual</th><th>Mínimo</th><th>Estado</th></tr></thead>
        <tbody id="dash-alertas"></tbody></table>
      </div>
      </div>
      <div class="card" id="rec-card">
        <div class="card-header"><h3>🔔 Recordatorios</h3></div>
        <div class="card-body">
          <input type="text" id="rec-texto" placeholder="Ej: llamar a proveedor, cobrar a Luis..." style="width:100%;margin-bottom:6px" onkeydown="if(event.key==='Enter')agregarRecordatorio()">
          <div style="display:flex;gap:6px;margin-bottom:6px"><input type="date" id="rec-fecha" style="flex:1"><input type="time" id="rec-hora" style="width:100px"></div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px">Si no ponés hora, avisa a las 9:00. Sin fecha queda como nota, sin aviso.</div>
          <button class="btn btn-primary" style="width:100%" onclick="agregarRecordatorio()">Agregar recordatorio</button>
          <div id="rec-lista" style="margin-top:10px"></div>
        </div>
      </div>
      </div>
    </div>

    <!-- PRODUCTOS -->
    <div id="productos" class="section">
      <div class="section-header">
        <h2>Productos / Stock</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" onclick="pgAbrir()">📝 Editar todo en planilla</button><button class="btn btn-primary" onclick="abrirModalProducto()">+ Nuevo producto</button></div>
      </div>
      <div class="search-wrap" id="prod-lista-search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Buscar por nombre, código o categoría..." oninput="filtrarProductos(this.value)">
      </div>
      <div class="card" id="prod-lista-card">
        <table><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Medida</th><th class="col-costo">P. costo</th><th>P. venta</th><th>Stock</th><th>Estado</th><th></th></tr></thead>
        <tbody id="tabla-productos"></tbody></table>
      </div>
      <div id="pg-wrap" style="display:none">
        <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Cambiá lo que quieras directo en la tabla (como en Excel). Podés copiar celdas desde Excel y pegarlas en una casilla: se completan hacia abajo y hacia la derecha, y si pegás más filas de las que hay se crean productos nuevos. Cuando termines, apretá <strong>Guardar todo</strong>: se guarda una sola vez. Las casillas cambiadas se pintan de amarillo.</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
          <input type="search" id="pg-buscar" placeholder="🔍 Filtrar filas..." oninput="pgFiltrar()" style="padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:13px;min-width:220px">
          <button class="btn btn-sm" onclick="pgAgregarFilas(10)">+ 10 filas nuevas</button>
          <span id="pg-cambios" style="font-size:12px;color:var(--text3)"></span>
        </div>
        <div class="pg-scroll"><table class="pg-table"><thead id="pg-thead"></thead><tbody id="pg-tbody"></tbody></table></div>
        <datalist id="pg-dl-cat"></datalist><datalist id="pg-dl-prov"></datalist><datalist id="pg-dl-uni"></datalist>
        <div class="pg-bar">
          <button class="btn btn-primary" onclick="pgGuardar()">💾 Guardar todo</button>
          <button class="btn" onclick="pgDescartar()">↩ Descartar cambios</button>
          <button class="btn" onclick="pgCerrar()">← Volver a la lista</button>
        </div>
      </div>
    </div>

    <!-- LISTAS DE PRECIOS -->
    <div id="listas" class="section">
      <div class="section-header">
        <h2>Listas de precios 💲</h2>
      </div>
      <div class="card" style="margin-bottom:1rem">
        <div class="card-body" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <div style="flex:1;min-width:180px">
            <input type="text" id="lista-search" class="inp" placeholder="Buscar producto o código..." oninput="filtrarListas()" style="width:100%">
          </div>
          <span style="font-size:13px;color:var(--text2)">Ver la lista:</span>
          <select id="lista-ver" class="inp" onchange="listasCambiarVista()" style="font-size:13px;width:auto"></select>
          <select id="lista-solosin" class="inp" onchange="filtrarListas()" style="font-size:13px;width:auto">
            <option value="">Ver todos los productos</option>
            <option value="0">Solo sin precio General</option>
            <option value="1">Solo sin precio Gloria</option>
            <option value="2">Solo sin precio Luis</option>
          </select>
        </div>
      </div>
      <div class="card" style="margin-bottom:1rem">
        <div class="card-body" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <span style="font-size:13px;color:var(--text2)"><strong id="listas-selcount">0</strong> seleccionados</span>
          <span style="font-size:13px;color:var(--text2)">Poner precio en la lista</span>
          <select id="listas-igual-lista" class="inp" style="font-size:13px;width:auto" onchange="listasMargenPrefill()">
            <option value="0">General</option>
            <option value="1">Gloria</option>
            <option value="2">Luis</option>
          </select>
          <span style="font-size:13px;color:var(--text2)">con margen sobre el costo</span>
          <input type="text" inputmode="decimal" id="listas-margen" class="inp" style="width:70px;text-align:right" placeholder="ej: 30" title="Opcional. Precio = costo + este porcentaje" onkeydown="if(event.key==='Enter') aplicarIgualListas()">
          <span style="font-size:13px;color:var(--text2)">%</span>
          <span style="font-size:13px;color:var(--text3)">o precio fijo $</span>
          <input type="text" inputmode="decimal" id="listas-igual" class="inp" style="width:100px;text-align:right" placeholder="opcional" onkeydown="if(event.key==='Enter') aplicarIgualListas()">
          <label style="font-size:12px;color:var(--text2);white-space:nowrap" title="Los productos que no tengan precio en esta lista se calculan solos con este margen"><input type="checkbox" id="listas-recordar"> recordar este margen para la lista</label>
          <button class="btn btn-sm" onclick="aplicarIgualListas()">Aplicar a los marcados</button>
          <span id="listas-margen-hint" style="font-size:12px;color:var(--text3);flex-basis:100%"></span>
          <span style="flex:1"></span>
          <span id="listas-cambios" style="font-size:13px;color:var(--text2)">Sin cambios</span>
          <button class="btn btn-primary" id="listas-guardar" onclick="guardarListas()">💾 Guardar todo</button>
        </div>
      </div>
      <div class="card" style="margin-bottom:1rem">
        <div class="card-body" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <span style="font-size:13px;color:var(--text2)">➕ Nueva lista (por ejemplo para un cliente):</span>
          <input type="text" id="listas-nueva-nombre" class="inp" placeholder="Nombre de la lista" maxlength="30" style="width:200px" onkeydown="if(event.key==='Enter') crearListaPrecios()">
          <span style="font-size:13px;color:var(--text2)">copiar los precios de</span>
          <select id="listas-nueva-copiar" class="inp" style="font-size:13px;width:auto"><option value="">en blanco</option></select>
          <button class="btn btn-sm" onclick="crearListaPrecios()">Crear lista y elegir clientes</button>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Tip: copiá celdas desde Excel y pegalas en una casilla: se completan hacia abajo y hacia la derecha (una columna por lista). Lo que queda vacío no se modifica. En General, el número gris es el precio automático (costo + margen). A cada cliente le elegís su lista al editarlo.</div>
      <div class="card" style="overflow-x:auto">
        <table class="tabla-listas">
          <thead id="listas-thead"></thead>
          <tbody id="tabla-lista"></tbody>
        </table>
      </div>
    </div>

    <!-- CLIENTES -->
    <div id="clientes" class="section">
      <div class="section-header">
        <h2>Clientes</h2>
        <button class="btn btn-primary" onclick="abrirModalCliente()">+ Nuevo cliente</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center">
        <button class="filtro-btn active" onclick="setFiltroCliente('',this)">Todos</button>
        <button class="filtro-btn filtro-g" onclick="setFiltroCliente('G',this)">Gloria (G)</button>
        <button class="filtro-btn filtro-l" onclick="setFiltroCliente('L',this)">Luis (L)</button>
        <button class="filtro-btn filtro-e" onclick="setFiltroCliente('E',this)">Edgardo (E)</button>
        <span class="filtro-extra" data-fn="setFiltroCliente" style="display:contents"></span>
        <button class="filtro-btn filtro-n" onclick="setFiltroCliente('SIN',this)">Sin asignar</button>
        <span id="clientes-count" style="font-size:12px;color:var(--text3);margin-left:4px"></span>
      </div>
      <div id="barra-resumen" style="display:none;margin-bottom:12px"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px">
        <span id="res-titulo" style="font-size:12px;font-weight:600;color:var(--text2)">📊 Resumen de consumo</span>
        <label style="font-size:12px;color:var(--text2)">Desde</label>
        <input type="date" id="res-desde" style="font-size:13px;padding:5px 8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <label style="font-size:12px;color:var(--text2)">Hasta</label>
        <input type="date" id="res-hasta" style="font-size:13px;padding:5px 8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <button class="btn btn-sm btn-primary" id="res-btn" onclick="abrirResumenOficina(resumenListaActual())">Ver resumen</button>
      </div></div>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-clientes" placeholder="Buscar cliente..." oninput="renderClientes()">
      </div>
      <div class="card">
        <table><thead><tr><th>Nombre / Razón social</th><th>Cód.</th><th>Teléfono</th><th>Email</th><th>CUIT/DNI</th><th>Dirección</th><th></th></tr></thead>
        <tbody id="tabla-clientes"></tbody></table>
      </div>
    </div>

    <!-- PRESUPUESTOS -->
    <div id="presupuestos" class="section">
      <div class="section-header">
        <h2>Presupuestos</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="btn-desc-stock" onclick="descontarStockAnteriores()">📦 Descontar stock de boletas anteriores</button><button class="btn" id="btn-masiva" style="display:none" onclick="abrirMasiva()">📦 Marcar entregadas</button><button class="btn btn-primary" onclick="abrirModalPresupuesto()">+ Nuevo presupuesto</button></div>
      </div>
      <div style="margin-bottom:10px"><input type="search" id="pres-buscar" placeholder="🔍 Buscar por cliente, número de boleta o producto..." oninput="renderPresupuestos()" style="width:100%;max-width:420px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px"> <label style="font-size:12px;color:var(--text2);margin-left:10px;white-space:nowrap"><input type="checkbox" id="pres-ver-cobradas" onchange="renderPresupuestos()"> Mostrar cobradas</label></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center">
        <button class="filtro-btn active" onclick="setFiltroPres('',this)">Todos</button>
        <button class="filtro-btn filtro-g" onclick="setFiltroPres('G',this)">Gloria (G)</button>
        <button class="filtro-btn filtro-l" onclick="setFiltroPres('L',this)">Luis (L)</button>
        <button class="filtro-btn filtro-e" onclick="setFiltroPres('E',this)">Edgardo (E)</button>
        <span class="filtro-extra" data-fn="setFiltroPres" style="display:contents"></span>
        <button class="filtro-btn filtro-n" onclick="setFiltroPres('SIN',this)">Sin asignar</button>
        <span id="pres-count" style="font-size:12px;color:var(--text3);margin-left:4px"></span>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Desde</label>
        <input type="date" id="pres-desde" onchange="renderPresupuestos()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Hasta</label>
        <input type="date" id="pres-hasta" onchange="renderPresupuestos()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <button class="btn btn-sm" onclick="limpiarFechasPres()">✕ Limpiar fechas</button>
      </div>
      <div class="card">
        <table><thead><tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Deuda ant.</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody id="tabla-presupuestos"></tbody></table>
      </div>
    </div>

    <!-- PENDIENTE DE ENTREGA -->
    <div id="entrega" class="section">
      <div class="section-header">
        <h2>Pendiente de entrega 📦</h2>
        <span id="entrega-total" style="font-size:13px;color:var(--text2);font-weight:600"></span>
      </div>
      <div style="margin-bottom:10px"><input type="search" id="entrega-buscar" placeholder="🔍 Buscar por cliente o número de boleta..." oninput="renderEntrega()" style="width:100%;max-width:420px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px"></div>
      <div class="card">
        <table>
          <thead><tr>
            <th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pago</th><th></th>
          </tr></thead>
          <tbody id="tabla-entrega"></tbody>
        </table>
      </div>
    </div>

    <!-- DEUDORES -->
    <div id="deudores" class="section">
      <div class="section-header">
        <h2>Deudores 🔴</h2>
        <span id="deudores-total" style="font-size:13px;color:var(--red);font-weight:600"></span>
        <button class="btn btn-sm" id="btn-agrupar" onclick="abrirAgrupar()" style="display:none" title="Junta varias boletas en un solo deudor y elegís cuáles entran">🗂️ Juntar deudas en una sola</button>
      </div>
      <div style="margin-bottom:10px"><input type="search" id="deudores-buscar" placeholder="🔍 Buscar por cliente, número de boleta o teléfono..." oninput="renderDeudores()" style="width:100%;max-width:420px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center">
        <button class="filtro-btn active" onclick="setFiltroDeudor('',this)">Todos</button>
        <button class="filtro-btn filtro-g" onclick="setFiltroDeudor('G',this)">Gloria (G)</button>
        <button class="filtro-btn filtro-l" onclick="setFiltroDeudor('L',this)">Luis (L)</button>
        <button class="filtro-btn filtro-e" onclick="setFiltroDeudor('E',this)">Edgardo (E)</button>
        <span class="filtro-extra" data-fn="setFiltroDeudor" style="display:contents"></span>
        <button class="filtro-btn filtro-n" onclick="setFiltroDeudor('SIN',this)">Sin asignar</button>
      </div>
      <div class="card">
        <table>
          <thead><tr>
            <th>N°</th><th>Fecha</th><th>Cliente</th>
            <th>Total boleta</th><th>Ya pagó</th><th>Saldo pendiente</th>
            <th>Estado</th><th></th>
          </tr></thead>
          <tbody id="tabla-deudores"></tbody>
        </table>
      </div>
    </div>

    <!-- PROVEEDORES -->
    <div id="proveedores" class="section">
      <div class="section-header">
        <h2>Proveedores 🏭</h2>
        <div style="display:flex;gap:8px" id="prov-header-btns">
        </div>
      </div>

      <!-- Sub: lista de proveedores (por defecto) -->
      <div id="sub-proveedores">
        <div id="proveedores-cards"></div>
      </div>

      <!-- Sub: planilla de costos de un proveedor -->
      <div id="sub-planilla" style="display:none">
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <div style="font-size:16px;font-weight:700" id="planilla-titulo">Planilla de costos</div>
            <div style="flex:1;min-width:180px">
              <input type="text" id="planilla-filtro" class="inp" placeholder="Buscar producto o código..." oninput="filtrarPlanilla()" style="width:100%">
            </div>
            <label style="font-size:13px;color:var(--text2);display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="planilla-solosin" onchange="filtrarPlanilla()"> Solo sin costo
            </label>
            <button class="btn" onclick="cerrarPlanilla()">← Volver</button>
          </div>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <span style="font-size:13px;color:var(--text2)"><strong id="planilla-selcount">0</strong> seleccionados</span>
            <span style="font-size:13px;color:var(--text2)">Mismo costo para los seleccionados: $</span>
            <input type="text" inputmode="decimal" id="planilla-igual" class="inp" style="width:110px;text-align:right" placeholder="0,00" onkeydown="if(event.key==='Enter') aplicarIgualPlanilla()">
            <button class="btn btn-sm" onclick="aplicarIgualPlanilla()">Aplicar</button>
            <span style="flex:1"></span>
            <span id="planilla-cambios" style="font-size:13px;color:var(--text2)">Sin cambios</span>
            <button class="btn btn-primary" id="planilla-guardar" onclick="guardarPlanilla()">💾 Guardar todo</button>
          </div>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body">
            <div style="font-weight:700;margin-bottom:8px">📥 Cargar la lista de precios del proveedor (Excel o PDF)</div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
              <input type="file" id="xl-archivo" accept=".xlsx,.xls,.csv,.pdf" onchange="xlLeerArchivo(this)">
              <span id="xl-estado" style="font-size:13px;color:var(--text2)">Busca cada código de tus productos en el Excel y trae el precio como costo.</span>
            </div>
            <div id="xl-config" style="display:none;margin-top:10px">
              <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:13px">
                <label>Hoja <select id="xl-hoja" onchange="xlCambioHoja()" style="padding:5px 8px"></select></label>
                <label>Columna del código <select id="xl-col-cod" style="padding:5px 8px"></select></label>
                <label>Columna del precio <select id="xl-col-precio" style="padding:5px 8px"></select></label>
                <label>Primera fila con datos <input type="number" id="xl-fila" min="1" style="width:70px;padding:5px 8px"></label>
                <label>Descuento % <input type="text" id="xl-desc" placeholder="ej: 10 o 10+5" style="width:100px;padding:5px 8px"></label>
                <button class="btn btn-primary" onclick="xlAplicar()">Calcular costos</button>
              </div>
              <div id="xl-vista" style="margin-top:10px;overflow:auto;max-width:100%"></div>
              <div id="xl-resultado"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <table>
            <thead><tr>
              <th style="width:36px"><input type="checkbox" id="planilla-todos" onchange="planillaSelTodos(this.checked)"></th>
              <th>Código</th><th>Producto</th><th>Medida</th>
              <th style="text-align:right">Costo actual</th><th style="text-align:right">Nuevo costo</th>
            </tr></thead>
            <tbody id="tabla-planilla"></tbody>
          </table>
        </div>
        <p style="font-size:12px;color:var(--text3);margin-top:8px">Tips: marcá varios productos (con Shift podés marcar un rango) y poné el mismo costo a todos de una vez. También podés copiar una columna de precios desde Excel y pegarla en la primera celda de "Nuevo costo": se completa hacia abajo. Las celdas vacías no cambian el costo que ya tenía el producto.</p>
      </div>

      <!-- Sub: cuenta corriente de un proveedor -->
      <div id="sub-cuenta" style="display:none">
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <div style="font-size:16px;font-weight:700" id="cuenta-titulo">Cuenta</div>
            <div id="cuenta-saldo" style="font-size:15px"></div>
            <span style="flex:1"></span>
            <button class="btn btn-primary" onclick="abrirMovProv('pago')">💸 Registrar pago</button>
            <button class="btn" onclick="abrirMovProv('pedido')">+ Cargar deuda</button>
            <button class="btn" onclick="cerrarCuentaProv()">← Volver</button>
          </div>
        </div>
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body">
            <div style="font-weight:700;margin-bottom:8px">🧮 Calcular porcentaje</div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:13px">
              <label>Sobre $ <input type="text" inputmode="decimal" id="cp-base" placeholder="monto de la compra" oninput="calcPctProv()" style="width:150px;padding:5px 8px;text-align:right"></label>
              <label>Porcentaje <input type="text" inputmode="decimal" id="cp-pct" placeholder="25" oninput="calcPctProv()" style="width:70px;padding:5px 8px;text-align:right"> %</label>
              <button class="btn btn-sm" onclick="cpUsar('pedidos')" title="Suma de los pedidos que se ven abajo (según el filtro de fechas)">Usar total de pedidos</button>
              <button class="btn btn-sm" onclick="cpUsar('deuda')">Usar deuda actual</button>
            </div>
            <div id="cp-resultado" style="margin-top:10px;font-size:14px"></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;font-size:13px">
          <select id="cuenta-filtro" onchange="renderCuentaProv()" style="padding:5px 8px"><option value="todo">Historial completo</option><option value="pedido">Solo pedidos</option><option value="pago">Solo pagos</option></select>
          <span>Desde</span><input type="date" id="cuenta-desde" onchange="renderCuentaProv()" style="padding:5px 8px">
          <span>Hasta</span><input type="date" id="cuenta-hasta" onchange="renderCuentaProv()" style="padding:5px 8px">
          <span id="cuenta-totales" style="font-weight:600;margin-left:8px"></span>
        </div>
        <div class="card">
          <table>
            <thead><tr><th>Fecha</th><th>Detalle</th><th>Pedido (suma)</th><th>Pago (resta)</th><th>Saldo</th><th></th></tr></thead>
            <tbody id="tabla-cuenta"></tbody>
          </table>
        </div>
        <p style="font-size:12px;color:var(--text3);margin-top:8px">Los pedidos se cargan con el botón 📦 Registrar pedido de cada proveedor y suman acá su total. Los pagos restan. El saldo es lo que le debés.</p>
      </div>

      <!-- Sub: asignador de productos -->
      <div id="sub-asignar" style="display:none">
        <div class="card" style="margin-bottom:1rem">
          <div class="card-body" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <div style="flex:1;min-width:200px">
              <input type="text" id="asignar-filtro" class="inp" placeholder="Buscar producto..." oninput="renderAsignador()" style="width:100%">
            </div>
            <div class="form-group" style="margin:0;min-width:160px">
              <select id="asignar-filtro-prov" onchange="renderAsignador()" style="font-size:13px;padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
                <option value="">Todos los proveedores</option>
                <option value="SIN">Sin asignar</option>
              </select>
            </div>
            <button class="btn" onclick="showSubseccion('sub-proveedores')">← Volver</button>
          </div>
        </div>
        <div class="card">
          <table>
            <thead><tr>
              <th>Producto</th><th>Categoría</th><th>Medida</th>
              <th>Proveedor actual</th><th>Cambiar a</th><th></th>
            </tr></thead>
            <tbody id="tabla-asignador"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- A FAVOR -->
    <div id="afavor" class="section">
      <div class="section-header">
        <h2>A favor 🟢</h2>
        <span id="afavor-total" style="font-size:13px;color:var(--green);font-weight:600"></span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center">
        <button class="filtro-btn active" onclick="setFiltroAfavor('',this)">Todos</button>
        <button class="filtro-btn filtro-g" onclick="setFiltroAfavor('G',this)">Gloria (G)</button>
        <button class="filtro-btn filtro-l" onclick="setFiltroAfavor('L',this)">Luis (L)</button>
        <button class="filtro-btn filtro-e" onclick="setFiltroAfavor('E',this)">Edgardo (E)</button>
        <span class="filtro-extra" data-fn="setFiltroAfavor" style="display:contents"></span>
        <button class="filtro-btn filtro-n" onclick="setFiltroAfavor('SIN',this)">Sin asignar</button>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total boleta</th><th>Total pagado</th><th>Saldo a favor</th><th></th></tr></thead>
          <tbody id="tabla-afavor"></tbody>
        </table>
      </div>
    </div>

    <!-- CAJA -->
    <div id="caja" class="section">
      <div class="section-header">
        <h2>Caja 💰</h2>
        <button class="btn btn-primary" onclick="abrirModalMovimiento()">+ Registrar movimiento</button>
      </div>
      <!-- Resumen -->
      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat-card stat-green">
          <div class="slabel">💵 Efectivo</div>
          <div class="svalue" id="caja-efectivo">$0</div>
          <div class="ssub">saldo actual</div>
        </div>
        <div class="stat-card stat-blue">
          <div class="slabel">🏦 Transferencia</div>
          <div class="svalue" id="caja-transf">$0</div>
          <div class="ssub">saldo actual</div>
        </div>
        <div class="stat-card">
          <div class="slabel">📊 Total</div>
          <div class="svalue" id="caja-total">$0</div>
          <div class="ssub">efectivo + transferencia</div>
        </div>
      </div>
      <!-- Filtro fecha -->
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap">
        <button class="filtro-btn fc-per active" onclick="setFiltroCaja('hoy',this)">Hoy</button>
        <button class="filtro-btn fc-per" onclick="setFiltroCaja('semana',this)">Esta semana</button>
        <button class="filtro-btn fc-per" onclick="setFiltroCaja('mes',this)">Este mes</button>
        <button class="filtro-btn fc-per" onclick="setFiltroCaja('todo',this)">Todo</button>
        <span style="font-size:13px;color:var(--text2);margin-left:8px">📅 Entre fechas:</span>
        <input type="date" id="caja-desde" onchange="setRangoCaja()" style="padding:5px 8px">
        <span style="font-size:13px;color:var(--text2)">y</span>
        <input type="date" id="caja-hasta" onchange="setRangoCaja()" style="padding:5px 8px">
      </div>
      <div id="caja-periodo" style="display:none;margin-bottom:1rem" class="card"><div class="card-body" style="display:flex;gap:18px;flex-wrap:wrap;align-items:center;font-size:14px"></div></div>
      <!-- Filtro medio -->
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
        <button class="filtro-btn active" id="filtro-medio-btn-todos" onclick="setFiltroMedio('todos',this)">💵🏦 Todos</button>
        <button class="filtro-btn" onclick="setFiltroMedio('Efectivo',this)">💵 Efectivo</button>
        <button class="filtro-btn" onclick="setFiltroMedio('Transferencia',this)">🏦 Transferencia</button>
      </div>
      <!-- Tabla movimientos -->
      <div class="card">
        <table>
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Medio</th><th>Entrada</th><th>Salida</th><th></th></tr></thead>
          <tbody id="tabla-caja"></tbody>
        </table>
      </div>
    </div>

    <!-- GANANCIA -->
    <div id="ganancia" class="section">
      <div class="section-header">
        <h2>Ganancia por presupuesto 📈</h2>
      </div>
      <!-- Buscador de presupuesto -->
      <div class="card">
        <div class="card-body">
          <div class="form-group" style="margin-bottom:12px">
            <label>Buscar presupuesto por número o cliente</label>
            <div class="ac-wrap">
              <input type="text" id="gan-search" class="inp" placeholder="Escribí número o nombre de cliente..." oninput="acGanancia(this.value)" autocomplete="off" style="width:100%">
              <div class="ac-list" id="gan-ac"></div>
            </div>
          </div>
          <div id="gan-resultado" style="display:none">
            <!-- Resumen boleta -->
            <div style="background:var(--bg);border-radius:var(--radius);padding:14px 16px;margin-bottom:1rem">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
                <div>
                  <span style="font-size:18px;font-weight:700" id="gan-titulo">—</span>
                  <span style="font-size:12px;color:var(--text2);margin-left:10px" id="gan-fecha">—</span>
                </div>
                <span style="font-size:13px;color:var(--text2)" id="gan-cliente">—</span>
              </div>
            </div>
            <!-- Stats -->
            <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:1rem">
              <div class="stat-card stat-blue">
                <div class="slabel">Total boleta</div>
                <div class="svalue" id="gan-total">$0</div>
                <div class="ssub">precio de venta</div>
              </div>
              <div class="stat-card stat-amber">
                <div class="slabel">Costo total</div>
                <div class="svalue" id="gan-costo">$0</div>
                <div class="ssub">precio de costo</div>
              </div>
              <div class="stat-card stat-green">
                <div class="slabel">Ganancia bruta</div>
                <div class="svalue" id="gan-ganancia">$0</div>
                <div class="ssub" id="gan-margen">0%</div>
              </div>
              <div class="stat-card">
                <div class="slabel">Deuda anterior</div>
                <div class="svalue" id="gan-deuda">$0</div>
                <div class="ssub">no se computa en ganancia</div>
              </div>
            </div>
            <!-- Detalle por producto -->
            <div class="card">
              <div class="card-header"><h3>Detalle por producto</h3></div>
              <table>
                <thead><tr>
                  <th>Producto</th><th>Cant.</th>
                  <th>P. venta</th><th>P. costo</th>
                  <th>Subtotal venta</th><th>Subtotal costo</th><th>Ganancia</th><th>Margen</th>
                </tr></thead>
                <tbody id="gan-tabla"></tbody>
              </table>
            </div>
            <div id="gan-aviso" style="display:none;background:var(--amber-light);border-radius:var(--radius);padding:10px 14px;font-size:13px;color:var(--amber);margin-top:8px">
              ℹ️ Algunos productos no tienen costo cargado: se tomó como costo el mismo precio de venta, así que su ganancia es $0.
            </div>
          </div>
          <div id="gan-vacio" style="text-align:center;color:var(--text3);padding:2rem;font-size:13px">
            Buscá un presupuesto para ver su ganancia
          </div>
        </div>
      </div>
    </div>

    <!-- CONTROL DE STOCK -->
    <div id="controlstock" class="section">
      <div class="section-header"><h2>Control de stock 📋</h2></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <button class="filtro-btn active" id="cs-tab-semanal" onclick="csVista('semanal')">📋 Control de stock semanal</button>
        <button class="filtro-btn" id="cs-tab-guardado" onclick="csVista('guardado')">📦 Stock guardado</button>
      </div>
      <div id="cs-vista-semanal">
      <div class="section-header">
        <h3 style="font-size:15px;margin:0">Control semanal</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" onclick="csLimpiar()">Borrar lo escrito</button>
          <button class="btn btn-green" onclick="csAplicar()">✅ Aplicar control</button>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Escribí lo que contaste de cada producto (Enter pasa al siguiente). Lo que dejes vacío no se toca. El stock guardado no se cuenta acá. Al aplicar, el stock queda como lo contaste.</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <input type="search" id="cs-buscar" placeholder="🔍 Buscar producto..." oninput="renderControlStock()" style="flex:1;min-width:200px;max-width:340px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px">
        <select id="cs-cat" class="inp" onchange="renderControlStock()" style="width:auto"></select>
        <label style="font-size:13px"><input type="checkbox" id="cs-ocultar-cero" checked onchange="renderControlStock()"> Ocultar los que tienen stock 0</label>
        <label style="font-size:13px"><input type="checkbox" id="cs-solo-sin" onchange="renderControlStock()"> Solo los que faltan contar</label>
        <span id="cs-resumen" style="font-size:12px;color:var(--text3)"></span>
      </div>
      <div class="card">
        <table><thead><tr><th>Producto</th><th>Categoría</th><th style="text-align:right">En el sistema</th><th style="text-align:right">Contado</th><th style="text-align:right">Diferencia</th><th></th></tr></thead>
        <tbody id="cs-tabla"></tbody></table>
      </div>
      <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:8px">Últimos controles</h3><div id="cs-historial"></div></div></div>
      </div>
      <div id="cs-vista-guardado" style="display:none">
        <div class="section-header">
          <h3 style="font-size:15px;margin:0">Stock guardado (reserva)</h3>
          <button class="btn btn-green" onclick="cgGuardar()">💾 Guardar cambios</button>
        </div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Es la mercadería que tenés guardada y no se mueve: no se cuenta en el control semanal ni se descuenta con las ventas. Podés escribir la cantidad directo, o pasar una parte del stock al guardado y volver a pasarla al stock cuando la necesites.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          <input type="search" id="cg-buscar" placeholder="🔍 Buscar producto..." oninput="renderGuardado()" style="flex:1;min-width:200px;max-width:340px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px">
          <label style="font-size:13px"><input type="checkbox" id="cg-todos" onchange="renderGuardado()"> Mostrar también los que no tienen guardado</label>
          <span id="cg-resumen" style="font-size:12px;color:var(--text3)"></span>
        </div>
        <div class="card">
          <table><thead><tr><th>Producto</th><th style="text-align:right">En el sistema (se cuenta)</th><th style="text-align:right">Guardado</th><th>Pasar de uno a otro</th></tr></thead>
          <tbody id="cg-tabla"></tbody></table>
        </div>
      </div>
    </div>

    <!-- CONTABILIDAD -->
    <div id="contabilidad" class="section">
      <div class="section-header">
        <h2>Contabilidad y balance 🧮</h2>
        <button class="btn btn-green" onclick="descargarContabilidad()">⬇️ Descargar resumen (Excel)</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Desde</label>
        <input type="date" id="ctb-desde" onchange="renderContabilidad()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Hasta</label>
        <input type="date" id="ctb-hasta" onchange="renderContabilidad()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <button class="btn btn-sm" onclick="ctbPeriodo('mes')">Este mes</button>
        <button class="btn btn-sm" onclick="ctbPeriodo('mesant')">Mes pasado</button>
        <button class="btn btn-sm" onclick="ctbPeriodo('anio')">Este año</button>
        <button class="btn btn-sm" onclick="ctbPeriodo('todo')">Todo</button>
      </div>
      <div id="ctb-kpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:1.25rem"></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px">
        <div class="card"><div class="card-body" id="ctb-resultados"></div></div>
        <div class="card"><div class="card-body" id="ctb-balance"></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Ventas y ganancia — últimos 12 meses</h3><div id="ctb-g-meses"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Flujo de caja — últimos 12 meses</h3><div id="ctb-g-caja"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Ventas por grupo (Gloria, Luis, Edgardo…)</h3><div id="ctb-g-grupos"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Ventas por categoría de producto</h3><div id="ctb-g-categorias"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Top 10 clientes por ventas</h3><div id="ctb-g-clientes"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Top 10 productos por ganancia</h3><div id="ctb-g-productos"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Antigüedad de lo que nos deben</h3><div id="ctb-g-aging"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Top 10 deudores</h3><div id="ctb-g-deudores"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:4px">Mayor valor en stock (a costo)</h3><div style="font-size:11px;color:var(--text3);margin-bottom:8px">Revisá que el stock y el costo estén en la misma unidad: un error acá infla el balance.</div><div id="ctb-g-stock"></div></div></div>
        <div class="card"><div class="card-body"><h3 style="font-size:14px;margin-bottom:10px">Caja por medio de pago (período)</h3><div id="ctb-g-medios"></div></div></div>
        <div class="card"><div class="card-body"><div id="ctb-g-gastos"></div></div></div>
      </div>
      <div style="font-size:12px;color:var(--text3);margin-top:4px">Ventas = suma de los productos de cada boleta (sin la deuda anterior), sin contar rechazadas ni vencidas. Si un producto no tiene costo, se toma como costo el mismo precio de venta. Los gastos son las salidas cargadas en Caja.</div>
    </div>

    <!-- VENTAS -->
    <div id="ventas" class="section">
      <div class="section-header">
        <h2>Ventas 📊</h2>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center">
        <button class="filtro-btn" onclick="setPeriodoVentas('hoy',this)">Hoy</button>
        <button class="filtro-btn" onclick="setPeriodoVentas('semana',this)">Esta semana</button>
        <button class="filtro-btn active" onclick="setPeriodoVentas('mes',this)">Este mes</button>
        <button class="filtro-btn" onclick="setPeriodoVentas('mespasado',this)">Mes pasado</button>
        <button class="filtro-btn" onclick="setPeriodoVentas('todo',this)">Todo</button>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Desde</label>
        <input type="date" id="ventas-desde" onchange="ventasFechasManual()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <label style="font-size:12px;color:var(--text2);font-weight:500">Hasta</label>
        <input type="date" id="ventas-hasta" onchange="ventasFechasManual()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
        <select id="ventas-estado" onchange="renderVentas()" style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text)">
          <option value="activas">Todas (menos rechazadas y vencidas)</option>
          <option value="aprobado">Solo aprobadas (cobradas)</option>
          <option value="todas">Todas, sin excluir ninguna</option>
        </select>
      </div>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="ventas-buscar" placeholder="Filtrar por producto (los totales se recalculan solo para ese producto)..." oninput="renderVentas()">
      </div>
      <div class="stats-grid">
        <div class="stat-card stat-blue"><div class="slabel">Ventas</div><div class="svalue" id="v-venta">$0</div><div class="ssub" id="v-boletas">0 boletas</div></div>
        <div class="stat-card stat-amber"><div class="slabel">Costo de mercadería</div><div class="svalue" id="v-costo">$0</div><div class="ssub">lo que costó lo vendido</div></div>
        <div class="stat-card stat-green"><div class="slabel">Ganancia</div><div class="svalue" id="v-ganancia">$0</div><div class="ssub" id="v-margen">Margen: 0%</div></div>
        <div class="stat-card"><div class="slabel">Unidades vendidas</div><div class="svalue" id="v-unidades">0</div><div class="ssub" id="v-productos">0 productos distintos</div></div>
      </div>
      <div id="v-aviso" style="display:none;background:var(--amber-light);border-radius:var(--radius);padding:10px 14px;font-size:13px;color:var(--amber);margin-bottom:12px"></div>
      <div class="card">
        <div class="card-header"><h3>Detalle por producto (ordenado por unidades vendidas)</h3></div>
        <table>
          <thead><tr>
            <th>Producto</th><th>Unidades</th><th>Venta</th><th>Costo</th><th>Ganancia</th><th>Margen</th>
          </tr></thead>
          <tbody id="tabla-ventas"></tbody>
        </table>
      </div>
      <p style="font-size:12px;color:var(--text3);margin-top:8px">El costo se calcula con el precio de costo que tiene cargado cada producto hoy. La deuda anterior que arrastra una boleta no cuenta como venta.</p>
    </div>

    <!-- ACTIVIDAD -->
    <div id="actividad" class="section">
      <div class="section-header">
        <h2>Registro de actividad 📋</h2>
        <button class="btn btn-danger btn-sm" onclick="if(confirm('¿Borrar todo el historial?')){db.actividad=[];guardar();renderActividad();}">🗑️ Limpiar historial</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="filtro-btn active" onclick="setFiltroActividad('',this)">Todo</button>
        <button class="filtro-btn" onclick="setFiltroActividad('presupuesto',this)">🧾 Presupuestos</button>
        <button class="filtro-btn" onclick="setFiltroActividad('pago',this)">💲 Pagos</button>
        <button class="filtro-btn" onclick="setFiltroActividad('eliminacion',this)">🗑️ Eliminaciones</button>
      </div>
      <div class="card">
        <table>
          <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
          <tbody id="tabla-actividad"></tbody>
        </table>
      </div>
    </div>

    <!-- CONFIG -->
    <div id="config" class="section">
      <div class="section-header"><h2>Configuración de la empresa</h2></div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3>Copia de seguridad</h3></div>
        <div class="card-body">
          <div style="font-size:13px;color:var(--text3);margin-bottom:10px">Descarga TODO lo que ves en esta computadora (productos, clientes, boletas, listas, caja) en un archivo. Sirve para guardar una copia o pasar los datos a otra computadora.</div>
          <button class="btn btn-primary" onclick="descargarBackup()">💾 Descargar copia de seguridad</button>
          <button class="btn" onclick="document.getElementById('bk-file').click()">📂 Restaurar desde un archivo</button>
          <input type="file" id="bk-file" accept=".json" style="display:none" onchange="restaurarBackup(this)">
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>Datos que aparecen en los presupuestos impresos</h3></div>
        <div class="card-body">
          <div class="form-grid form-grid-2" style="margin-bottom:12px">
            <div class="form-group"><label>Nombre / Razón social</label><input type="text" id="cfg-nombre" placeholder="Ej: Distribuidora HAP"></div>
            <div class="form-group"><label>CUIT</label><input type="text" id="cfg-cuit" placeholder="20-12345678-9"></div>
          </div>
          <div class="form-grid form-grid-2" style="margin-bottom:12px">
            <div class="form-group"><label>Teléfono</label><input type="text" id="cfg-tel"></div>
            <div class="form-group"><label>Email</label><input type="text" id="cfg-email"></div>
          </div>
          <div class="form-grid form-grid-2" style="margin-bottom:12px">
            <div class="form-group"><label>Dirección</label><input type="text" id="cfg-dir"></div>
            <div class="form-group"><label>Condición IVA</label>
              <select id="cfg-iva"><option>Responsable Inscripto</option><option>Monotributista</option><option>Exento</option></select>
            </div>
          </div>
          <div class="form-grid form-grid-2" style="margin-bottom:12px">
            <div class="form-group"><label>Días de validez por defecto</label><input type="number" id="cfg-dias" value="15"></div>
            <div class="form-group"><label>Filas vacías en presupuesto</label><input type="number" id="cfg-filas" value="12" min="5" max="25"></div>
            <div class="form-group"><label>% sobre costo para Lista General</label>
              <div style="display:flex;align-items:center;gap:8px">
                <input type="number" id="cfg-margen-general" value="30" min="0" max="999" step="1" style="width:80px"> 
                <span style="font-size:13px;color:var(--text2)">% (ej: 30 = costo + 30%)</span>
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px">
            <label>Próximo número de boleta</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="number" id="cfg-contador" min="1" style="width:140px">
              <span style="font-size:12px;color:var(--text3)">La siguiente boleta usará este número</span>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px"><label>Texto al pie del presupuesto</label><textarea id="cfg-pie" placeholder="Ej: Precios sujetos a variación sin previo aviso."></textarea></div>
          <div class="form-group" style="margin-bottom:16px">
            <label>Contraseña de administrador</label>
            <input type="password" id="cfg-pass" placeholder="Dejar vacío para no cambiar">
          </div>
          <button class="btn btn-primary" onclick="guardarConfig()">Guardar configuración</button>
          <span id="cfg-ok" style="font-size:12px;color:var(--green);margin-left:12px;display:none">✓ Guardado</span>
        </div>
      </div>
      <div class="card" style="margin-top:1rem">
        <div class="card-header"><h3>👥 Empleados</h3></div>
        <div class="card-body">
          <div id="lista-empleados" style="margin-bottom:1rem"></div>
          <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
            <div class="form-group" style="margin:0;flex:1;min-width:140px">
              <label>Nombre del empleado</label>
              <input type="text" id="emp-nuevo-nombre" placeholder="Ej: Mauri">
            </div>
            <div class="form-group" style="margin:0;flex:1;min-width:140px">
              <label>Contraseña (opcional)</label>
              <input type="password" id="emp-nuevo-pass" placeholder="Sin contraseña = acceso libre">
            </div>
            <div class="form-group" style="margin:0;min-width:150px">
              <label>Nivel</label>
              <select id="emp-nuevo-nivel"><option value="empleado">Empleado</option><option value="caja">Empleado + Caja</option><option value="socio">Socio (todo)</option></select>
            </div>
            <button class="btn btn-primary" onclick="agregarEmpleado()">+ Agregar</button>
          </div>
        </div>
      </div>
        <div class="card-body">
          <p style="font-size:13px;color:var(--text2);margin-bottom:1rem">Exportá todos tus datos (productos, clientes, presupuestos) a un archivo de respaldo. Después podés importarlo en cualquier otra computadora abriendo el mismo archivo <strong>papelera.html</strong>.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="exportarDatos()">⬇️ Exportar datos (respaldo)</button>
            <label class="btn" style="cursor:pointer">⬆️ Importar datos <input type="file" accept=".json" onchange="importarDatos(this)" style="display:none"></label>
          </div>
          <div id="import-msg" style="margin-top:10px;font-size:13px;display:none"></div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- MODAL PAGO PARCIAL -->
<div class="modal-backdrop" id="modal-pago">
  <div class="modal">
    <h3 id="pago-titulo">Registrar pago</h3>
    <div style="background:var(--bg);border-radius:var(--radius);padding:12px;margin-bottom:1rem;font-size:13px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="color:var(--text2)">Cliente:</span><strong id="pago-cliente-nombre">—</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="color:var(--text2)">Boleta N°:</span><strong id="pago-numero">—</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="color:var(--text2)">Total boleta:</span><strong id="pago-total">—</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="color:var(--text2)">Ya pagó:</span><strong id="pago-ya-pago" style="color:var(--green)">—</strong>
      </div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
        <span style="color:var(--text2)">Saldo pendiente:</span><strong id="pago-saldo" style="color:var(--red);font-size:15px">—</strong>
      </div>
    </div>

    <div id="historial-pagos" style="margin-bottom:1rem"></div>

    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group">
        <label>Monto que paga ahora ($) *</label>
        <input type="number" id="pago-monto" placeholder="0.00" step="0.01" oninput="actualizarNuevoSaldo()">
      </div>
      <div class="form-group">
        <label>Forma de pago</label>
        <select id="pago-forma">
          <option>Efectivo</option><option>Transferencia</option>
          <option>Tarjeta débito</option><option>Tarjeta crédito</option>
        </select>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label>Nota (opcional)</label>
      <input type="text" id="pago-nota" placeholder="Ej: abono parcial, seña...">
    </div>
    <div id="nuevo-saldo-preview" style="display:none;background:var(--blue-light);border-radius:var(--radius);padding:10px 14px;font-size:13px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between">
        <span>Nuevo saldo pendiente:</span><strong id="nuevo-saldo-val" style="color:var(--blue-text)"></strong>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" id="pago-btn-ok" onclick="confirmarPago()">Registrar pago</button>
    </div>
  </div>
</div>
<!-- MODAL MARCAR ENTREGADAS -->
<div class="modal-backdrop" id="modal-masiva">
  <div class="modal" style="max-width:760px;width:95%">
    <h3>Marcar boletas como entregadas</h3>
    <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Tildá las boletas que ya se entregaron. Salen de Presupuestos: las que tienen deuda pasan a Deudores y las que tienen a favor quedan en A favor.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
      <input type="search" id="masiva-buscar" placeholder="🔍 Filtrar por cliente o número..." oninput="renderMasiva()" style="flex:1;min-width:200px;padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px">
      <button class="btn btn-sm" onclick="masivaTildarVisibles(true)">Tildar las que se ven</button>
      <button class="btn btn-sm" onclick="masivaTildarVisibles(false)">Destildar</button>
      <span id="masiva-n" style="font-size:12px;color:var(--text3)"></span>
    </div>
    <div style="max-height:50vh;overflow:auto;margin-bottom:12px"><table style="width:100%"><thead><tr><th></th><th>N°</th><th>Fecha</th><th>Cliente</th><th style="text-align:right">Total</th><th>Cuenta</th></tr></thead><tbody id="masiva-tabla"></tbody></table></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-green" onclick="aplicarMasiva()">✅ Marcar como entregadas</button>
    </div>
  </div>
</div>
<!-- MODAL COBRO TOTAL -->
<div class="modal-backdrop" id="modal-medio">
  <div class="modal" style="max-width:420px">
    <h3>Cambiar medio de pago</h3>
    <div id="medio-info" style="font-size:13px;color:var(--text2);margin-bottom:12px"></div>
    <div class="form-group" style="margin-bottom:12px">
      <label>Pagó con</label>
      <select id="medio-nuevo"><option>Efectivo</option><option>Transferencia</option><option>Tarjeta débito</option><option>Tarjeta crédito</option></select>
    </div>
    <label id="medio-boleta-wrap" style="display:none;font-size:13px;align-items:center;gap:8px;margin-bottom:6px"><input type="checkbox" id="medio-boleta" checked> Cambiar también en el pago de la boleta <span id="medio-boleta-num"></span></label>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-green" onclick="confirmarCambioMedio()">✅ Guardar</button>
    </div>
  </div>
</div>
<div class="modal-backdrop" id="modal-cobro">
  <div class="modal" style="max-width:420px">
    <h3>Cobrar boleta completa</h3>
    <div id="cobro-info" style="font-size:13px;color:var(--text2);margin-bottom:12px"></div>
    <div class="form-group" id="cobro-monto-wrap" style="display:none;margin-bottom:12px">
      <label>Monto que paga ahora ($) — si es menos que el total, queda el resto como deuda</label>
      <input type="number" id="cobro-monto" step="0.01" placeholder="0.00">
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label>¿Cómo pagó?</label>
      <select id="cobro-forma" onchange="cobroFormaCambio()">
        <option>Efectivo</option><option>Transferencia</option><option>Efectivo + Transferencia</option>
        <option>Tarjeta débito</option><option>Tarjeta crédito</option>
      </select>
    </div>
    <div class="form-group" id="cobro-mixto" style="display:none;margin-bottom:12px">
      <label>Parte en efectivo ($) — el resto va como transferencia</label>
      <input type="number" id="cobro-efvo" step="0.01" placeholder="0.00">
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-green" onclick="confirmarCobroTotal()">✅ Cobrar</button>
    </div>
  </div>
</div>
<div class="modal-backdrop" id="modal-agrupar">
  <div class="modal" style="max-width:560px;width:95%">
    <h3>Agrupar una semana como un solo deudor</h3>
    <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Elegí el grupo (o cualquier cliente) y las fechas, y tildá las boletas que querés juntar. Pasan a figurar en Deudores como una sola línea; cuando te pagan todo junto lo marcás una vez y quedan todas cobradas.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
      <select id="agr-grupo" onchange="agruparPreview()" style="padding:6px 10px"><option value="G">Gloria (G)</option><option value="L" selected>Luis (L)</option><option value="E">Edgardo (E)</option><option value="*">Cualquier cliente (elijo yo)</option></select>
      <label style="font-size:12px">Desde</label><input type="date" id="agr-desde" onchange="agruparPreview()" style="padding:6px 10px">
      <label style="font-size:12px">Hasta</label><input type="date" id="agr-hasta" onchange="agruparPreview()" style="padding:6px 10px">
    </div>
    <div style="margin-bottom:10px"><input type="text" id="agr-nombre" placeholder="Nombre del deudor (se completa solo, podés cambiarlo)" oninput="this.dataset.manual='1'" style="width:100%;padding:6px 10px"></div>
    <div id="agr-resumen" style="font-size:13px;font-weight:600;margin-bottom:8px"></div>
    <div style="max-height:40vh;overflow:auto;margin-bottom:12px"><table style="width:100%"><thead><tr><th><input type="checkbox" id="agr-todos" checked onchange="agruparTodos(this.checked)" title="Marcar / desmarcar todas"></th><th>Cliente</th><th style="text-align:right">Boleta</th><th style="text-align:right">Debe</th></tr></thead><tbody id="agr-tabla"></tbody></table></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-green" onclick="confirmarAgrupar()">🗂️ Agrupar</button>
    </div>
  </div>
</div>
<!-- MODAL RESUMEN OFICINA -->
<div class="modal-backdrop" id="modal-resumen">
  <div class="modal" style="max-width:720px;width:95%">
    <h3 id="resumen-titulo">Resumen de consumo</h3>
    <div id="resumen-periodo" style="font-size:13px;color:var(--text2);margin-bottom:10px"></div>
    <div style="max-height:55vh;overflow:auto;margin-bottom:12px"><table style="width:100%"><thead><tr><th title="Tildá los que van en el resumen"></th><th>Cliente</th><th style="text-align:right">Boletas</th><th style="text-align:right">Consumo</th><th style="text-align:right">Pagó</th><th style="text-align:right">A pagar (período)</th><th style="text-align:right">Cuenta total</th></tr></thead><tbody id="resumen-tabla"></tbody></table></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cerrar</button>
      <button class="btn btn-green" onclick="descargarResumenOficina()">⬇️ Descargar Excel</button>
      <select id="det-prov" title="Qué productos incluir en el detalle por boleta" style="padding:6px 8px;font-size:13px;max-width:190px"><option value="">Todos los productos</option></select>
      <button class="btn btn-green" onclick="descargarDetalleBoletas()" title="Una fila por producto de cada boleta: Fecha, Sucursal, Nº de remito, Cantidad, Producto, Precio, Importe">⬇️ Detalle por boleta (Excel)</button>
      <button class="btn btn-green" onclick="imprimirResumenOficina()" title="Se abre la impresión: elegí Guardar como PDF">📄 PDF para enviar</button>
    </div>
  </div>
</div>
<!-- MODAL PROVEEDOR -->
<div class="modal-backdrop" id="modal-proveedor">
  <div class="modal">
    <h3 id="titulo-modal-prov">Nuevo proveedor</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Nombre *</label><input type="text" id="prov-nombre" placeholder="Ej: Kohut"></div>
      <div class="form-group"><label>Teléfono</label><input type="text" id="prov-tel"></div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Email</label><input type="email" id="prov-email"></div>
      <div class="form-group"><label>Contacto / Vendedor</label><input type="text" id="prov-contacto" placeholder="Nombre del vendedor"></div>
    </div>
    <div class="form-group" style="margin-bottom:12px"><label>Dirección</label><input type="text" id="prov-dir"></div>
    <div class="form-group" style="margin-bottom:12px"><label>Notas</label><textarea id="prov-notas" placeholder="Días de entrega, condiciones, etc."></textarea></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarProveedor()">Guardar</button>
    </div>
  </div>
</div>

<!-- MODAL ASIGNAR PRODUCTO A PROVEEDOR -->
<div class="modal-backdrop" id="modal-asignar-prod">
  <div class="modal">
    <h3 id="titulo-asignar-prod">Agregar producto a proveedor</h3>
    <div class="form-group" style="margin-bottom:12px">
      <label>Buscar producto existente</label>
      <div class="ac-wrap">
        <input type="text" id="asignar-prod-search" class="inp" placeholder="Escribí el nombre del producto..." oninput="acAsignarProd(this.value)" autocomplete="off" style="width:100%">
        <input type="hidden" id="asignar-prod-idx">
        <div class="ac-list" id="asignar-prod-ac"></div>
      </div>
    </div>
    <div id="asignar-prod-info" style="display:none;background:var(--bg);border-radius:var(--radius);padding:10px 14px;font-size:13px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between">
        <span style="color:var(--text2)">Producto seleccionado:</span>
        <strong id="asignar-prod-nombre">—</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span style="color:var(--text2)">Proveedor actual:</span>
        <span id="asignar-prod-provactual" style="color:var(--text3)">—</span>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label>Precio de costo ($)</label>
      <input type="number" id="asignar-prod-costo" placeholder="0.00" step="0.01">
    </div>
    <p style="font-size:12px;color:var(--text3);margin-bottom:1rem">Si el producto no existe aún, podés crearlo desde la sección Productos / Stock y después asignarlo acá.</p>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarAsignarProd()">Asignar producto</button>
    </div>
  </div>
</div>

<!-- MODAL PEDIDO PROVEEDOR -->
<div class="modal-backdrop" id="modal-pedido">
  <div class="modal modal-wide">
    <h3 id="titulo-modal-pedido">Registrar pedido</h3>
    <div style="background:var(--bg);border-radius:var(--radius);padding:10px 14px;margin-bottom:1rem;font-size:13px;color:var(--text2)">
      Los productos que recibís se suman automáticamente al stock.
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:1rem">
      <div class="form-group"><label>Fecha del pedido</label><input type="date" id="ped-fecha"></div>
      <div class="form-group"><label>N° de remito / factura (opcional)</label><input type="text" id="ped-remito" placeholder="Ej: 0001-00012345"></div>
    </div>
    <div style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Productos recibidos</div>
    <div id="lineas-pedido"></div>
    <button class="btn" style="width:100%;justify-content:center;margin-top:8px" onclick="agregarLineaPedido()">+ Agregar producto</button>
    <div id="ped-admin-extra" style="margin-top:12px">
      <div class="form-group"><label>Total del pedido ($) — se suma a lo que le debés al proveedor</label><input type="text" inputmode="decimal" id="ped-total" placeholder="0,00" oninput="this.dataset.manual='1'"></div>
      <label style="font-size:13px;display:flex;gap:6px;align-items:center;margin-top:8px"><input type="checkbox" id="ped-stock" checked> Sumar los productos al stock</label>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarPedido()">✅ Confirmar pedido</button>
    </div>
  </div>
</div>

<!-- MODAL MOVIMIENTO CUENTA PROVEEDOR -->
<div class="modal-backdrop" id="modal-provmov">
  <div class="modal">
    <h3 id="titulo-pmov">Movimiento con proveedor</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Tipo</label><select id="pmov-tipo" onchange="pmovCambio()"><option value="pago">Pago al proveedor (baja la deuda)</option><option value="pedido">Deuda / pedido sin cargar productos (sube la deuda)</option></select></div>
      <div class="form-group"><label>Monto ($)</label><input type="text" inputmode="decimal" id="pmov-monto" placeholder="0,00"></div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Fecha</label><input type="date" id="pmov-fecha"></div>
      <div class="form-group"><label>Nota (opcional)</label><input type="text" id="pmov-desc" placeholder="Ej: factura 123, cheque, saldo anterior..."></div>
    </div>
    <div id="pmov-pagoextra" style="margin-bottom:12px">
      <div class="form-group" style="margin-bottom:8px"><label>Pagado con</label><select id="pmov-medio"><option>Efectivo</option><option>Transferencia</option></select></div>
      <label style="font-size:13px;display:flex;gap:6px;align-items:center"><input type="checkbox" id="pmov-caja" checked> Descontarlo también de la Caja (sale como movimiento)</label>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmarMovProv()">Guardar</button>
    </div>
  </div>
</div>

<!-- MODAL MOVIMIENTO CAJA -->
<div class="modal-backdrop" id="modal-movimiento">
  <div class="modal">
    <h3>Registrar movimiento</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Tipo</label>
        <select id="mov-tipo">
          <option value="entrada">Entrada (ingreso)</option>
          <option value="salida">Salida (gasto / retiro)</option>
        </select>
      </div>
      <div class="form-group"><label>Medio de pago</label>
        <select id="mov-medio">
          <option>Efectivo</option>
          <option>Transferencia</option>
        </select>
      </div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Monto ($) *</label><input type="number" id="mov-monto" placeholder="0.00" step="0.01"></div>
      <div class="form-group"><label>Fecha</label><input type="date" id="mov-fecha"></div>
    </div>
    <div class="form-group" style="margin-bottom:12px"><label>Descripción *</label><input type="text" id="mov-desc" placeholder="Ej: Pago proveedor, retiro, gasto envío..."></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarMovimiento()">Guardar</button>
    </div>
  </div>
</div>

<div id="print-area"></div>

<!-- MODAL PRODUCTO -->
<div class="modal-backdrop" id="modal-producto">
  <div class="modal">
    <h3 id="titulo-mod-prod">Nuevo producto</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Nombre *</label><input type="text" id="p-nombre" placeholder="Ej: Bolsa camiseta negra"></div>
      <div class="form-group"><label>Proveedor</label>
        <select id="p-proveedor" style="font-size:13px;padding:8px 11px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);width:100%">
          <option value="">Sin asignar</option>
        </select>
      </div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Categoría</label>
        <select id="p-cat">
          <option>Bolsas camiseta</option><option>Bolsas de residuos</option><option>Film stretch</option>
          <option>Rollos polietileno</option><option>Mangas / tubo</option><option>Bolsas autocierre</option>
          <option>Bolsas de cultivo</option><option>Láminas polietileno</option><option>Otro</option>
        </select>
      </div>
    </div>
    <div class="form-grid form-grid-3" style="margin-bottom:12px">
      <div class="form-group"><label>Código</label><input type="text" id="p-codigo" placeholder="Ej: 1004"></div>
      <div class="form-group"><label>Medida / Presentación</label><input type="text" id="p-medida" placeholder="Ej: 45x60 blanca x100"></div>
      <div class="form-group"><label>Unidad de venta</label><input type="text" id="p-unidad" placeholder="paquete, rollo, kg..."></div>
    </div>
    <div class="form-grid form-grid-3" style="margin-bottom:12px">
      <div class="form-group"><label>Precio de costo ($)</label><input type="number" id="p-costo" placeholder="Solo editable desde Proveedores" step="0.01" readonly style="background:var(--bg);color:var(--text3)"></div>
      <div class="form-group"><label>Precio de venta ($) *</label><input type="number" id="p-precio" placeholder="0.00" step="0.01" oninput="calcMargen()"></div>
      <div class="form-group"><label>Margen</label><input type="text" id="p-margen" readonly style="background:var(--bg);color:var(--text2)"></div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Stock actual</label><input type="number" id="p-stock" placeholder="0"></div>
      <div class="form-group"><label>Stock mínimo (alerta)</label><input type="number" id="p-minimo" placeholder="10"></div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Stock guardado (reserva, no se cuenta)</label><input type="number" id="p-guardado" placeholder="0"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-danger" id="btn-eliminar-prod" style="display:none;margin-right:auto" onclick="eliminarProductoDesdeModal()">🗑️ Eliminar producto</button>
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarProducto()">Guardar producto</button>
    </div>
  </div>
</div>

<!-- MODAL CLIENTES DE UNA LISTA -->
<div class="modal-backdrop" id="modal-lista-clientes">
  <div class="modal">
    <h3 id="lc-titulo">Clientes de la lista</h3>
    <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Marcá los clientes que van a usar esta lista de precios. Si un cliente ya tiene otra lista, al marcarlo pasa a esta. Los que desmarques vuelven a la Lista General.</div>
    <input type="text" id="lc-buscar" class="inp" placeholder="Buscar cliente..." oninput="lcFiltrar()" style="width:100%;margin-bottom:8px">
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
      <button class="btn btn-sm" onclick="lcMarcarVisibles(true)">Marcar los que se ven</button>
      <button class="btn btn-sm" onclick="lcMarcarVisibles(false)">Desmarcar los que se ven</button>
      <span style="flex:1"></span>
      <span style="font-size:13px;color:var(--text2)"><strong id="lc-count">0</strong> clientes marcados</span>
    </div>
    <div id="lc-lista" style="max-height:min(340px,35vh);overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px"></div>
    <div class="modal-footer">
      <button class="btn btn-danger" style="margin-right:auto" onclick="lcEliminar()">🗑 Eliminar lista</button>
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="lcGuardar()">Guardar</button>
    </div>
  </div>
</div>

<!-- MODAL HISTORIAL CLIENTE -->
<div class="modal-backdrop" id="modal-historial-cliente">
  <div class="modal" style="max-width:900px;width:96%">
    <h3 id="hist-titulo">Historial del cliente</h3>
    <div id="hist-resumen" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px"></div>
    <div style="max-height:60vh;overflow:auto"><table><thead><tr><th>N°</th><th>Fecha</th><th>Detalle</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Estado</th><th></th></tr></thead><tbody id="hist-tabla"></tbody></table></div>
    <div class="modal-footer" style="margin-top:12px"><button class="btn" onclick="cerrarModales()">Cerrar</button></div>
  </div>
</div>

<!-- MODAL CLIENTE -->
<div class="modal-backdrop" id="modal-cliente">
  <div class="modal">
    <h3 id="titulo-modal-cliente">Nuevo cliente</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Nombre / Razón social *</label><input type="text" id="c-nombre"></div>
      <div class="form-group"><label>Código de cliente</label><input type="text" id="c-codigo" placeholder="Ej: G, A1, 001..."></div>
    </div>
    <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:12px"><input type="checkbox" id="c-fuera-resumen"> No incluir en el resumen de la oficina (paga al momento)</label>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>CUIT / DNI</label><input type="text" id="c-cuit"></div>
      <div class="form-group"><label>Condición IVA</label>
        <select id="c-iva"><option>Consumidor Final</option><option>Responsable Inscripto</option><option>Monotributista</option><option>Exento</option></select>
      </div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Teléfono</label><input type="text" id="c-tel"></div>
      <div class="form-group"><label>Email</label><input type="email" id="c-email"></div>
    </div>
    <div class="form-group" style="margin-bottom:12px"><label>Dirección</label><input type="text" id="c-dir"></div>
    <div class="form-group" style="margin-bottom:12px"><label>Lista de precios</label><select id="c-lista"></select></div>
    <div class="form-group" style="margin-bottom:12px"><label>Notas</label><textarea id="c-notas" placeholder="Observaciones opcionales"></textarea></div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarCliente()">Guardar cliente</button>
    </div>
  </div>
</div>

<!-- MODAL PRESUPUESTO -->
<div class="modal-backdrop" id="modal-presupuesto">
  <div class="modal modal-wide">
    <h3 id="titulo-modal-pres">Nuevo presupuesto</h3>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Cliente</label>
        <div class="ac-wrap">
          <input type="text" id="pres-cliente-input" class="inp" placeholder="Escribí para buscar cliente..." oninput="acCliente(this.value)" autocomplete="off" style="width:100%">
          <div class="ac-list" id="ac-clientes"></div>
        </div>
        <input type="hidden" id="pres-cliente-idx" value="">
      </div>
      <div class="form-group"><label>Lista de precios</label>
        <select id="pres-lista" onchange="cambiarListaManual(this.value)" style="font-size:13px;padding:8px 11px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);width:100%">
          <option value="General">Lista General</option>
          <option value="Gloria">Lista Gloria</option>
          <option value="Luis">Lista Luis</option>
        </select>
      </div>
    </div>
    <div id="aviso-lista-precio" style="display:none;background:var(--blue-light);color:var(--blue-text);font-size:12px;font-weight:600;padding:6px 12px;border-radius:var(--radius);margin-bottom:12px"></div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Fecha</label><input type="date" id="pres-fecha"></div>
      <div class="form-group"><label>Descuento</label>
        <div style="display:flex;gap:8px;align-items:center">
          <select id="pres-descuento" onchange="aplicarDescuento()" style="font-size:13px;padding:8px 11px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);flex:1">
            <option value="0">Sin descuento</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
            <option value="25">25%</option>
            <option value="custom">Personalizado...</option>
          </select>
          <input type="number" id="pres-descuento-custom" min="0" max="100" placeholder="%" 
            style="display:none;width:70px;padding:8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);font-size:13px"
            oninput="aplicarDescuento()">
        </div>
      </div>
    </div>
    <div class="form-grid form-grid-2" style="margin-bottom:12px">
      <div class="form-group"><label>Deuda anterior del cliente ($)</label><input type="number" id="pres-deuda" placeholder="0.00" step="0.01" oninput="calcTotalPres()"></div>
      <div class="form-group"><label>Observaciones</label><input type="text" id="pres-obs" placeholder="Condiciones, forma de pago..."></div>
    </div>
    <div class="linea-header">
      <span>Código</span><span>Producto</span><span>Cant.</span><span>Precio unit.</span><span>Importe</span><span></span>
    </div>
    <div id="lineas-presupuesto"></div>
    <button class="btn" style="width:100%;justify-content:center;margin:8px 0 1rem" onclick="agregarLineaPres()">+ Agregar ítem</button>
    <div class="total-section">
      <div class="total-row"><span>Subtotal productos</span><span id="pres-subtotal">$0,00</span></div>
      <div class="total-row"><span>Deuda anterior</span><span id="pres-deuda-display">$0,00</span></div>
      <div class="total-row main"><span>TOTAL</span><span id="pres-total">$0,00</span></div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="cerrarModales()">Cancelar</button>
      <button class="btn btn-primary" id="btn-guardar-pres" onclick="guardarPresupuesto()">Guardar presupuesto</button>
    </div>
  </div>
</div>


<script>
const DB_DEFAULTS = JSON.parse(document.getElementById('db-defaults-data').textContent);
let db = JSON.parse(JSON.stringify(DB_DEFAULTS));

// ===== SISTEMA DE ROLES =====
function aplicarTema(t){
  document.documentElement.setAttribute('data-tema', t === 'oscuro' ? 'oscuro' : 'claro');
  var b = document.getElementById('btn-tema');
  if(b){ b.textContent = t === 'oscuro' ? '☀️' : '🌙'; b.title = t === 'oscuro' ? 'Pasar a modo claro' : 'Pasar a modo oscuro'; }
}
function alternarTema(){
  var nuevo = document.documentElement.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(nuevo);
  try { localStorage.setItem('hap_tema', nuevo); } catch(e) {}
}
(function(){ var t = 'claro'; try { t = localStorage.getItem('hap_tema') || 'claro'; } catch(e) {} aplicarTema(t); })();
let rolActual = null; // 'admin' | 'empleado'

const SECCIONES_EMPLEADO = ['dashboard','clientes','presupuestos','entrega','deudores','afavor','proveedores'];
const SECCIONES_ADMIN    = ['dashboard','productos','controlstock','listas','clientes','presupuestos','entrega','deudores','afavor','caja','proveedores','ganancia','ventas','contabilidad','actividad','config'];


let nombreUsuarioActual = '';
let nivelActual = 'empleado';   // 'admin' | 'socio' | 'caja' | 'empleado'
let esSocioLogin = false;       // true = entró como socio (acceso total, pero no puede borrar/editar socios)
var NIVELES_POR_DEFECTO = { hugo: 'caja', ale: 'caja', tute: 'socio' };
function nivelDe(emp){
  if(emp && emp.nivel) return emp.nivel;
  var n = emp && emp.nombre ? emp.nombre.trim().toLowerCase() : '';
  return NIVELES_POR_DEFECTO[n] || 'empleado';
}
function puedeCostos(){ return rolActual === 'admin' || nivelActual === 'caja'; }
function esAdminReal(){ return rolActual === 'admin' && !esSocioLogin; }
function aplicarNivelLogin(emp){
  nivelActual = nivelDe(emp);
  esSocioLogin = nivelActual === 'socio';
  rolActual = esSocioLogin ? 'admin' : 'empleado';
  nombreUsuarioActual = emp.nombre;
}
function seccionesPermitidas(){
  if(rolActual === 'admin') return SECCIONES_ADMIN;
  if(nivelActual === 'caja') return SECCIONES_EMPLEADO.concat(['caja','productos']);
  return SECCIONES_EMPLEADO;
}

function renderLoginEmpleados(){
  const empleados = listaLogin();
  const btns = document.getElementById('login-btns-empleados');
  if(!btns) return;

  // Totales generales
  const totalDeuda = db.presupuestos
    .filter(p=>p.estado==='Pendiente')
    .reduce((sum,p)=>sum+saldoDeuda(p),0);
  const totalFavor = db.presupuestos
    .reduce((sum,p)=>sum+saldoAFavor(p),0);

  const badges = \`
    \${totalDeuda>0?\`<span style="background:rgba(255,255,255,0.25);font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px;white-space:nowrap">🔴 $\${fmt(totalDeuda)}</span>\`:''}
    \${totalFavor>0?\`<span style="background:rgba(255,255,255,0.25);font-size:11px;font-weight:700;padding:2px 8px;border-radius:100px;white-space:nowrap">🟢 $\${fmt(totalFavor)}</span>\`:''}
  \`;

  btns.innerHTML = empleados.map((e,i) =>
    e.tienePass
      ? \`<button class="btn-login-emp" style="width:100%" onclick="mostrarPassEmpleado(\${i})">👤 \${e.nombre}</button>\`
      : \`<button class="btn-login-emp" style="width:100%" onclick="entrarComoEmpleado(\${i})">👤 \${e.nombre}</button>\`
  ).join('');
}

function listaLogin(){
  if(loginInfo && loginInfo.empleados) return loginInfo.empleados;
  return (db.empleados || []).map(function(e){ return { nombre: e.nombre, tienePass: !!e.tienePass }; });
}
function errorLogin(r){
  const el = document.getElementById('login-error');
  el.textContent = (r && r.j && r.j.error) || 'Contraseña incorrecta';
  el.style.display = 'block';
  document.getElementById('login-pass').value = '';
}

// ===== Recordatorios =====
function recEsc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function recCuando(r){
  if(!r.fecha) return null;
  var p = r.fecha.split('-'); var h = (r.hora || '09:00').split(':');
  return new Date(+p[0], +p[1]-1, +p[2], +h[0], +h[1] || 0, 0);
}
function recAvisados(){ try{ return JSON.parse(localStorage.getItem('hap_rec_avisados') || '{}'); }catch(e){ return {}; } }
function recMarcarAvisado(id, clave){ try{ var a = recAvisados(); a[id] = clave; localStorage.setItem('hap_rec_avisados', JSON.stringify(a)); }catch(e){} }
function agregarRecordatorio(){
  var t = document.getElementById('rec-texto'); var texto = t.value.trim();
  if(!texto){ t.focus(); return; }
  if(!db.recordatorios) db.recordatorios = [];
  var f = document.getElementById('rec-fecha').value, h = document.getElementById('rec-hora').value;
  db.recordatorios.push({ id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2,6), texto: texto, fecha: f, hora: h, hecho: false, creado: new Date().toISOString() });
  t.value = ''; document.getElementById('rec-fecha').value = ''; document.getElementById('rec-hora').value = '';
  guardar(); renderRecordatorios(); revisarRecordatorios();
}
function recHecho(id){ var r = (db.recordatorios||[]).find(function(x){ return x.id === id; }); if(!r) return; r.hecho = !r.hecho; guardar(); renderRecordatorios(); revisarRecordatorios(); }
function recEliminar(id){ db.recordatorios = (db.recordatorios||[]).filter(function(x){ return x.id !== id; }); guardar(); renderRecordatorios(); revisarRecordatorios(); }
function recPosponer(id, min){
  var r = (db.recordatorios||[]).find(function(x){ return x.id === id; }); if(!r) return;
  var d = new Date(Date.now() + min*60000);
  var z = function(n){ return String(n).padStart(2,'0'); };
  r.fecha = d.getFullYear() + '-' + z(d.getMonth()+1) + '-' + z(d.getDate()); r.hora = z(d.getHours()) + ':' + z(d.getMinutes());
  guardar(); renderRecordatorios(); revisarRecordatorios();
}
function renderRecordatorios(){
  var el = document.getElementById('rec-lista'); if(!el) return;
  var ahora = new Date();
  var arr = (db.recordatorios || []).slice().sort(function(a, b){
    if(a.hecho !== b.hecho) return a.hecho ? 1 : -1;
    var ca = recCuando(a), cb = recCuando(b);
    if(!ca && !cb) return 0; if(!ca) return 1; if(!cb) return -1; return ca - cb;
  });
  if(!arr.length){ el.innerHTML = '<div style="font-size:12px;color:var(--text3)">No hay recordatorios.</div>'; return; }
  el.innerHTML = arr.map(function(r){
    var c = recCuando(r); var venc = !r.hecho && c && c <= ahora;
    var cuando = c ? c.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'}) + (r.hora ? ' ' + r.hora : '') : 'Sin fecha';
    return '<div class="rec-item' + (venc ? ' vencido' : '') + (r.hecho ? ' hecho' : '') + '">' +
      '<input type="checkbox" ' + (r.hecho ? 'checked ' : '') + 'onchange="recHecho(' + "'" + r.id + "'" + ')" title="Marcar como hecho">' +
      '<div style="flex:1"><div class="rec-t">' + recEsc(r.texto) + '</div><div class="rec-cuando">' + (venc ? 'Vencido · ' : '') + cuando + '</div></div>' +
      '<button class="btn" style="padding:2px 8px" onclick="recEliminar(' + "'" + r.id + "'" + ')" title="Borrar">✕</button></div>';
  }).join('');
}
function revisarRecordatorios(){
  if(!rolActual) return;
  var cont = document.getElementById('rec-avisos');
  if(!cont){ cont = document.createElement('div'); cont.id = 'rec-avisos'; document.body.appendChild(cont); }
  var ahora = new Date(), av = recAvisados(), vivos = {};
  (db.recordatorios || []).forEach(function(r){
    var c = recCuando(r); if(r.hecho || !c || c > ahora) return;
    var clave = r.fecha + ' ' + (r.hora || '');
    vivos[r.id] = 1;
    if(av[r.id] === clave || document.getElementById('rec-av-' + r.id)) return;
    var d = document.createElement('div'); d.className = 'rec-aviso'; d.id = 'rec-av-' + r.id;
    d.innerHTML = '<b>🔔 Recordatorio</b>' + recEsc(r.texto) + '<br>' +
      '<button class="btn btn-primary" data-a="ok">Hecho</button><button class="btn" data-a="p10">Posponer 10 min</button><button class="btn" data-a="p60">1 hora</button><button class="btn" data-a="x">Cerrar</button>';
    d.addEventListener('click', function(ev){
      var a = ev.target && ev.target.getAttribute('data-a'); if(!a) return;
      d.remove(); recMarcarAvisado(r.id, clave);
      if(a === 'ok') recHecho(r.id); else if(a === 'p10') recPosponer(r.id, 10); else if(a === 'p60') recPosponer(r.id, 60);
    });
    cont.appendChild(d);
    try{ var ac = new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(); o.frequency.value = 880; o.connect(ac.destination); o.start(); setTimeout(function(){ o.stop(); ac.close(); }, 350); }catch(e){}
  });
  Array.prototype.slice.call(cont.children).forEach(function(n){ var id = n.id.slice(7); if(!vivos[id]) n.remove(); });
  renderRecordatorios();
}
setInterval(revisarRecordatorios, 20000);
async function entrarConSesion(r, esAdminLogin){
  authToken = r.j.token;
  if(esAdminLogin){ rolActual = 'admin'; esSocioLogin = false; nivelActual = 'admin'; }
  else { aplicarNivelLogin({ nombre: r.j.nombre, nivel: r.j.nivel }); codigoVendedorActual = r.j.codigo || ''; }
  document.getElementById('login-error').style.display = 'none';
  await cargarDesdeServidor();
  iniciarApp();
  if(r.j.claveDefault) alert('Estás usando la contraseña de fábrica (1234). Cambiala ya mismo en Configuración.');
}
async function entrarComoEmpleado(idx=0){
  const emp = listaLogin()[idx] || listaLogin()[0];
  if(!emp) return;
  const r = await loginServidor({ tipo: 'empleado', nombre: emp.nombre, password: '' });
  if(!r.ok){ alert((r.j && r.j.error) || 'No se pudo ingresar'); return; }
  await entrarConSesion(r, false);
}

function mostrarPassEmpleado(idx){
  document.getElementById('login-pass-wrap').style.display='block';
  document.getElementById('login-pass').dataset.empIdx = idx;
  document.getElementById('login-pass').placeholder = 'Contraseña de empleado';
  document.getElementById('login-pass').focus();
  // Cambiar el botón ingresar para empleado
  document.getElementById('login-pass').onkeydown = e => { if(e.key==='Enter') verificarEmpleado(); };
  document.querySelector('#login-pass-wrap button').onclick = verificarEmpleado;
}

async function verificarEmpleado(){
  const idx = parseInt(document.getElementById('login-pass').dataset.empIdx||0);
  const emp = listaLogin()[idx];
  if(!emp) return;
  const r = await loginServidor({ tipo: 'empleado', nombre: emp.nombre, password: document.getElementById('login-pass').value });
  if(r.ok) await entrarConSesion(r, false); else errorLogin(r);
}
function mostrarPassAdmin(){
  document.getElementById('login-pass-wrap').style.display='block';
  document.getElementById('login-pass').placeholder='Contraseña de administrador';
  document.getElementById('login-pass').dataset.empIdx='';
  document.getElementById('login-pass').onkeydown = e => { if(e.key==='Enter') verificarAdmin(); };
  document.querySelector('#login-pass-wrap button').onclick = verificarAdmin;
  document.getElementById('login-pass').focus();
}
async function verificarAdmin(){
  const pass = document.getElementById('login-pass').value;
  const r = await loginServidor({ tipo: 'admin', password: pass });
  if(r.ok) await entrarConSesion(r, true); else errorLogin(r);
}
function iniciarApp(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('main-app').style.display='flex';
  const badge = document.getElementById('rol-badge');
  if(rolActual==='admin' && !esSocioLogin){
    badge.textContent='Admin'; badge.className='rol-badge rol-admin';
  } else {
    badge.textContent=nombreUsuarioActual||'Empleado'; badge.className='rol-badge rol-emp';
  }
  aplicarRol();
  if(servidorConectado!==false){
    var nIds = asegurarIdsProductos();
    var nVin = vincularLineasAProductos();
    var sn = sincronizarNombresBoletas();
    if(sn.lineas){ registrarActividad('presupuesto','Sincronizó nombres de productos en boletas', sn.lineas + ' líneas en ' + sn.boletas + ' boletas'); }
    if(nIds || nVin || sn.lineas){ guardar(); }
  }
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('dashboard')?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>{
    if(n.getAttribute('onclick')?.includes("'dashboard'")) n.classList.add('active');
  });
  try { renderDashboard(); } catch(e){ console.error(e); }
}
function aplicarRol(){
  const esAdmin = rolActual==='admin';
  actualizarBarraResumen();
  var bm=document.getElementById('btn-masiva'); if(bm) bm.style.display=esAdmin?'':'none';
  // Ocultar nav items que no corresponden al empleado
  const itemsAdmin = ['productos','controlstock','listas','caja','ganancia','ventas','contabilidad','config','actividad'];
  itemsAdmin.forEach(sec=>{
    document.querySelectorAll(\`.nav-item\`).forEach(el=>{
      if(el.getAttribute('onclick')?.includes(\`'\${sec}'\`)){
        el.style.display = (esAdmin || ((sec==='caja' || sec==='productos') && nivelActual==='caja')) ? '' : 'none';
      }
    });
  });
  // En productos, ocultar columna costo si es empleado
  document.querySelectorAll('.col-costo').forEach(el=>el.style.display=puedeCostos()?'':'none');
  ['p-costo','p-margen'].forEach(function(id){ var el=document.getElementById(id); if(el&&el.closest('.form-group')) el.closest('.form-group').style.display = puedeCostos() ? '' : 'none'; });
}
async function sincronizar(){
  const btn = document.querySelector('button[onclick="sincronizar()"]');
  if(btn) btn.textContent = '⏳';
  await cargarDesdeServidor();
  const secActiva = document.querySelector('.section.active')?.id;
  const renders = { dashboard: renderDashboard, productos: ()=>renderProductos(), clientes: ()=>renderClientes(), presupuestos: renderPresupuestos, entrega: renderEntrega, deudores: renderDeudores, afavor: renderAfavor, caja: renderCaja, proveedores: renderProveedores, actividad: renderActividad };
  if(secActiva && renders[secActiva]) try{ renders[secActiva](); }catch(e){}
  if(btn) btn.textContent = '🔄';
}

function cerrarSesion(){
  var pendiente = false; try{ pendiente = snapSync !== null && armarDelta().hay; }catch(e){}
  if(!pendiente){ try{ localStorage.removeItem('hap_db'); }catch(e){} db = JSON.parse(JSON.stringify(DB_DEFAULTS)); snapSync = null; }
  authToken=null;
  rolActual=null; esSocioLogin=false; nivelActual='empleado';
  nombreUsuarioActual='';
  document.getElementById('main-app').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('login-pass').value='';
  document.getElementById('login-pass-wrap').style.display='none';
  document.getElementById('login-error').style.display='none';
  renderLoginEmpleados();
}

// Guardar contraseña en config
// ===== FIN ROLES =====

const API = ''; // misma dirección desde la que se abrió la página
var authToken = null, loginInfo = null;
async function apiFetch(url, opts){
  opts = opts || {};
  opts.headers = Object.assign({}, opts.headers || {});
  if(authToken) opts.headers['Authorization'] = 'Bearer ' + authToken;
  const res = await fetch(url, opts);
  if(res && res.status === 401 && authToken){
    authToken = null;
    alert('Tu sesión venció. Volvé a ingresar. Lo que ya se guardó no se pierde.');
    location.reload();
  }
  return res;
}
async function apiPost(url, body){
  try{
    const r = await apiFetch(API + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let j = {}; try{ j = await r.json(); }catch(e){}
    return { ok: r.ok, j: j };
  }catch(e){ return { ok: false, j: { error: 'Sin conexión con el servidor' } }; }
}
async function loginServidor(body){
  try{
    const res = await fetch(API + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let j = {}; try{ j = await res.json(); }catch(e){}
    return { ok: res.ok, status: res.status, j: j };
  }catch(e){ return { ok: false, status: 0, j: { error: 'No se pudo conectar con el servidor' } }; }
}
async function cargarLoginInfo(){
  try{
    const r = await fetch(API + '/api/public/login-info');
    if(r.ok){ loginInfo = await r.json(); renderLoginEmpleados(); return; }
  }catch(e){}
  setTimeout(cargarLoginInfo, 5000);
}
let guardandoEnServidor = false;
let ultimoGuardadoOk = true;

function cargar() {
  try {
    const s = localStorage.getItem('hap_db');
    db = s ? JSON.parse(s) : JSON.parse(JSON.stringify(DB_DEFAULTS));
  } catch(e) {
    db = JSON.parse(JSON.stringify(DB_DEFAULTS));
  }
  try { if(db.config) delete db.config.password; (db.empleados || []).forEach(function(e){ delete e.pass; }); } catch(e) {}
  try { ordenarDatos(); } catch(e) {}
}

function ordenarDatos(){
  var cmp = function(a, b){ return String(a || '').localeCompare(String(b || ''), 'es', { sensitivity: 'base', numeric: true }); };
  if(db.productos) db.productos.sort(function(a, b){ return cmp(a.nombre, b.nombre); });
  if(db.proveedores) db.proveedores.sort(function(a, b){ return cmp(a.nombre, b.nombre); });
}
var servidorConectado = null;
function avisoServidor(ok){
  servidorConectado = ok;
  var b = document.getElementById('banner-sin-servidor');
  if(ok){ if(b) b.remove(); return; }
  if(!b){
    b = document.createElement('div');
    b.id = 'banner-sin-servidor';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#b91c1c;color:#fff;font-weight:700;font-size:14px;padding:10px 14px;text-align:center';
    b.textContent = 'NO SE PUDO CONECTAR CON EL SERVIDOR: estás viendo datos VIEJOS de esta computadora. No cargues nada ahora. Se reintenta solo cada 30 segundos; si sigue, refrescá con Ctrl+Shift+R.';
    document.body.appendChild(b);
  }
}
var snapSync = null;
var CLAVES_REG = { presupuestos: 'numero', caja: 'id', prov_movs: 'id', recordatorios: 'id' };
function cajaStampIds(arr){
  var vistos = {};
  (arr || []).forEach(function(m){
    if(!m || m.id) return;
    var sig = [m.fecha, m.tipo, m.medio, m.desc, m.monto].join('|');
    vistos[sig] = (vistos[sig] || 0) + 1;
    m.id = 'L|' + sig + '|' + vistos[sig];
  });
}
function nuevoIdCaja(){ return 'm' + Date.now() + Math.random().toString(36).slice(2, 7); }
function tomarSnapshot(){
  cajaStampIds(db.caja);
  snapSync = {};
  Object.keys(db).forEach(function(t){ snapSync[t] = JSON.stringify(db[t]); });
}
// Arma solo lo que cambió desde la última vez que se sincronizó con el servidor
function armarDelta(){
  cajaStampIds(db.caja);
  var tablas = {}, nuevoSnap = {}, hay = false;
  Object.keys(db).forEach(function(t){
    var js = JSON.stringify(db[t]); nuevoSnap[t] = js;
    if(snapSync && snapSync[t] === js) return;
    hay = true;
    var key = CLAVES_REG[t], v = db[t];
    var porRegistro = key && Array.isArray(v) && v.every(function(r){ return r && r[key] !== undefined && r[key] !== null; });
    if(porRegistro && snapSync && snapSync[t] !== undefined){
      var viejo = JSON.parse(snapSync[t]); if(!Array.isArray(viejo)) viejo = [];
      var mv = {};
      viejo.forEach(function(r){ if(r && r[key] !== undefined && r[key] !== null) mv[String(r[key])] = JSON.stringify(r); });
      var ups = [], vistos = {};
      v.forEach(function(r){ var k = String(r[key]); vistos[k] = 1; if(mv[k] !== JSON.stringify(r)) ups.push(r); });
      var dels = Object.keys(mv).filter(function(k){ return !vistos[k]; });
      tablas[t] = { mode: 'records', key: key, upserts: ups, deletes: dels };
    } else tablas[t] = { mode: 'whole', valor: v };
  });
  return { hay: hay, tablas: tablas, nuevoSnap: nuevoSnap };
}
// Si dos personas crearon boletas a la vez con el mismo numero, el servidor le da otro numero a la ultima y avisa
function aplicarRenumeradas(lista, delta){
  var snapP = null; try{ snapP = JSON.parse(delta.nuevoSnap.presupuestos); }catch(e){}
  var msgs = [];
  lista.forEach(function(x){
    var b = db.presupuestos.find(function(q){ return q.uid === x.uid; }); if(!b) return;
    b.numero = x.a;
    db.presupuestos.forEach(function(o){ (o.pagos || []).forEach(function(g){ if(g.nota === 'Traspasado a la boleta #' + x.de) g.nota = 'Traspasado a la boleta #' + x.a; }); });
    if(snapP) snapP.forEach(function(q){ if(q && q.uid === x.uid) q.numero = x.a; });
    if(!db.contador) db.contador = {};
    db.contador.presupuesto = Math.max(db.contador.presupuesto || 1, x.a + 1);
    msgs.push('La boleta de ' + (b.cliente ? b.cliente.nombre : 'Consumidor final') + ' quedó con el número #' + x.a + ' (el #' + x.de + ' lo había usado otra persona al mismo tiempo).');
  });
  if(snapP) delta.nuevoSnap.presupuestos = JSON.stringify(snapP);
  try{ localStorage.setItem('hap_db', JSON.stringify(db)); }catch(e){}
  try{ renderPresupuestos(); }catch(e){}
  if(msgs.length) alert(msgs.join(String.fromCharCode(10)) + String.fromCharCode(10) + String.fromCharCode(10) + 'Si ya la imprimiste, corregí el número en el papel.');
}
async function guardar() {
  // 1. Siempre guardar en local primero
  localStorage.setItem('hap_db', JSON.stringify(db));
  // 2. Subir al servidor (nunca si no pudimos leer lo que hay: se pisarian datos nuevos con viejos)
  if(servidorConectado === false){ ultimoGuardadoOk = false; return false; }
  if(snapSync === null){ ultimoGuardadoOk = false; return false; }
  const delta = armarDelta();
  if(!delta.hay){ ultimoGuardadoOk = true; return true; }
  guardandoEnServidor = true;
  let guardadoOk = false;
  try {
    const res = await apiFetch(\`\${API}/api/db/delta\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tables: delta.tablas })
    });
    if(!res.ok) console.warn('Error servidor:', res.status);
    else {
      console.log('✅ Guardado en servidor'); guardadoOk = true;
      var rj = null; try{ rj = await res.json(); }catch(e){}
      if(rj && rj.renumeradas && rj.renumeradas.length){ try{ aplicarRenumeradas(rj.renumeradas, delta); }catch(e){ console.warn('renumerar:', e); } }
      snapSync = delta.nuevoSnap;
    }
  } catch(e) {
    console.warn('Sin internet, solo local');
  } finally {
    guardandoEnServidor = false;
  }
  ultimoGuardadoOk = guardadoOk;
  return guardadoOk;
}

async function cargarDesdeServidor() {
  if(guardandoEnServidor) {
    await new Promise(r => setTimeout(r, 1000));
  }
  try {
    const res = await apiFetch(\`\${API}/api/db/all\`);
    if(!res.ok){ avisoServidor(false); return; }
    const data = await res.json();
    avisoServidor(true);
    // Si hay cambios mios que todavia no llegaron al servidor, no los piso con lo que baje
    if(snapSync !== null && armarDelta().hay) return;
    if(data && data.productos && data.productos.length > 0) {
      // El servidor tiene datos reales — usarlos completos
      db = data;
      // Asegurar campos mínimos
      if(!db.presupuestos) db.presupuestos = [];
      if(!db.caja)         db.caja         = [];
      if(!db.actividad)    db.actividad    = [];
      if(!db.empleados)    db.empleados    = [];
      if(!db.listas_precio) db.listas_precio = {};
      if(!db.listas_margen) db.listas_margen = {};
      if(!db.controles_stock) db.controles_stock = [];
      if(!db.cierres) db.cierres = [];
      if(!db.prov_movs) db.prov_movs = [];
      if(!db.recordatorios) db.recordatorios = [];
      ordenarDatos();
      tomarSnapshot();
      localStorage.setItem('hap_db', JSON.stringify(db));
      console.log('✅ Datos del servidor cargados');
    } else {
      // Servidor vacío — subir los datos locales al servidor
      console.log('⬆️ Servidor vacío, subiendo datos locales...');
      snapSync = {};
      await guardar();
    }
  } catch(e) {
    console.warn('Sin internet, usando local');
    avisoServidor(false);
  }
}

cargar();

function menuMovil(v){ var a = document.getElementById('main-app'); if(!a) return; a.classList.toggle('menu-abierto', typeof v === 'boolean' ? v : !a.classList.contains('menu-abierto')); }
function showSection(id, el) {
  const permitidas = seccionesPermitidas();
  if(!permitidas.includes(id)) return;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  el.classList.add('active'); menuMovil(false); window.scrollTo(0, 0);
  ({ dashboard: renderDashboard, productos: ()=>renderProductos(), clientes: ()=>renderClientes(), listas: ()=>renderLista(), presupuestos: renderPresupuestos, entrega: renderEntrega, deudores: renderDeudores, afavor: renderAfavor, caja: renderCaja, proveedores: renderProveedores, ganancia: ()=>{}, ventas: iniciarVentas, contabilidad: iniciarContabilidad, controlstock: iniciarControlStock, actividad: renderActividad, config: cargarConfig })[id]?.();
}

let editIdx = null;
function cerrarModales() { document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open')); editIdx = null; }
document.querySelectorAll('.modal-backdrop').forEach(m => m.addEventListener('click', e => { if(e.target===m) cerrarModales(); }));

function fmt(n) { return (parseFloat(n)||0).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtNum(n) { return (parseFloat(n)||0).toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1}); }

// ---- PRODUCTOS ----
function abrirModalProducto(idx) {
  editIdx = idx??null;
  document.getElementById('modal-producto').classList.add('open');
  document.getElementById('titulo-mod-prod').textContent = idx!==undefined ? 'Editar producto' : 'Nuevo producto';
  document.getElementById('btn-eliminar-prod').style.display = idx!==undefined ? 'inline-flex' : 'none';
  const campos = ['p-nombre','p-medida','p-unidad','p-codigo','p-costo','p-precio','p-margen','p-stock','p-minimo','p-guardado'];
  campos.forEach(id => document.getElementById(id).value='');
  // Cargar opciones de proveedores
  const selProv = document.getElementById('p-proveedor');
  selProv.innerHTML = '<option value="">Sin asignar</option>' +
    (db.proveedores||[]).map(p=>\`<option value="\${p.nombre}">\${p.nombre}</option>\`).join('');
  if (idx!==undefined) {
    const p = db.productos[idx];
    document.getElementById('p-nombre').value=p.nombre; document.getElementById('p-cat').value=p.categoria;
    document.getElementById('p-medida').value=p.medida||''; document.getElementById('p-unidad').value=p.unidad||'';
    document.getElementById('p-codigo').value=p.codigo||''; document.getElementById('p-costo').value=p.costo;
    document.getElementById('p-precio').value=p.precio; document.getElementById('p-stock').value=p.stock;
    document.getElementById('p-minimo').value=p.minimo; document.getElementById('p-guardado').value=p.guardado||'';
    selProv.value = p.proveedor||'';
    calcMargen();
  }
}
function eliminarProductoDesdeModal(){
  if(rolActual!=='admin') return;
  if(editIdx===null||editIdx===undefined) return;
  if(!confirm('¿Eliminar este producto?')) return;
  db.productos.splice(editIdx,1);
  guardar(); cerrarModales(); renderProveedores(); renderProductos(); renderDashboard();
}
function calcMargen() {
  const c=parseFloat(document.getElementById('p-costo').value)||0, v=parseFloat(document.getElementById('p-precio').value)||0;
  document.getElementById('p-margen').value = (c>0&&v>0) ? ((v-c)/c*100).toFixed(1)+'%' : '—';
}
function propagarRenombreProducto(viejo, nuevo){
  var res = { boletas: 0, lineas: 0, listas: 0 };
  if(!viejo || !nuevo) return res;
  var cambioNombre = viejo.nombre !== nuevo.nombre;
  var cambioCodigo = (viejo.codigo || '') !== (nuevo.codigo || '');
  if(!cambioNombre && !cambioCodigo) return res;
  (db.presupuestos || []).forEach(function(b){
    var tocada = false;
    (b.lineas || []).forEach(function(l){
      var porId = viejo.id && l.pid && l.pid === viejo.id;
      var porCod = viejo.codigo && l.cod && String(l.cod) === String(viejo.codigo);
      var porNombre = l.nombre === viejo.nombre && (!l.cod || !viejo.codigo || porCod);
      if(porId || porCod || porNombre){
        var cambio = false;
        if(l.nombre !== nuevo.nombre){ l.nombre = nuevo.nombre; cambio = true; }
        if((porCod || (porId && l.cod && String(l.cod) === String(viejo.codigo))) && cambioCodigo){ l.cod = nuevo.codigo; cambio = true; }
        if(!l.pid && nuevo.id){ l.pid = nuevo.id; }
        if(cambio){ res.lineas++; tocada = true; }
      }
    });
    (b.stock_aplicado || []).forEach(function(a){
      if(a.nombre === viejo.nombre){ a.nombre = nuevo.nombre; a.codigo = nuevo.codigo; }
    });
    if(tocada) res.boletas++;
  });
  if(cambioNombre && db.listas_precio){
    Object.keys(db.listas_precio).forEach(function(lista){
      var L = db.listas_precio[lista];
      if(L && Object.prototype.hasOwnProperty.call(L, viejo.nombre)){
        if(!Object.prototype.hasOwnProperty.call(L, nuevo.nombre)) L[nuevo.nombre] = L[viejo.nombre];
        delete L[viejo.nombre];
        res.listas++;
      }
    });
  }
  return res;
}
function guardarProducto() {
  const nombre=document.getElementById('p-nombre').value.trim();
  if(!nombre){alert('Ingresá el nombre');return;}
  const p={ nombre, categoria:document.getElementById('p-cat').value, medida:document.getElementById('p-medida').value.trim(),
    unidad:document.getElementById('p-unidad').value.trim()||'unidad', codigo:document.getElementById('p-codigo').value.trim(),
    costo:parseFloat(document.getElementById('p-costo').value)||0, precio:parseFloat(document.getElementById('p-precio').value)||0,
    stock:parseInt(document.getElementById('p-stock').value)||0, minimo:parseInt(document.getElementById('p-minimo').value)||5, guardado:parseFloat(document.getElementById('p-guardado').value)||0,
    proveedor:document.getElementById('p-proveedor').value||'' };
  var viejo = editIdx!==null ? db.productos[editIdx] : null;
  p.id = (viejo && viejo.id) ? viejo.id : nuevoIdProd();
  var vcopy = viejo ? { nombre: viejo.nombre, codigo: viejo.codigo, id: viejo.id } : null;
  if(editIdx!==null) db.productos[editIdx]=p; else db.productos.push(p);
  var rp = vcopy ? propagarRenombreProducto(vcopy, p) : { boletas: 0, lineas: 0, listas: 0 };
  if(rp.lineas || rp.listas){
    registrarActividad('presupuesto', 'Renombró producto: ' + vcopy.nombre + ' → ' + p.nombre, 'Actualizó ' + rp.lineas + ' líneas en ' + rp.boletas + ' boletas y ' + rp.listas + ' listas de precios');
  }
  ordenarDatos();
  guardar(); cerrarModales(); renderProveedores(); renderDashboard();
  if(typeof renderProductos === 'function') renderProductos();
  if(rp.lineas || rp.listas) alert('Listo: el nombre nuevo se actualizó en ' + rp.boletas + ' boletas (' + rp.lineas + ' líneas) y en ' + rp.listas + ' listas de precios.');
}
function eliminarProducto(idx){ if(rolActual!=='admin') return; if(!confirm('¿Eliminar?'))return; db.productos.splice(idx,1); guardar(); renderProductos(); renderDashboard(); }
function estadoBadge(p){ if(p.stock===0)return'<span class="badge badge-out">Sin stock</span>'; if(p.stock<=p.minimo)return'<span class="badge badge-low">Stock bajo</span>'; return'<span class="badge badge-ok">OK</span>'; }
function renderProductos(filtro=''){
  const todos=db.productos.filter(p=>!filtro||p.nombre.toLowerCase().includes(filtro.toLowerCase())||(p.codigo||'').toLowerCase().includes(filtro.toLowerCase()));
  const conProv = todos.filter(p=>p.proveedor);
  const sinProv = todos.filter(p=>!p.proveedor);
  const t=document.getElementById('tabla-productos');
  if(!todos.length){t.innerHTML=\`<tr class="empty-row"><td colspan="9">\${filtro?'Sin resultados':'Sin productos.'}</td></tr>\`;return;}

  const filaProducto = p => {
    const i=db.productos.indexOf(p);
    return \`<tr>
      <td style="font-size:12px;color:var(--text2)">\${p.codigo||'—'}</td>
      <td><strong>\${p.nombre}</strong></td><td style="color:var(--text2)">\${p.categoria}</td>
      <td style="font-size:12px">\${p.medida||'—'}</td>
      <td class="col-costo"\${!puedeCostos()?' style="display:none"':''}>$\${fmt(p.costo)}</td>
      <td><strong>$\${fmt(p.precio)}</strong></td>
      <td>\${p.stock} <span style="font-size:11px;color:var(--text3)">\${p.unidad}</span>\${p.guardado>0?'<div style="font-size:11px;color:var(--text3)">+'+p.guardado+' guardados</div>':''}</td><td>\${estadoBadge(p)}</td>
      <td style="white-space:nowrap"><button class="btn btn-sm" onclick="abrirModalProducto(\${i})">✏️</button> \${rolActual==='admin'?\`<button class="btn btn-sm btn-danger" onclick="eliminarProducto(\${i})">🗑️</button>\`:''}</td>
    </tr>\`;
  };

  let html = conProv.map(filaProducto).join('');

  if(sinProv.length){
    html += \`<tr><td colspan="9" style="background:var(--bg);font-size:11px;font-weight:700;color:var(--text3);padding:8px 14px;text-transform:uppercase;letter-spacing:0.05em">Sin proveedor asignado</td></tr>\`;
    html += sinProv.map(filaProducto).join('');
  }

  t.innerHTML = html;
}
function filtrarProductos(v){renderProductos(v);}
// ---- PLANILLA DE PRODUCTOS (tipo Excel) ----
var pgSucia = false;
var pgNuevos = 0;
var PG_COLS = [
  { f: 'codigo', t: 'Código', w: 80, tipo: 'txt' },
  { f: 'nombre', t: 'Producto', w: 250, tipo: 'txt' },
  { f: 'categoria', t: 'Categoría', w: 150, tipo: 'txt', dl: 'pg-dl-cat' },
  { f: 'medida', t: 'Medida', w: 170, tipo: 'txt' },
  { f: 'unidad', t: 'Unidad', w: 80, tipo: 'txt', dl: 'pg-dl-uni' },
  { f: 'costo', t: 'P. costo', w: 95, tipo: 'num' },
  { f: 'precio', t: 'P. venta', w: 95, tipo: 'num' },
  { f: 'stock', t: 'Stock', w: 80, tipo: 'num' },
  { f: 'guardado', t: 'Guardado (no se cuenta)', w: 110, tipo: 'num' },
  { f: 'minimo', t: 'Mínimo', w: 75, tipo: 'num' },
  { f: 'proveedor', t: 'Proveedor', w: 140, tipo: 'txt', dl: 'pg-dl-prov' }
];
function pgValorOrig(p, col){
  var v = p[col.f];
  if(col.tipo === 'num') return (v === undefined || v === null || v === '') ? '' : fmtInp(Number(v) || 0);
  return v == null ? '' : String(v);
}
function pgFilaHtml(k, p, nuevo){
  var h = '<tr data-k="' + k + '"' + (nuevo ? ' class="pg-new"' : '') + '><td class="pg-n">' + (nuevo ? '+' : (Number(k) + 1)) + '</td>';
  PG_COLS.forEach(function(col, c){
    var o = nuevo ? '' : pgValorOrig(p, col);
    h += '<td style="min-width:' + col.w + 'px"><input class="pg-in' + (col.tipo === 'num' ? ' pg-num' : '') + '" data-c="' + c + '" data-o="' + String(o).split('"').join('&quot;') + '" value="' + String(o).split('"').join('&quot;') + '"' + (col.dl ? ' list="' + col.dl + '"' : '') + (col.tipo === 'num' ? ' inputmode="decimal"' : '') + ' oninput="pgInput(this)" onkeydown="pgTecla(event,this)" onpaste="pgPegar(event,this)"></td>';
  });
  h += '<td style="padding:0 6px;white-space:nowrap"><button class="btn btn-sm" title="Marcar para eliminar" onclick="pgEliminar(this)">🗑️</button></td></tr>';
  return h;
}
function pgDatalist(id, valores){
  var el = document.getElementById(id);
  if(!el) return;
  var vistos = {}, h = '';
  valores.forEach(function(v){ v = String(v || '').trim(); if(v && !vistos[v]){ vistos[v] = true; h += '<option value="' + v.split('"').join('&quot;') + '"></option>'; } });
  el.innerHTML = h;
}
function pgRender(){
  var th = '<tr><th>#</th>' + PG_COLS.map(function(c){ return '<th>' + c.t + '</th>'; }).join('') + '<th></th></tr>';
  document.getElementById('pg-thead').innerHTML = th;
  document.getElementById('pg-tbody').innerHTML = db.productos.map(function(p, i){ return pgFilaHtml(i, p, false); }).join('');
  pgDatalist('pg-dl-cat', db.productos.map(function(p){ return p.categoria; }).concat(['Bolsas camiseta', 'Bolsas de residuos', 'Film stretch', 'Rollos polietileno', 'Mangas / tubo', 'Bolsas autocierre', 'Bolsas de cultivo', 'Láminas polietileno', 'Otro']));
  pgDatalist('pg-dl-prov', (db.proveedores || []).map(function(p){ return p.nombre; }).concat(db.productos.map(function(p){ return p.proveedor; })));
  pgDatalist('pg-dl-uni', db.productos.map(function(p){ return p.unidad; }).concat(['unidad', 'caja', 'bulto', 'rollo', 'kg']));
  pgNuevos = 0;
  pgContar();
}
function pgAbrir(){
  if(!pgSucia) pgRender();
  document.getElementById('prod-lista-search').style.display = 'none';
  document.getElementById('prod-lista-card').style.display = 'none';
  document.getElementById('pg-wrap').style.display = 'block';
}
function pgCerrar(){
  if(pgSucia && !confirm('Tenés cambios sin guardar. Si volvés a la lista se pierden. ¿Volver igual?')) return;
  pgSucia = false;
  document.getElementById('pg-wrap').style.display = 'none';
  document.getElementById('prod-lista-search').style.display = '';
  document.getElementById('prod-lista-card').style.display = '';
  renderProductos();
}
function pgDescartar(){
  if(pgSucia && !confirm('¿Descartar todos los cambios de la planilla?')) return;
  pgSucia = false;
  pgRender();
}
function pgContar(){
  var tb = document.getElementById('pg-tbody');
  var cambios = 0;
  Array.prototype.forEach.call(tb.querySelectorAll('tr'), function(tr){
    var k = tr.getAttribute('data-k');
    if(tr.classList.contains('pg-del')){ cambios++; return; }
    if(String(k).charAt(0) === 'n'){
      var algo = false;
      Array.prototype.forEach.call(tr.querySelectorAll('.pg-in'), function(i){ if(i.value.trim() !== '') algo = true; });
      if(algo) cambios++;
      return;
    }
    cambios += tr.querySelectorAll('.pg-in.pg-ch').length;
  });
  pgSucia = cambios > 0;
  var el = document.getElementById('pg-cambios');
  if(el){ el.textContent = cambios ? ('✏️ ' + cambios + ' cambio' + (cambios === 1 ? '' : 's') + ' sin guardar') : 'Sin cambios'; el.style.color = cambios ? 'var(--amber)' : 'var(--text3)'; }
}
function pgInput(inp){
  if(inp.value !== inp.getAttribute('data-o')) inp.classList.add('pg-ch'); else inp.classList.remove('pg-ch');
  pgContar();
}
function pgFilasVisibles(){
  return Array.prototype.filter.call(document.querySelectorAll('#pg-tbody tr'), function(tr){ return tr.style.display !== 'none'; });
}
function pgTecla(e, inp){
  var k = e.key;
  if(k !== 'Enter' && k !== 'ArrowDown' && k !== 'ArrowUp') return;
  var tr = inp.closest('tr');
  var vis = pgFilasVisibles();
  var pos = vis.indexOf(tr);
  var dest = (k === 'ArrowUp') ? vis[pos - 1] : vis[pos + 1];
  e.preventDefault();
  if(!dest) return;
  var n = dest.querySelector('.pg-in[data-c="' + inp.getAttribute('data-c') + '"]');
  if(n){ n.focus(); n.select(); }
}
function pgAgregarFilas(n){
  var tb = document.getElementById('pg-tbody');
  var h = '';
  for(var i = 0; i < n; i++){ pgNuevos++; h += pgFilaHtml('n' + pgNuevos, {}, true); }
  tb.insertAdjacentHTML('beforeend', h);
  var ult = tb.querySelectorAll('tr');
  var primera = ult[ult.length - n];
  if(primera){ var f = primera.querySelector('.pg-in[data-c="1"]'); if(f) f.focus(); }
  pgContar();
}
function pgEliminar(btn){
  var tr = btn.closest('tr');
  var k = String(tr.getAttribute('data-k'));
  if(k.charAt(0) === 'n'){ tr.remove(); pgContar(); return; }
  tr.classList.toggle('pg-del');
  btn.textContent = tr.classList.contains('pg-del') ? '↩' : '🗑️';
  pgContar();
}
function pgFiltrar(){
  var q = document.getElementById('pg-buscar').value.trim().toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll('#pg-tbody tr'), function(tr){
    if(!q){ tr.style.display = ''; return; }
    var txt = Array.prototype.map.call(tr.querySelectorAll('.pg-in'), function(i){ return i.value; }).join(' ').toLowerCase();
    var ok = q.split(' ').every(function(w){ return txt.indexOf(w) > -1; });
    tr.style.display = ok ? '' : 'none';
  });
}
function pgPegar(e, inp){
  var cd = e.clipboardData || window.clipboardData;
  var txt = cd ? cd.getData('text') : '';
  var lines = txt.split(PL_NL).map(function(l){ return l.split(PL_CR).join(''); });
  while(lines.length && lines[lines.length - 1] === '') lines.pop();
  if(!lines.length) return;
  if(lines.length === 1 && lines[0].indexOf(LISTAS_TAB) === -1) return; // un solo valor: pegado normal
  e.preventDefault();
  var c0 = parseInt(inp.getAttribute('data-c'), 10);
  var vis = pgFilasVisibles();
  var pos = vis.indexOf(inp.closest('tr'));
  var faltan = (pos + lines.length) - vis.length;
  if(faltan > 0){
    pgAgregarFilas(faltan);
    vis = pgFilasVisibles();
  }
  var puestos = 0;
  lines.forEach(function(l, i){
    var tr = vis[pos + i];
    if(!tr) return;
    var cells = l.split(LISTAS_TAB);
    cells.forEach(function(cell, j){
      var col = PG_COLS[c0 + j];
      if(!col) return;
      var dest = tr.querySelector('.pg-in[data-c="' + (c0 + j) + '"]');
      if(!dest) return;
      var v = cell.trim();
      if(col.tipo === 'num'){
        if(v === '') return;
        var n = listasNum(v);
        if(n === null) return;
        v = fmtInp(n);
      }
      dest.value = v;
      pgInput(dest);
      puestos++;
    });
  });
  var el = document.getElementById('pg-cambios');
  if(el) el.textContent = el.textContent + ' · pegados ' + puestos + ' valores';
}
function pgLeerFila(tr){
  var o = {};
  PG_COLS.forEach(function(col, c){
    var inp = tr.querySelector('.pg-in[data-c="' + c + '"]');
    var v = inp ? inp.value.trim() : '';
    if(col.tipo === 'num'){
      var n = listasNum(v);
      o[col.f] = (n === null) ? 0 : n;
    } else o[col.f] = v;
  });
  return o;
}
async function pgGuardar(){
  if(!pgSucia){ alert('No hay cambios para guardar.'); return; }
  var filas = Array.prototype.slice.call(document.querySelectorAll('#pg-tbody tr'));
  var modificados = [], nuevos = [], borrar = [], errores = [];
  filas.forEach(function(tr, idx){
    var k = String(tr.getAttribute('data-k'));
    var esNuevo = k.charAt(0) === 'n';
    if(!esNuevo && tr.classList.contains('pg-del')){ borrar.push(db.productos[parseInt(k, 10)]); return; }
    var v = pgLeerFila(tr);
    if(esNuevo){
      var vacio = !v.nombre && !v.codigo && !v.medida && !v.categoria && !v.proveedor && !v.precio && !v.costo && !v.stock;
      if(vacio) return;
      if(!v.nombre){ errores.push('Fila nueva ' + (idx + 1) + ': falta el nombre'); return; }
      nuevos.push(v);
      return;
    }
    var p = db.productos[parseInt(k, 10)];
    if(!p) return;
    if(!v.nombre){ errores.push('Fila ' + (parseInt(k, 10) + 1) + ': el producto no puede quedar sin nombre'); return; }
    var cambio = false;
    PG_COLS.forEach(function(col){
      var tr2 = tr.querySelector('.pg-in[data-c="' + PG_COLS.indexOf(col) + '"]');
      if(tr2 && tr2.classList.contains('pg-ch')) cambio = true;
    });
    if(cambio) modificados.push({ p: p, v: v });
  });
  if(errores.length){ alert('No se guardó nada. Corregí esto:' + PL_NL + errores.slice(0, 10).join(PL_NL)); return; }
  // nombres repetidos en el resultado final
  var finales = {};
  var repetidos = [];
  var mod = new Map();
  modificados.forEach(function(m){ mod.set(m.p, m.v); });
  var fin = [];
  db.productos.forEach(function(p){
    if(borrar.indexOf(p) > -1) return;
    fin.push(mod.has(p) ? mod.get(p).nombre : p.nombre);
  });
  nuevos.forEach(function(v){ fin.push(v.nombre); });
  fin.forEach(function(n){
    var kk = n.trim().toLowerCase();
    if(finales[kk]){ if(repetidos.indexOf(n) < 0) repetidos.push(n); } else finales[kk] = true;
  });
  if(repetidos.length){ alert('No se guardó nada. Hay nombres de producto repetidos: ' + repetidos.slice(0, 8).join(', ') + '. Cada producto tiene que tener un nombre distinto.'); return; }
  var renombres = modificados.filter(function(m){ return m.p.nombre !== m.v.nombre; }).length;
  var msg = 'Se va a guardar: ' + modificados.length + ' producto' + (modificados.length === 1 ? '' : 's') + ' modificado' + (modificados.length === 1 ? '' : 's') + ', ' + nuevos.length + ' nuevo' + (nuevos.length === 1 ? '' : 's') + ' y ' + borrar.length + ' eliminado' + (borrar.length === 1 ? '' : 's') + '.';
  if(renombres) msg += PL_NL + PL_NL + renombres + ' cambio' + (renombres === 1 ? '' : 's') + ' de nombre: también se actualiza en las boletas y en las listas de precios.';
  if(borrar.length) msg += PL_NL + PL_NL + 'Los productos eliminados no se pueden recuperar (las boletas viejas los siguen mostrando con su nombre).';
  msg += PL_NL + PL_NL + '¿Guardar?';
  if(!confirm(msg)) return;
  var tot = { boletas: 0, lineas: 0, listas: 0 };
  modificados.forEach(function(m){
    if(!m.p.id) m.p.id = nuevoIdProd();
    var viejo = { nombre: m.p.nombre, codigo: m.p.codigo, id: m.p.id };
    PG_COLS.forEach(function(col){ m.p[col.f] = m.v[col.f]; });
    if(!m.p.unidad) m.p.unidad = 'unidad';
    if(!m.p.categoria) m.p.categoria = 'Otro';
    if(!m.p.minimo) m.p.minimo = 5;
    var r = propagarRenombreProducto(viejo, m.p);
    tot.boletas += r.boletas; tot.lineas += r.lineas; tot.listas += r.listas;
  });
  nuevos.forEach(function(v){
    if(!v.unidad) v.unidad = 'unidad';
    if(!v.categoria) v.categoria = 'Otro';
    if(!v.minimo) v.minimo = 5;
    v.id = nuevoIdProd();
    db.productos.push(v);
  });
  if(borrar.length) db.productos = db.productos.filter(function(p){ return borrar.indexOf(p) < 0; });
  registrarActividad('producto', 'Editó productos en planilla', modificados.length + ' modificados, ' + nuevos.length + ' nuevos, ' + borrar.length + ' eliminados' + (renombres ? ' | ' + renombres + ' renombrados (' + tot.lineas + ' líneas de boletas, ' + tot.listas + ' listas)' : ''));
  pgSucia = false;
  ordenarDatos();
  var ok = await guardar();
  pgRender();
  renderProductos(); renderProveedores(); renderDashboard();
  if(!ok) alert('Los cambios quedaron SOLO en esta computadora: no se pudieron guardar en el servidor. No cierres la página y probá guardar de nuevo en unos segundos.');
  else alert('Listo, se guardó todo en un solo paso.');
}

// ---- CLIENTES ----
let editClienteIdx = null;
function abrirModalCliente(idx){
  editClienteIdx = idx ?? null;
  document.getElementById('modal-cliente').classList.add('open');
  document.getElementById('titulo-modal-cliente').textContent = idx !== undefined ? 'Editar cliente' : 'Nuevo cliente';
  ['c-nombre','c-codigo','c-cuit','c-tel','c-email','c-dir','c-notas'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('c-fuera-resumen').checked = false;
  poblarSelectLista('c-lista', (idx !== undefined && db.clientes[idx]) ? (db.clientes[idx].lista_precio || 'General') : 'General');
  if(idx !== undefined){
    const c = db.clientes[idx];
    document.getElementById('c-nombre').value = c.nombre||'';
    document.getElementById('c-codigo').value = c.codigo||'';
    document.getElementById('c-cuit').value = c.cuit||'';
    document.getElementById('c-iva').value = c.iva||'Consumidor Final';
    document.getElementById('c-tel').value = c.tel||'';
    document.getElementById('c-email').value = c.email||'';
    document.getElementById('c-dir').value = c.dir||'';
    document.getElementById('c-notas').value = c.notas||'';
    document.getElementById('c-fuera-resumen').checked = !!c.fuera_resumen;
  }
}
function guardarCliente(){
  const nombre=document.getElementById('c-nombre').value.trim();
  if(!nombre){alert('Ingresá el nombre');return;}
  const datos = { nombre, codigo:document.getElementById('c-codigo').value.trim(),
    cuit:document.getElementById('c-cuit').value.trim(), iva:document.getElementById('c-iva').value,
    tel:document.getElementById('c-tel').value.trim(), email:document.getElementById('c-email').value.trim(),
    dir:document.getElementById('c-dir').value.trim(), notas:document.getElementById('c-notas').value.trim(),
    lista_precio: document.getElementById('c-lista').value, fuera_resumen: document.getElementById('c-fuera-resumen').checked };
  if(editClienteIdx !== null){
    var viejo = db.clientes[editClienteIdx];
    // las boletas guardan una copia del codigo del cliente: se actualiza para que el cambio de grupo (G, L, E...) valga tambien en lo ya cargado
    if(viejo && (viejo.codigo || '') !== datos.codigo){
      (db.presupuestos || []).forEach(function(p){ if(p.cliente && p.cliente.nombre === viejo.nombre) p.cliente.codigo = datos.codigo; });
    }
    if(viejo && viejo.nombre !== datos.nombre){
      (db.presupuestos || []).forEach(function(p){ if(p.cliente && p.cliente.nombre === viejo.nombre) p.cliente.nombre = datos.nombre; });
    }
    db.clientes[editClienteIdx] = datos;
  } else db.clientes.push(datos);
  guardar(); cerrarModales(); renderClientes(); renderDashboard();
}
function eliminarCliente(idx){if(!confirm('¿Eliminar?'))return; db.clientes.splice(idx,1); guardar(); renderClientes(); renderDashboard();}

let filtroCodCliente = '';
function setFiltroCliente(cod, el){
  filtroCodCliente = cod;
  document.querySelectorAll('#clientes .filtro-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderClientes();
}
function resumenListaActual(){ return ({G:'Gloria',L:'Luis',E:'Edgardo'})[filtroCodCliente]||''; }
function actualizarBarraResumen(){
  var b=document.getElementById('barra-resumen'); if(!b) return;
  var lista=resumenListaActual();
  var ver=(rolActual==='admin')&&!!lista;
  b.style.display=ver?'':'none';
  if(ver){
    document.getElementById('res-titulo').textContent='📊 Resumen de consumo de '+lista;
    document.getElementById('res-btn').textContent='Ver resumen de '+lista;
  }
}
function renderClientes(){
  renderFiltrosListas();
  actualizarBarraResumen();
  const q=(document.getElementById('search-clientes')?.value||'').toLowerCase();
  const lista=db.clientes.filter((c,i)=>{
    const matchTexto=!q||c.nombre.toLowerCase().includes(q)||(c.codigo||'').toLowerCase().includes(q)||(c.dir||'').toLowerCase().includes(q);
    const matchCod = filtroCodCliente==='' ? true
      : filtroCodCliente==='SIN' ? !c.codigo
      : (String(filtroCodCliente).indexOf('LISTA:')===0 ? c.lista_precio===filtroCodCliente.slice(6) : (c.codigo||'').toUpperCase()===filtroCodCliente);
    return matchTexto && matchCod;
  });
  const t=document.getElementById('tabla-clientes');
  document.getElementById('clientes-count').textContent = lista.length + ' cliente' + (lista.length!==1?'s':'');
  if(!lista.length){t.innerHTML=\`<tr class="empty-row"><td colspan="7">Sin resultados</td></tr>\`;return;}
  const colores={'G':'#185FA5','L':'#3B6D11','E':'#854F0B','S':'#7B3FB0','C':'#A32D2D'};
  t.innerHTML=lista.map(c=>{
    const realIdx=db.clientes.indexOf(c);
    const col=colores[c.codigo]||'var(--text3)';
    const codBadge=c.codigo
      ?\`\${c.grupo?\`<span style="background:\${col};color:#fff;padding:2px 8px;border-radius:100px;font-size:11px;font-weight:700">\${c.codigo}</span>\`:''}\`
      :\`<span style="color:var(--text3)">—</span>\`;
    return\`<tr>
      <td><strong>\${c.nombre}</strong><br><span style="font-size:11px;color:var(--text3)">\${c.iva}</span></td>
      <td>\${codBadge}</td>
      <td>\${c.tel||'—'}</td>
      <td style="font-size:12px;color:var(--text2)">\${c.email||'—'}</td>
      <td style="font-size:12px">\${c.cuit||'—'}</td>
      <td style="font-size:12px">\${c.dir||'—'}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm" onclick="verHistorialCliente(\${realIdx})" title="Historial de boletas">📜 Historial</button>
        <button class="btn btn-sm" onclick="abrirModalCliente(\${realIdx})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarCliente(\${realIdx})">🗑️</button>
      </td>
    </tr>\`;
  }).join('');
}
function verHistorialCliente(ci){
  var c = db.clientes[ci];
  if(!c) return;
  var lista = db.presupuestos.filter(function(p){ return p.cliente && p.cliente.nombre === c.nombre; })
    .sort(function(a, b){ return (b.numero || 0) - (a.numero || 0); });
  document.getElementById('hist-titulo').textContent = 'Historial de ' + c.nombre + (c.codigo ? ' (' + c.codigo + ')' : '');
  var tot = 0, pag = 0, deb = 0;
  lista.forEach(function(p){
    var pg = (p.pagos || []).reduce(function(s, x){ return s + x.monto; }, 0);
    tot += p.total; pag += pg;
    if(p.estado === 'Pendiente') deb += saldoPendienteBoleta(p);
  });
  var caja = function(titulo, valor, color){ return '<div style="border:1px solid var(--border);border-radius:var(--radius);padding:8px 14px"><div style="font-size:11px;color:var(--text3)">' + titulo + '</div><div style="font-size:16px;font-weight:700;color:' + color + '">' + valor + '</div></div>'; };
  document.getElementById('hist-resumen').innerHTML =
    caja('Boletas', String(lista.length), 'var(--text)') + caja('Total vendido', '$' + fmt(tot), 'var(--text)') +
    caja('Total cobrado', '$' + fmt(pag), 'var(--green)') + caja('Debe actualmente', '$' + fmt(Math.max(0, deb)), 'var(--red)');
  var t = document.getElementById('hist-tabla');
  if(!lista.length){ t.innerHTML = '<tr class="empty-row"><td colspan="8">Este cliente todavía no tiene boletas</td></tr>'; }
  else t.innerHTML = lista.map(function(p){
    var i = db.presupuestos.indexOf(p);
    var pg = (p.pagos || []).reduce(function(s, x){ return s + x.monto; }, 0);
    var saldo = saldoPendienteBoleta(p);
    var det = (p.lineas || []).map(function(l){ return l.cant + ' x ' + l.nombre; }).join(', ');
    if(det.length > 110) det = det.slice(0, 110) + '...';
    return '<tr><td><strong>' + p.numero + '</strong></td>' +
      '<td style="font-size:12px">' + (p.fecha ? new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-AR') : '') + '</td>' +
      '<td style="font-size:11px;color:var(--text2);max-width:260px">' + det + '</td>' +
      '<td><strong>$' + fmt(p.total) + '</strong></td>' +
      '<td style="color:var(--green)">$' + fmt(pg) + '</td>' +
      '<td style="color:' + (saldo > 0.01 ? 'var(--red)' : 'var(--text3)') + '">$' + fmt(saldo) + '</td>' +
      '<td>' + p.estado + '</td>' +
      '<td style="white-space:nowrap"><button class="btn btn-sm" onclick="cerrarModales();editarPresupuesto(' + i + ')">✏️</button> <button class="btn btn-sm btn-green" onclick="imprimirPresupuesto(' + i + ')">🖨️</button></td></tr>';
  }).join('');
  document.getElementById('modal-historial-cliente').classList.add('open');
}
function filtrarClientes(v){ renderClientes(); }

// ---- PRESUPUESTOS ----
function abrirModalPresupuesto(){
  try {
  editPresIdx = null; presClienteSnapshot = null;
  document.getElementById('titulo-modal-pres').textContent = 'Nuevo presupuesto';
  document.getElementById('btn-guardar-pres').textContent = 'Guardar presupuesto';
  document.getElementById('modal-presupuesto').classList.add('open');
  listaClienteActual = 'General';
  const presLista = document.getElementById('pres-lista');
  if(presLista) poblarSelectLista('pres-lista', 'General');
  const sel = document.getElementById('pres-descuento');
  if(sel){ sel.value = '0'; const dc = document.getElementById('pres-descuento-custom'); if(dc) dc.style.display='none'; }
  const aviso=document.getElementById('aviso-lista-precio');
  if(aviso) aviso.style.display='none';
  document.getElementById('pres-cliente-input').value='';
  document.getElementById('pres-cliente-idx').value='';
  document.getElementById('ac-clientes').classList.remove('open');
  const hoy=new Date(); document.getElementById('pres-fecha').value=hoy.toISOString().split('T')[0];
  document.getElementById('pres-deuda').value=''; document.getElementById('pres-obs').value='';
  document.getElementById('lineas-presupuesto').innerHTML='';
  calcTotalPres(); agregarLineaPres();
  } catch(e) { console.error('Error abrirModalPresupuesto:', e); alert('Error: ' + e.message); }
}

// Autocomplete cliente
function acCliente(q){
  const list=document.getElementById('ac-clientes');
  document.getElementById('pres-cliente-idx').value='';
  if(!q.trim()){list.classList.remove('open');return;}
  const res=db.clientes.map((c,i)=>({c,i})).filter(({c})=>c.nombre.toLowerCase().includes(q.toLowerCase())||(c.codigo||'').toLowerCase().includes(q.toLowerCase()));
  if(!res.length){list.innerHTML='<div class="ac-empty">Sin resultados</div>';list.classList.add('open');return;}
  list.innerHTML=res.map(({c,i})=>\`<div class="ac-item" onmousedown="elegirCliente(\${i})"><strong>\${c.nombre}</strong>\${c.codigo?\` <span style="color:var(--blue-text)">(\${c.codigo})</span>\`:''}<div class="ac-sub">\${c.tel||''} \${c.dir||''}</div></div>\`).join('');
  list.classList.add('open');
}
// Variable global que guarda la lista del cliente actual
let listaClienteActual = null;
// ---- STOCK POR BOLETA ----
function nuevoIdProd(){ return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function asegurarIdsProductos(){
  var n = 0;
  db.productos.forEach(function(p){ if(!p.id){ p.id = nuevoIdProd(); n++; } });
  return n;
}
function vincularLineasAProductos(){
  var n = 0;
  (db.presupuestos || []).forEach(function(b){
    (b.lineas || []).forEach(function(l){
      if(l.pid) return;
      var i = prodDeLinea(l);
      if(i >= 0 && db.productos[i].id){ l.pid = db.productos[i].id; n++; }
    });
  });
  return n;
}
function prodDeLinea(l){
  var i = -1;
  if(l.pid){ i = db.productos.findIndex(function(p){ return p.id === l.pid; }); }
  if(i < 0 && l.cod){ i = db.productos.findIndex(function(p){ return String(p.codigo) === String(l.cod); }); }
  if(i < 0){ i = db.productos.findIndex(function(p){ return p.nombre === l.nombre; }); }
  return i;
}
function descontarStockBoleta(p){
  var aplicado = [], faltan = [], negativos = [];
  (p.lineas || []).forEach(function(l){
    var i = prodDeLinea(l);
    if(i < 0){ faltan.push(l.nombre); return; }
    var prod = db.productos[i];
    prod.stock = (parseFloat(prod.stock) || 0) - l.cant;
    aplicado.push({ i: i, codigo: prod.codigo, nombre: prod.nombre, cant: l.cant });
    if(prod.stock < 0 && negativos.indexOf(prod.nombre) < 0) negativos.push(prod.nombre);
  });
  p.stock_aplicado = aplicado;
  return { faltan: faltan, negativos: negativos };
}
function devolverStockBoleta(p){
  (p.stock_aplicado || []).forEach(function(a){
    var i = db.productos.findIndex(function(x){ return String(x.codigo) === String(a.codigo) && x.nombre === a.nombre; });
    if(i < 0) i = db.productos.findIndex(function(x){ return x.nombre === a.nombre; });
    if(i >= 0) db.productos[i].stock = (parseFloat(db.productos[i].stock) || 0) + a.cant;
  });
  p.stock_aplicado = null;
}
function avisoStock(r){
  var m = '';
  if(r.negativos.length) m += 'Ojo: estos productos quedaron con stock NEGATIVO (vendiste más de lo que tenías cargado): ' + r.negativos.join(', ') + '. ';
  if(r.faltan.length) m += 'Estos productos de la boleta no se encontraron en Productos y no se descontaron: ' + r.faltan.join(', ') + '.';
  if(m) alert(m);
}
function descontarStockAnteriores(){
  var pend = db.presupuestos.filter(function(p){ return !p.stock_aplicado && p.estado !== 'Rechazado'; });
  if(!pend.length){ alert('Todas las boletas ya tienen el stock descontado.'); return; }
  var tot = {}, faltan = {};
  pend.forEach(function(p){
    (p.lineas || []).forEach(function(l){
      var i = prodDeLinea(l);
      if(i < 0){ faltan[l.nombre] = true; return; }
      var n = db.productos[i].nombre;
      tot[n] = (tot[n] || 0) + l.cant;
    });
  });
  var nombres = Object.keys(tot);
  var unidades = nombres.reduce(function(s, n){ return s + tot[n]; }, 0);
  var NL = String.fromCharCode(10);
  var msg = 'Hay ' + pend.length + ' boletas sin descontar del stock (' + nombres.length + ' productos, ' + unidades + ' unidades en total).' + NL + NL + '' +
    'IMPORTANTE: si cargaste el stock DESPUÉS de hacer esas boletas, el stock ya está descontado y se restaría dos veces.' + NL + NL + '';
  if(Object.keys(faltan).length) msg += 'No se encontraron en Productos (no se descuentan): ' + Object.keys(faltan).slice(0, 8).join(', ') + '' + NL + NL + '';
  msg += '¿Descontar ahora?';
  if(!confirm(msg)) return;
  var negativos = [];
  pend.forEach(function(p){ var r = descontarStockBoleta(p); r.negativos.forEach(function(n){ if(negativos.indexOf(n) < 0) negativos.push(n); }); });
  registrarActividad('stock', 'Descontó stock de ' + pend.length + ' boletas anteriores', nombres.length + ' productos, ' + unidades + ' unidades');
  guardar().then(function(){
    if(!ultimoGuardadoOk) alert('El stock se descontó SOLO en esta computadora: no se pudo guardar en el servidor. No refresques; esperá y volvé a intentar guardar.');
  });
  renderPresupuestos(); if(typeof renderProductos === 'function') renderProductos(); renderDashboard();
  alert('Listo: se descontó el stock de ' + pend.length + ' boletas.' + (negativos.length ? ' Quedaron con stock negativo: ' + negativos.slice(0, 10).join(', ') : ''));
}
let editPresIdx = null;
let presClienteSnapshot = null;
function editarPresupuesto(idx){
  var p = db.presupuestos[idx];
  if(!p) return;
  abrirModalPresupuesto();
  editPresIdx = idx;
  presClienteSnapshot = null;
  document.getElementById('titulo-modal-pres').textContent = 'Editar boleta #' + p.numero;
  document.getElementById('btn-guardar-pres').textContent = 'Guardar cambios';
  document.getElementById('pres-fecha').value = p.fecha || '';
  document.getElementById('pres-obs').value = p.obs || '';
  document.getElementById('pres-deuda').value = p.deuda ? p.deuda : '';
  document.getElementById('pres-cliente-input').value = '';
  document.getElementById('pres-cliente-idx').value = '';
  if(p.cliente){
    var ci = db.clientes.findIndex(function(c){ return c.nombre === p.cliente.nombre; });
    document.getElementById('pres-cliente-input').value = p.cliente.nombre + (p.cliente.codigo ? ' (' + p.cliente.codigo + ')' : '');
    if(ci > -1){
      document.getElementById('pres-cliente-idx').value = ci;
      var lista = db.clientes[ci].lista_precio || 'General';
      listaClienteActual = lista;
      poblarSelectLista('pres-lista', lista);
    } else {
      presClienteSnapshot = p.cliente; // el cliente ya no está en la lista: se conserva tal cual
    }
  }
  var cont = document.getElementById('lineas-presupuesto');
  cont.innerHTML = '';
  (p.lineas || []).forEach(function(l){
    agregarLineaPres();
    var row = cont.lastElementChild;
    row.querySelector('.cod-linea').value = l.cod || '';
    row.querySelector('.prod-search').value = l.nombre || '';
    row.querySelector('.cant-linea').value = l.cant;
    row.querySelector('.precio-linea').value = l.precio;
    recalcLinea(row.querySelector('.cant-linea'));
  });
  agregarLineaPres();
  calcTotalPres();
}
function guardarEdicionPresupuesto(lineas, subtotal, cliente, deuda){
  var p = db.presupuestos[editPresIdx];
  if(!p){ alert('No se encontró la boleta'); return; }
  var nuevoTotal = subtotal + deuda;
  var pagado = (p.pagos || []).reduce(function(s, pg){ return s + pg.monto; }, 0);
  if(pagado > 0 && Math.abs(nuevoTotal - p.total) > 0.005){
    if(!confirm('Esta boleta ya tiene pagos por $' + fmt(pagado) + '. Los pagos se mantienen y el saldo se recalcula con el total nuevo ($' + fmt(nuevoTotal) + '). ¿Guardar los cambios?')) return;
  }
  var totalAntes = p.total;
  var textoCliente = document.getElementById('pres-cliente-input').value.trim();
  if(cliente) p.cliente = Object.assign({}, cliente);
  else if(presClienteSnapshot && textoCliente === (presClienteSnapshot.nombre + (presClienteSnapshot.codigo ? ' (' + presClienteSnapshot.codigo + ')' : ''))) p.cliente = presClienteSnapshot;
  else p.cliente = null;
  p.fecha = document.getElementById('pres-fecha').value;
  p.obs = document.getElementById('pres-obs').value.trim();
  var teniaStock = !!p.stock_aplicado;
  if(teniaStock) devolverStockBoleta(p);
  p.lineas = lineas;
  p.subtotal = subtotal;
  p.deuda = deuda;
  p.total = nuevoTotal;
  var rStockE = teniaStock && p.estado !== 'Rechazado' ? descontarStockBoleta(p) : {faltan:[],negativos:[]};
  registrarActividad('presupuesto', 'Editó boleta #' + p.numero, 'Cliente: ' + (p.cliente ? p.cliente.nombre : 'Consumidor final') + ' | Total: $' + fmt(totalAntes) + ' → $' + fmt(nuevoTotal));
  editPresIdx = null;
  presClienteSnapshot = null;
  cerrarModales();
  renderPresupuestos(); renderDashboard(); renderDeudores(); renderAfavor(); try{ renderEntrega(); }catch(e){} if(typeof renderProductos === 'function') renderProductos(); avisoStock(rStockE);
  guardar().then(function(){
    if(!ultimoGuardadoOk) alert('Los cambios de la boleta quedaron SOLO en esta computadora: no se pudieron guardar en el servidor. Si refrescás la página se pierden. Esperá unos segundos y volvé a guardar.');
  });
}


function aplicarDescuento(){
  const sel = document.getElementById('pres-descuento');
  const customInput = document.getElementById('pres-descuento-custom');
  if(sel.value === 'custom'){
    customInput.style.display = 'block';
  } else {
    customInput.style.display = 'none';
  }
  const pct = sel.value === 'custom' 
    ? parseFloat(customInput.value)||0 
    : parseFloat(sel.value)||0;
  // Aplicar descuento a todas las líneas ya cargadas
  document.querySelectorAll('.precio-linea').forEach(input => {
    const row = input.closest('.linea-item');
    if(!row) return;
    const prodIdx = row.dataset.prodIdx;
    if(prodIdx === undefined) return;
    const p = db.productos[prodIdx];
    if(!p) return;
    const precioBase = getPrecioParaCliente(p.nombre, getPrecioGeneral(p));
    const precioConDesc = pct > 0 ? Math.round(precioBase * (1 - pct/100)) : precioBase;
    input.value = precioConDesc > 0 ? precioConDesc.toFixed(2) : '';
    recalcLinea(input);
  });
}

function getDescuentoActual(){
  const sel = document.getElementById('pres-descuento');
  if(!sel) return 0;
  if(sel.value === 'custom') return parseFloat(document.getElementById('pres-descuento-custom').value)||0;
  return parseFloat(sel.value)||0;
}

function cambiarListaManual(lista){
  listaClienteActual = lista;
  const aviso = document.getElementById('aviso-lista-precio');
  if(aviso){ aviso.textContent=\`📋 Lista activa: \${lista}\`; aviso.style.display='inline-block'; }
}

function elegirCliente(idx){
  const c=db.clientes[idx];
  document.getElementById('pres-cliente-input').value=c.nombre+(c.codigo?' ('+c.codigo+')':'');
  document.getElementById('pres-cliente-idx').value=idx;
  document.getElementById('ac-clientes').classList.remove('open');
  // Asignar lista según el cliente
  const lista = c.lista_precio || 'General';
  listaClienteActual = lista;
  poblarSelectLista('pres-lista', lista);
  const aviso = document.getElementById('aviso-lista-precio');
  if(aviso){ aviso.textContent=\`📋 Lista activa: \${lista}\`; aviso.style.display='inline-block'; }
  // Traer saldo pendiente o a favor automáticamente
  const saldoPend = calcSaldoPendienteCliente(idx);
  const saldoFav  = calcSaldoAFavorCliente(idx);
  if(saldoPend > 0){
    document.getElementById('pres-deuda').value = saldoPend.toFixed(2);
  } else if(saldoFav > 0){
    document.getElementById('pres-deuda').value = (-saldoFav).toFixed(2);
  } else {
    document.getElementById('pres-deuda').value = '';
  }
  calcTotalPres();
}

function getPrecioParaCliente(nombreProd, precioBase){
  if(!listaClienteActual || listaClienteActual==='General') return precioBase||0;
  if(!db.listas_precio) return precioBase||0;
  const lista = db.listas_precio[listaClienteActual];
  if(!lista){ var pm0 = db.productos.find(function(x){ return x.nombre === nombreProd; }); var pa0 = pm0 ? precioListaAuto(pm0, listaClienteActual) : 0; return pa0 > 0 ? pa0 : (precioBase||0); }
  if(lista[nombreProd] !== undefined) return lista[nombreProd];
  const nombreLimpio = nombreProd.split(' – ')[0].trim();
  if(lista[nombreLimpio] !== undefined) return lista[nombreLimpio];
  var pm = db.productos.find(function(x){ return x.nombre === nombreProd || x.nombre === nombreLimpio; });
  var pa = pm ? precioListaAuto(pm, listaClienteActual) : 0;
  if(pa > 0) return pa;
  return precioBase||0;
}

// ---- LISTAS DE PRECIOS ----
let listaTabActual = 'General';
function setListaTab(tab, el){
  listaTabActual = tab;
  document.querySelectorAll('.lista-tab').forEach(b=>{
    b.style.color='var(--text2)'; b.style.fontWeight='500'; b.style.borderBottom='2px solid transparent';
  });
  el.style.color='var(--blue)'; el.style.fontWeight='600'; el.style.borderBottom='2px solid var(--blue)';
  renderLista();
}
function getPrecioGeneral(prod){
  if(prod.precio && prod.precio > 0) return prod.precio;
  if(prod.costo && prod.costo > 0){
    const margen = (db.config?.margenGeneral || 30) / 100;
    return Math.round(prod.costo * (1 + margen));
  }
  return 0;
}
function getPrecioLista(prod, tab){
  if(tab==='General') return getPrecioGeneral(prod);
  if(!db.listas_precio) return 0;
  const lista=db.listas_precio[tab];
  if(!lista) return 0;
  return lista[prod.nombre]||lista[prod.nombre.split(' – ')[0].trim()]||0;
}
// ---- LISTAS DE PRECIOS: planilla estilo Excel (General, Gloria y Luis juntas) ----
var LISTAS_COLS = ['General'];
var listasSucia = false;
var listasUltimoCheck = null;
var LISTAS_TAB = String.fromCharCode(9);

// Solo acepta celdas que sean un precio (numeros, punto, coma, $ y espacios); un nombre de producto no cuenta
function listasNum(s){
  s = String(s == null ? '' : s).trim();
  if(!s) return null;
  var hayDigito = false;
  for(var i = 0; i < s.length; i++){
    var ch = s.charAt(i);
    if(ch >= '0' && ch <= '9') hayDigito = true;
    else if(ch !== '.' && ch !== ',' && ch !== '$' && ch !== ' ' && ch !== String.fromCharCode(160)) return null;
  }
  return hayDigito ? parseCosto(s) : null;
}
function listasActual(p, lista){
  if(lista === 'General') return (p.precio && p.precio > 0) ? p.precio : 0;
  return getPrecioLista(p, lista) || 0;
}
function listasVisibles(){
  return Array.prototype.slice.call(document.querySelectorAll('#tabla-lista tr[data-k]'))
    .filter(function(tr){ return tr.style.display !== 'none'; })
    .map(function(tr){ return parseInt(tr.getAttribute('data-k'), 10); });
}
var listasVerNombre = (function(){ try { var v = localStorage.getItem('hap_lista_ver'); return v === null ? 'General' : v; } catch(e) { return 'General'; } })();
function precioListaAuto(prod, lista){
  if(!prod || !lista || lista === 'General') return 0;
  var m = db.listas_margen ? db.listas_margen[lista] : undefined;
  if(m === undefined || m === null || m === '' || isNaN(Number(m))) return 0;
  if(!(prod.costo > 0)) return 0;
  return Math.round(prod.costo * (1 + Number(m) / 100));
}
function listasAplicarVista(){
  var idx = listasVerNombre === '' ? -1 : LISTAS_COLS.indexOf(listasVerNombre);
  if(listasVerNombre !== '' && idx < 0){ listasVerNombre = 'General'; idx = 0; }
  var sel = document.getElementById('lista-ver');
  if(sel) sel.value = idx < 0 ? '' : String(idx);
  LISTAS_COLS.forEach(function(n, c){
    var show = idx < 0 || idx === c;
    Array.prototype.forEach.call(document.querySelectorAll('.lpc-' + c), function(el){ el.style.display = show ? '' : 'none'; });
  });
}
function listasCambiarVista(){
  var v = document.getElementById('lista-ver').value;
  listasVerNombre = v === '' ? '' : LISTAS_COLS[parseInt(v, 10)];
  try { localStorage.setItem('hap_lista_ver', listasVerNombre); } catch(e) {}
  listasAplicarVista();
  if(v !== ''){
    var s1 = document.getElementById('listas-igual-lista');
    if(s1) s1.value = v;
    listasMargenPrefill();
  }
}
function listasMargenPrefill(){
  var c = parseInt(document.getElementById('listas-igual-lista').value, 10);
  var nombre = LISTAS_COLS[c];
  var hint = document.getElementById('listas-margen-hint');
  var inp = document.getElementById('listas-margen');
  var m;
  if(nombre === 'General') m = (db.config && db.config.margenGeneral) ? db.config.margenGeneral : 30;
  else m = db.listas_margen ? db.listas_margen[nombre] : undefined;
  var hay = (m !== undefined && m !== null && m !== '');
  if(inp) inp.value = hay ? fmtInp(Number(m)) : '';
  if(hint){
    if(nombre === 'General') hint.textContent = 'Margen de la lista General: ' + fmtInp(Number(m)) + '% sobre el costo (para los productos sin precio cargado).';
    else hint.textContent = hay ? ('Margen guardado para la lista ' + nombre + ': ' + fmtInp(Number(m)) + '%. Los productos sin precio en esta lista se calculan solos con ese margen.') : ('La lista ' + nombre + ' no tiene margen guardado: los productos sin precio usan el precio General.');
  }
}
function listasRefrescarPlaceholders(){
  for(var k = 0; k < db.productos.length; k++){
    for(var c = 0; c < LISTAS_COLS.length; c++){
      var inp = document.getElementById('lp-in-' + k + '-' + c);
      if(!inp) continue;
      var lista = LISTAS_COLS[c];
      var auto = lista === 'General' ? getPrecioGeneral(db.productos[k]) : precioListaAuto(db.productos[k], lista);
      inp.placeholder = auto > 0 ? fmtInp(auto) : '—';
    }
  }
}
function renderLista(){
  var t = document.getElementById('tabla-lista');
  if(listasSucia && t.children.length) return; // no perder lo que se está escribiendo
  listasArmarCabecera();
  var prods = db.productos;
  if(!prods.length){
    t.innerHTML = '<tr class="empty-row"><td colspan="4">No hay productos cargados</td></tr>';
    listasCambio();
    return;
  }
  t.innerHTML = prods.map(function(p, k){
    var auto = getPrecioGeneral(p);
    var celdas = LISTAS_COLS.map(function(lista, c){
      var v = listasActual(p, lista);
      var autoL = lista === 'General' ? auto : precioListaAuto(p, lista);
      var ph = autoL > 0 ? fmtInp(autoL) : '—';
      return '<td class="lpc-' + c + '" style="text-align:right"><input type="text" inputmode="decimal" class="inp" id="lp-in-' + k + '-' + c + '" value="' + (v > 0 ? fmtInp(v) : '') + '" placeholder="' + ph + '" style="width:92px;text-align:right" oninput="listasCambio()" onpaste="listasPegar(event,' + k + ',' + c + ')" onkeydown="listasTecla(event,' + k + ',' + c + ')" onblur="listasNormalizar(' + k + ',' + c + ')"></td>';
    }).join('');
    return '<tr data-k="' + k + '">' +
      '<td class="lp-sticky1"><input type="checkbox" class="lp-chk" onclick="listasClick(event,' + k + ')"></td>' +
      '<td class="lp-sticky2"><strong>' + p.nombre + '</strong><div style="font-size:11px;color:var(--text3)">' + (p.codigo || '') + (p.codigo && p.medida ? ' · ' : '') + (p.medida || '') + '</div></td>' +
      '<td style="text-align:right;font-size:12px;color:var(--text2);white-space:nowrap">' + (p.costo > 0 ? '$' + fmt(p.costo) : '—') + '</td>' +
      celdas + '</tr>';
  }).join('');
  filtrarListas();
  listasSelCount();
  listasCambio();
  listasAplicarVista();
  listasMargenPrefill();
}
function filtrarListas(){
  var q = (document.getElementById('lista-search').value || '').toLowerCase().trim();
  var sel = document.getElementById('lista-solosin').value;
  Array.prototype.slice.call(document.querySelectorAll('#tabla-lista tr[data-k]')).forEach(function(tr){
    var k = parseInt(tr.getAttribute('data-k'), 10);
    var p = db.productos[k];
    var txt = p ? ((p.nombre || '') + ' ' + (p.medida || '') + ' ' + (p.codigo || '')).toLowerCase() : '';
    var ver = (!q || txt.indexOf(q) > -1) && (sel === '' || !(p && listasActual(p, LISTAS_COLS[parseInt(sel, 10)]) > 0));
    tr.style.display = ver ? '' : 'none';
    if(!ver){ var c = tr.querySelector('.lp-chk'); if(c) c.checked = false; }
  });
  var todos = document.getElementById('listas-todos'); if(todos) todos.checked = false;
  listasUltimoCheck = null;
  listasSelCount();
}
// Cuenta y resalta cambios (solo celdas con un número distinto al precio actual; vacío = sin cambio)
function listasCambio(){
  var n = 0;
  for(var k = 0; k < db.productos.length; k++){
    for(var c = 0; c < LISTAS_COLS.length; c++){
      var inp = document.getElementById('lp-in-' + k + '-' + c);
      if(!inp) continue;
      var v = listasNum(inp.value);
      var cambio = (v !== null && Math.abs(v - listasActual(db.productos[k], LISTAS_COLS[c])) > 0.000001);
      if(cambio) n++;
      inp.style.background = cambio ? 'var(--amber-light)' : '';
      inp.style.borderColor = (inp.value.trim() !== '' && v === null) ? 'var(--red)' : '';
    }
  }
  listasSucia = n > 0;
  var lab = document.getElementById('listas-cambios');
  if(lab){
    lab.style.color = n > 0 ? 'var(--amber)' : 'var(--text2)';
    lab.textContent = n === 0 ? 'Sin cambios' : (n + (n === 1 ? ' cambio sin guardar' : ' cambios sin guardar'));
  }
  return n;
}
function listasNormalizar(k, c){
  var inp = document.getElementById('lp-in-' + k + '-' + c);
  if(!inp) return;
  var v = listasNum(inp.value);
  if(v !== null) inp.value = fmtInp(v);
  listasCambio();
}
function listasTecla(e, k, c){
  var vis = listasVisibles();
  var pos = vis.indexOf(k);
  var dest = null;
  if(e.key === 'Enter' || e.key === 'ArrowDown') dest = vis[pos + 1];
  else if(e.key === 'ArrowUp') dest = vis[pos - 1];
  else return;
  e.preventDefault();
  if(dest !== null && dest !== undefined){
    var nx = document.getElementById('lp-in-' + dest + '-' + c);
    if(nx){ nx.focus(); nx.select(); }
  }
}
// Pegar celdas copiadas de Excel: se completan hacia abajo y hacia la derecha desde la casilla actual
function listasPegar(e, k, c){
  var cd = e.clipboardData || window.clipboardData;
  var txt = cd ? cd.getData('text') : '';
  var lines = txt.split(PL_NL).map(function(l){ return l.split(PL_CR).join(''); });
  while(lines.length && lines[lines.length - 1] === '') lines.pop();
  if(!lines.length) return;
  if(lines.length === 1 && lines[0].indexOf(LISTAS_TAB) === -1) return; // un solo valor: pegado normal
  e.preventDefault();
  var vis = listasVisibles();
  var start = vis.indexOf(k);
  var espacio = LISTAS_COLS.length - c;
  var puestos = 0;
  lines.forEach(function(l, i){
    var kk = vis[start + i];
    if(kk === undefined) return;
    var cells = l.split(LISTAS_TAB);
    while(cells.length > 1 && cells[0].trim() !== '' && listasNum(cells[0]) === null) cells.shift(); // sin la columna del nombre
    if(listasVerNombre !== '' && cells.length > 1) cells = cells.slice(cells.length - 1);
    if(cells.length > espacio) cells = cells.slice(cells.length - espacio);
    cells.forEach(function(cell, j){
      var v = listasNum(cell);
      if(v === null) return;
      var inp = document.getElementById('lp-in-' + kk + '-' + (c + j));
      if(inp){ inp.value = fmtInp(v); puestos++; }
    });
  });
  listasCambio();
  var lab = document.getElementById('listas-cambios');
  lab.textContent = lab.textContent + ' · pegados ' + puestos + ' valores';
}
function listasSelCount(){
  var el = document.getElementById('listas-selcount');
  if(el) el.textContent = document.querySelectorAll('#tabla-lista .lp-chk:checked').length;
}
function listasClick(e, k){
  var on = e.target.checked;
  if(e.shiftKey && listasUltimoCheck !== null){
    var vis = listasVisibles();
    var a = vis.indexOf(listasUltimoCheck), b = vis.indexOf(k);
    if(a > -1 && b > -1){
      var lo = Math.min(a, b), hi = Math.max(a, b);
      for(var i = lo; i <= hi; i++){
        var ch = document.querySelector('#tabla-lista tr[data-k="' + vis[i] + '"] .lp-chk');
        if(ch) ch.checked = on;
      }
    }
  }
  listasUltimoCheck = k;
  listasSelCount();
}
function listasSelTodos(on){
  listasVisibles().forEach(function(k){
    var ch = document.querySelector('#tabla-lista tr[data-k="' + k + '"] .lp-chk');
    if(ch) ch.checked = on;
  });
  listasSelCount();
}
async function aplicarIgualListas(){
  var m = listasNum(document.getElementById('listas-margen').value);
  var v = listasNum(document.getElementById('listas-igual').value);
  var c = parseInt(document.getElementById('listas-igual-lista').value, 10);
  var lista = LISTAS_COLS[c];
  var recordar = document.getElementById('listas-recordar').checked;
  var marcados = Array.prototype.slice.call(document.querySelectorAll('#tabla-lista .lp-chk:checked'));
  if(m === null && v === null){ alert('Poné un margen sobre el costo (%) o un precio fijo'); return; }
  if(!marcados.length && !(recordar && m !== null)){ alert('Primero marcá los productos que van a tener ese precio'); return; }
  var sinCosto = 0, puestos = 0;
  marcados.forEach(function(ch){
    var k = parseInt(ch.closest('tr').getAttribute('data-k'), 10);
    var precio = v;
    if(m !== null){
      var costo = db.productos[k] ? db.productos[k].costo : 0;
      if(!(costo > 0)){ sinCosto++; ch.checked = false; return; }
      precio = Math.round(costo * (1 + m / 100));
    }
    document.getElementById('lp-in-' + k + '-' + c).value = fmtInp(precio);
    puestos++;
    ch.checked = false;
  });
  if(recordar && m !== null){
    if(lista === 'General'){ if(!db.config) db.config = {}; db.config.margenGeneral = m; }
    else { if(!db.listas_margen) db.listas_margen = {}; db.listas_margen[lista] = m; }
    try { await guardar(); } catch(e) {}
    listasRefrescarPlaceholders();
    listasMargenPrefill();
  }
  document.getElementById('listas-igual').value = '';
  document.getElementById('listas-todos').checked = false;
  listasUltimoCheck = null;
  listasSelCount();
  listasCambio();
  var lab = document.getElementById('listas-cambios');
  var extra = [];
  if(puestos) extra.push(puestos + ' precios puestos' + (m !== null ? ' con ' + fmtInp(m) + '% de margen' : ''));
  if(sinCosto) extra.push(sinCosto + ' sin costo cargado (no se tocaron)');
  if(recordar && m !== null) extra.push('margen recordado para ' + lista);
  if(lab && extra.length) lab.textContent = lab.textContent + ' · ' + extra.join(' · ');
  if(sinCosto) alert(sinCosto + ' producto(s) marcados no tienen costo cargado, por eso no se les calculó el precio.');
}
var LISTAS_MAL = '<>&"' + "'" + String.fromCharCode(96, 36, 92);
function listasNombres(){
  var ks = Object.keys(db.listas_precio || {});
  var pref = ['Gloria', 'Luis', 'Edgardo'];
  var out = ['General'];
  pref.forEach(function(n){ if(ks.indexOf(n) > -1) out.push(n); });
  ks.filter(function(n){ return pref.indexOf(n) === -1 && n !== 'General'; }).sort().forEach(function(n){ out.push(n); });
  return out;
}
// Llena un select con todas las listas (cliente, presupuesto)
function poblarSelectLista(id, valor){
  var s = document.getElementById(id);
  if(!s) return;
  var nombres = listasNombres();
  if(valor && nombres.indexOf(valor) === -1) nombres.push(valor);
  s.innerHTML = nombres.map(function(n){ return '<option value="' + n + '">' + (n === 'General' ? 'Lista General' : 'Lista ' + n) + '</option>'; }).join('');
  s.value = valor || 'General';
}
function listasArmarCabecera(){
  LISTAS_COLS = listasNombres();
  var h = '<th class="lp-sticky1"><input type="checkbox" id="listas-todos" onchange="listasSelTodos(this.checked)"></th><th class="lp-sticky2">Producto</th><th style="text-align:right">Costo</th>';
  LISTAS_COLS.forEach(function(n, c){
    var nCli = db.clientes.filter(function(x){ return x.lista_precio === n; }).length;
    h += '<th class="lpc-' + c + '" style="text-align:right" data-lista="' + n + '"><div>' + n + '</div>' + (c > 0 ? '<div style="white-space:nowrap;margin-top:3px"><button class="btn btn-sm" title="Elegir qué clientes usan esta lista" onclick="abrirClientesLista(' + c + ')" style="padding:0 6px;font-size:11px">👥 ' + nCli + '</button> <button class="btn btn-sm btn-danger" title="Eliminar esta lista" onclick="eliminarListaPrecios(' + c + ')" style="padding:0 5px;font-size:11px">🗑</button></div>' : '') + '</th>';
  });
  document.getElementById('listas-thead').innerHTML = '<tr>' + h + '</tr>';
  var sv = document.getElementById('lista-ver');
  if(sv) sv.innerHTML = '<option value="">Todas las listas</option>' + LISTAS_COLS.map(function(n, c){ return '<option value="' + c + '">' + n + '</option>'; }).join('');
  var s1 = document.getElementById('listas-igual-lista'), v1 = s1.value;
  s1.innerHTML = LISTAS_COLS.map(function(n, c){ return '<option value="' + c + '">' + n + '</option>'; }).join('');
  if(v1 !== '' && parseInt(v1, 10) < LISTAS_COLS.length) s1.value = v1;
  var s2 = document.getElementById('lista-solosin'), v2 = s2.value;
  s2.innerHTML = '<option value="">Ver todos los productos</option>' + LISTAS_COLS.map(function(n, c){ return '<option value="' + c + '">Solo sin precio ' + n + '</option>'; }).join('');
  if(v2 !== '' && parseInt(v2, 10) < LISTAS_COLS.length) s2.value = v2;
  var s3 = document.getElementById('listas-nueva-copiar'), v3 = s3.value;
  s3.innerHTML = '<option value="">en blanco</option>' + LISTAS_COLS.map(function(n, c){ return '<option value="' + c + '">' + n + '</option>'; }).join('');
  if(v3 !== '' && parseInt(v3, 10) < LISTAS_COLS.length) s3.value = v3;
}
var LISTAS_FIJAS = ['General', 'Gloria', 'Luis', 'Edgardo'];
function clienteEnLista(cli, nombreLista){
  if(!cli) return false;
  var real = db.clientes.find(function(x){ return x.nombre === cli.nombre; });
  return !!real && real.lista_precio === nombreLista;
}
// Botones de filtro para las listas nuevas, al lado de Gloria / Luis / Edgardo
function renderFiltrosListas(){
  var extra = listasNombres().filter(function(n){ return LISTAS_FIJAS.indexOf(n) === -1; });
  var vars = { setFiltroCliente: filtroCodCliente, setFiltroPres: filtroPresupuesto, setFiltroDeudor: filtroCodDeudor, setFiltroAfavor: filtroAfavor };
  Array.prototype.slice.call(document.querySelectorAll('.filtro-extra')).forEach(function(sp){
    var fn = sp.getAttribute('data-fn');
    var actual = vars[fn] || '';
    if(actual.indexOf('LISTA:') === 0 && extra.indexOf(actual.slice(6)) === -1){
      // la lista elegida ya no existe: volver a Todos
      if(fn === 'setFiltroCliente') filtroCodCliente = '';
      else if(fn === 'setFiltroPres') filtroPresupuesto = '';
      else if(fn === 'setFiltroDeudor') filtroCodDeudor = '';
      else if(fn === 'setFiltroAfavor') filtroAfavor = '';
      actual = '';
      var bs = sp.parentElement.querySelectorAll('.filtro-btn');
      for(var i = 0; i < bs.length; i++) bs[i].classList.remove('active');
      if(bs.length) bs[0].classList.add('active');
    }
    sp.innerHTML = extra.map(function(n){
      var on = actual === 'LISTA:' + n;
      return '<button class="filtro-btn filtro-x' + (on ? ' active' : '') + '" data-lista="' + n + '" onclick="' + fn + "('LISTA:' + this.getAttribute('data-lista'), this)" + '">' + n + ' <span class="filtro-x-del" title="Eliminar esta lista" onclick="event.stopPropagation(); eliminarListaPorNombre(this.parentNode.getAttribute(' + "'data-lista'" + '))">✕</span></button>';
    }).join('');
  });
}
async function eliminarListaPorNombre(nombre){
  LISTAS_COLS = listasNombres();
  var c = LISTAS_COLS.indexOf(nombre);
  if(c < 1) return;
  await eliminarListaPrecios(c);
  renderFiltrosListas();
  var sec = document.querySelector('.section.active');
  var id = sec ? sec.id : '';
  if(id === 'clientes') renderClientes();
  else if(id === 'presupuestos') renderPresupuestos();
  else if(id === 'deudores') renderDeudores();
  else if(id === 'afavor') renderAfavor();
}
function lcEliminar(){
  var nombre = lcLista;
  cerrarModales();
  lcLista = null;
  if(nombre) eliminarListaPrecios(LISTAS_COLS.indexOf(nombre));
}
var lcLista = null;
function abrirClientesLista(c){
  var nombre = LISTAS_COLS[c];
  if(!nombre || nombre === 'General') return;
  lcLista = nombre;
  document.getElementById('lc-titulo').textContent = 'Clientes que usan la lista ' + nombre;
  document.getElementById('lc-buscar').value = '';
  var cont = document.getElementById('lc-lista');
  if(!db.clientes.length){
    cont.innerHTML = '<div style="padding:12px;font-size:13px;color:var(--text3)">Todavía no hay clientes cargados</div>';
  } else {
    cont.innerHTML = db.clientes.map(function(cl, i){
      var otra = (cl.lista_precio && cl.lista_precio !== 'General' && cl.lista_precio !== nombre) ? ' <span style="font-size:11px;color:var(--amber)">· hoy usa ' + cl.lista_precio + '</span>' : '';
      return '<label class="lc-fila" data-i="' + i + '" style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--border);cursor:pointer;font-size:13px">' +
        '<input type="checkbox" class="lc-chk" data-i="' + i + '"' + (cl.lista_precio === nombre ? ' checked' : '') + ' onchange="lcContar()">' +
        '<span><strong>' + cl.nombre + '</strong>' + (cl.codigo ? ' <span style="color:var(--text3)">(' + cl.codigo + ')</span>' : '') + otra + '</span></label>';
    }).join('');
  }
  lcContar();
  document.getElementById('modal-lista-clientes').classList.add('open');
}
function lcContar(){
  document.getElementById('lc-count').textContent = document.querySelectorAll('#lc-lista .lc-chk:checked').length;
}
function lcFiltrar(){
  var q = document.getElementById('lc-buscar').value.toLowerCase().trim();
  Array.prototype.slice.call(document.querySelectorAll('#lc-lista .lc-fila')).forEach(function(f){
    var cl = db.clientes[parseInt(f.getAttribute('data-i'), 10)];
    var txt = cl ? ((cl.nombre || '') + ' ' + (cl.codigo || '')).toLowerCase() : '';
    f.style.display = (!q || txt.indexOf(q) > -1) ? 'flex' : 'none';
  });
}
function lcMarcarVisibles(on){
  Array.prototype.slice.call(document.querySelectorAll('#lc-lista .lc-fila')).forEach(function(f){
    if(f.style.display === 'none') return;
    f.querySelector('.lc-chk').checked = on;
  });
  lcContar();
}
async function lcGuardar(){
  if(!lcLista) return;
  var n = 0;
  Array.prototype.slice.call(document.querySelectorAll('#lc-lista .lc-chk')).forEach(function(ch){
    var cl = db.clientes[parseInt(ch.getAttribute('data-i'), 10)];
    if(!cl) return;
    if(ch.checked){ if(cl.lista_precio !== lcLista){ cl.lista_precio = lcLista; } n++; }
    else if(cl.lista_precio === lcLista){ cl.lista_precio = 'General'; }
  });
  var nombre = lcLista;
  cerrarModales();
  lcLista = null;
  try { await guardar(); } catch(e) {}
  listasArmarCabecera();
  renderClientes();
  var lab = document.getElementById('listas-cambios');
  if(lab){
    if(ultimoGuardadoOk){
      lab.style.color = 'var(--green)';
      lab.textContent = '✅ Lista ' + nombre + ': ' + n + (n === 1 ? ' cliente la usa' : ' clientes la usan');
    } else {
      lab.style.color = 'var(--red)';
      lab.textContent = '⚠️ Los clientes de la lista ' + nombre + ' quedaron SOLO en esta computadora: no se pudo guardar en el servidor.';
      alert('No se pudo guardar en el servidor. Esperá unos segundos y probá de nuevo.');
    }
  }
}
async function crearListaPrecios(){
  var lab = document.getElementById('listas-cambios');
  if(listasSucia){ alert('Primero guardá los cambios de la planilla (botón Guardar todo)'); return; }
  var inp = document.getElementById('listas-nueva-nombre');
  var nombre = inp.value.trim();
  if(!nombre){ alert('Escribí el nombre de la lista (por ejemplo el nombre del cliente)'); return; }
  if(nombre.length > 30){ alert('El nombre es muy largo (máximo 30 letras)'); return; }
  for(var i = 0; i < nombre.length; i++){
    if(LISTAS_MAL.indexOf(nombre.charAt(i)) > -1){ alert('El nombre tiene un símbolo que no se puede usar'); return; }
  }
  var existe = listasNombres().some(function(n){ return n.toLowerCase() === nombre.toLowerCase(); });
  if(existe){ alert('Ya existe una lista con ese nombre'); return; }
  var cop = document.getElementById('listas-nueva-copiar').value;
  var precios = {};
  if(cop !== ''){
    var origen = LISTAS_COLS[parseInt(cop, 10)];
    db.productos.forEach(function(p){
      var v = origen === 'General' ? getPrecioGeneral(p) : listasActual(p, origen);
      if(v > 0) precios[p.nombre] = v;
    });
  }
  if(!db.listas_precio) db.listas_precio = {};
  db.listas_precio[nombre] = precios;
  if(listasVerNombre !== '') { listasVerNombre = nombre; try { localStorage.setItem('hap_lista_ver', nombre); } catch(e) {} }
  try { await guardar(); } catch(e) {}
  inp.value = '';
  renderLista();
  var thNueva = document.querySelector('#listas-thead th[data-lista="' + nombre + '"]');
  if(thNueva && thNueva.scrollIntoView) thNueva.scrollIntoView({ inline: 'center', block: 'nearest' });
  lab = document.getElementById('listas-cambios');
  if(ultimoGuardadoOk){
    lab.style.color = 'var(--green)';
    lab.textContent = '✅ Lista ' + nombre + ' creada y guardada. Elegí qué clientes la usan.';
  } else {
    lab.style.color = 'var(--red)';
    lab.textContent = '⚠️ La lista ' + nombre + ' quedó SOLO en esta computadora: no se pudo guardar en el servidor.';
    alert('No se pudo guardar la lista en el servidor. Si refrescás la página se pierde. Esperá unos segundos y probá de nuevo.');
  }
  abrirClientesLista(LISTAS_COLS.indexOf(nombre));
}
async function eliminarListaPrecios(c){
  if(listasSucia){ alert('Primero guardá los cambios de la planilla (botón Guardar todo)'); return; }
  var nombre = LISTAS_COLS[c];
  if(!nombre || nombre === 'General') return;
  var usan = db.clientes.filter(function(x){ return x.lista_precio === nombre; });
  var msg = 'Eliminar la lista ' + nombre + '? Se borran todos sus precios.';
  if(usan.length) msg += ' Hay ' + usan.length + ' clientes con esta lista: van a pasar a la Lista General.';
  if(!confirm(msg)) return;
  usan.forEach(function(x){ x.lista_precio = 'General'; });
  delete db.listas_precio[nombre];
  if(db.listas_margen) delete db.listas_margen[nombre];
  try { await guardar(); } catch(e) {}
  renderLista();
}
// Un solo guardado para todos los cambios de las listas
async function guardarListas(){
  var cambios = [];
  for(var k = 0; k < db.productos.length; k++){
    for(var c = 0; c < LISTAS_COLS.length; c++){
      var inp = document.getElementById('lp-in-' + k + '-' + c);
      var v = inp ? listasNum(inp.value) : null;
      if(v !== null && Math.abs(v - listasActual(db.productos[k], LISTAS_COLS[c])) > 0.000001) cambios.push({ k: k, lista: LISTAS_COLS[c], v: v });
    }
  }
  var lab = document.getElementById('listas-cambios');
  if(!cambios.length){ lab.textContent = 'No hay cambios para guardar'; return; }
  var btn = document.getElementById('listas-guardar');
  btn.disabled = true; btn.textContent = '⏳ Guardando...';
  if(!db.listas_precio) db.listas_precio = {};
  cambios.forEach(function(x){
    if(x.lista === 'General'){
      db.productos[x.k].precio = x.v;
    } else {
      if(!db.listas_precio[x.lista]) db.listas_precio[x.lista] = {};
      db.listas_precio[x.lista][db.productos[x.k].nombre] = x.v;
    }
  });
  try { await guardar(); } catch(e) {}
  btn.disabled = false; btn.textContent = '💾 Guardar todo';
  listasCambio();
  if(ultimoGuardadoOk){
    lab.style.color = 'var(--green)';
    lab.textContent = '✅ ' + cambios.length + (cambios.length === 1 ? ' precio guardado' : ' precios guardados');
  } else {
    lab.style.color = 'var(--red)';
    lab.textContent = '⚠️ Los precios quedaron SOLO en esta computadora: no se pudieron guardar en el servidor.';
    alert('No se pudo guardar en el servidor. Si refrescás la página se pierden. Esperá unos segundos y apretá Guardar todo de nuevo.');
  }
}

function calcSaldoPendienteCliente(cliIdx){
  const cli=db.clientes[cliIdx]; if(!cli)return 0;
  return db.presupuestos
    .filter(p=>p.estado==='Pendiente'&&!(p.cierre&&cierreActivo(p.cierre))&&p.cliente&&p.cliente.nombre===cli.nombre)
    .reduce((sum,p)=>sum+Math.max(0,saldoPendienteBoleta(p)),0);
}
function calcSaldoAFavorCliente(cliIdx){
  const cli=db.clientes[cliIdx]; if(!cli)return 0;
  return db.presupuestos
    .filter(p=>p.cliente&&p.cliente.nombre===cli.nombre)
    .reduce((sum,p)=>sum+Math.max(0,-saldoPendienteBoleta(p)),0);
}
function saldoPendienteBoleta(p){
  const pagado=(p.pagos||[]).reduce((s,pg)=>s+pg.monto,0);
  return p.total - pagado; // puede ser negativo = a favor
}
function saldoDeuda(p){ return Math.max(0, saldoPendienteBoleta(p)); }
function saldoAFavor(p){ return Math.max(0, -saldoPendienteBoleta(p)); }
document.addEventListener('click',e=>{
  if(!e.target.closest('#pres-cliente-input')&&!e.target.closest('#ac-clientes'))
    document.getElementById('ac-clientes')?.classList.remove('open');
});

function autocompletarDeuda(){ calcTotalPres(); }

function agregarLineaPres(){
  const div=document.createElement('div'); div.className='linea-item';
  div.innerHTML=\`
    <input type="text" class="inp cod-linea" placeholder="Cód.">
    <div class="ac-wrap" style="width:100%">
      <input type="text" class="inp prod-search" placeholder="Buscar producto..." oninput="acProducto(this)" autocomplete="off" style="width:100%">
      <div class="ac-list prod-ac-list"></div>
    </div>
    <input type="number" class="inp cant-linea" placeholder="1" min="1" value="1" oninput="recalcLinea(this)">
    <input type="number" class="inp precio-linea" placeholder="0.00" step="0.01" oninput="recalcLinea(this)">
    <input type="text" class="inp imp-linea" readonly style="background:var(--bg);color:var(--text2)" placeholder="$0.00">
    <button class="btn btn-sm btn-danger" onclick="this.closest('.linea-item').remove();calcTotalPres()" style="align-self:center">✕</button>\`;
  document.getElementById('lineas-presupuesto').appendChild(div);
  // cerrar otros dropdowns al enfocar
  div.querySelector('.prod-search').addEventListener('focus', function(){ acProducto(this); });
}

function acProducto(input){
  const q=input.value.toLowerCase().trim();
  const list=input.closest('.ac-wrap').querySelector('.prod-ac-list');
  // cerrar todos los otros
  document.querySelectorAll('.prod-ac-list').forEach(l=>{ if(l!==list) l.classList.remove('open'); });
  const res=db.productos.map((p,i)=>({p,i})).filter(({p})=>
    !q||p.nombre.toLowerCase().includes(q)||(p.codigo||'').toLowerCase().includes(q)||(p.medida||'').toLowerCase().includes(q)
  );
  if(!res.length){list.innerHTML='<div class="ac-empty">Sin resultados</div>';list.classList.add('open');return;}
  list.innerHTML=res.slice(0,12).map(({p,i})=>\`<div class="ac-item" onmousedown="elegirProducto(this,\${i})">
    <strong>\${p.nombre}</strong>\${p.codigo?\` <span style="font-size:11px;color:var(--text2)">[\${p.codigo}]</span>\`:''}
    <div class="ac-sub">\${p.medida||''} — $\${fmt(p.precio)}</div>
  </div>\`).join('');
  list.classList.add('open');
}
function elegirProducto(el, idx){
  const p=db.productos[idx];
  const row=el.closest('.linea-item');
  const nombreCompleto=p.nombre+(p.medida?' – '+p.medida:'');
  row.querySelector('.prod-search').value=nombreCompleto;
  row.querySelector('.cod-linea').value=p.codigo||'';
  // Usar precio de lista del cliente si existe, si no el precio base
  const precio = listaClienteActual && listaClienteActual!=='General'
    ? getPrecioParaCliente(p.nombre, getPrecioGeneral(p))
    : getPrecioGeneral(p);
  const descuento = getDescuentoActual();
  const precioFinal = descuento > 0 ? Math.round(precio * (1 - descuento/100)) : precio;
  row.querySelector('.precio-linea').value=precioFinal>0?precioFinal.toFixed(2):'';
  row.querySelector('.prod-ac-list').classList.remove('open');
  row.dataset.prodIdx=idx;
  recalcLinea(row.querySelector('.cant-linea'));
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.ac-wrap')) document.querySelectorAll('.prod-ac-list').forEach(l=>l.classList.remove('open'));
});

function recalcLinea(el){
  const row=el.closest('.linea-item');
  const cant=parseFloat(row.querySelector('.cant-linea').value)||0;
  const precio=parseFloat(row.querySelector('.precio-linea').value)||0;
  row.querySelector('.imp-linea').value='$'+fmt(cant*precio);
  calcTotalPres();
}
function calcTotalPres(){
  let sub=0;
  document.querySelectorAll('#lineas-presupuesto .linea-item').forEach(row=>{
    sub+=(parseFloat(row.querySelector('.cant-linea').value)||0)*(parseFloat(row.querySelector('.precio-linea').value)||0);
  });
  const deuda=parseFloat(document.getElementById('pres-deuda').value)||0;
  document.getElementById('pres-subtotal').textContent='$'+fmt(sub);
  document.getElementById('pres-deuda-display').textContent='$'+fmt(deuda);
  document.getElementById('pres-total').textContent='$'+fmt(sub+deuda);
}
function guardarPresupuesto(){
  const lineas=[]; let subtotal=0;
  document.querySelectorAll('#lineas-presupuesto .linea-item').forEach(row=>{
    const cant=parseFloat(row.querySelector('.cant-linea').value)||0;
    const precio=parseFloat(row.querySelector('.precio-linea').value)||0;
    const cod=row.querySelector('.cod-linea').value.trim();
    const nombreRaw=row.querySelector('.prod-search').value.trim();
    // limpiar " – medida" del nombre si viene del autocomplete
    const nombre=nombreRaw.includes(' – ')?nombreRaw.split(' – ')[0]:nombreRaw;
    if(nombre&&cant>0){ const imp=cant*precio; lineas.push({cod,nombre,cant,precio,importe:imp}); subtotal+=imp; }
  });
  if(!lineas.length){alert('Agregá al menos un producto');return;}
  lineas.forEach(function(l){ var ip = prodDeLinea(l); if(ip >= 0 && db.productos[ip].id) l.pid = db.productos[ip].id; });
  const cliIdxVal=document.getElementById('pres-cliente-idx').value;
  const cliente=cliIdxVal!==''?db.clientes[parseInt(cliIdxVal)]:null;
  const deuda=parseFloat(document.getElementById('pres-deuda').value)||0;
  if(editPresIdx !== null){ guardarEdicionPresupuesto(lineas, subtotal, cliente, deuda); return; }
  const num=db.contador.presupuesto||1; db.contador.presupuesto=num+1;
  db.presupuestos.unshift({ numero:num, uid:'b'+Date.now().toString(36)+Math.random().toString(36).slice(2,8), fecha:document.getElementById('pres-fecha').value,
    validez:'', cliente:cliente?{...cliente}:null,
    obs:document.getElementById('pres-obs').value.trim(), lineas, subtotal, deuda, total:subtotal+deuda, estado:'Pendiente' });
  var rStock = descontarStockBoleta(db.presupuestos[0]);
  var rTr = traspasarDeudaAnterior(db.presupuestos[0]);
  registrarActividad('presupuesto',\`Creó boleta #\${num}\`,\`Cliente: \${cliente?.nombre||'Consumidor final'} | Total: $\${fmt(subtotal+deuda)}\`);
  guardar(); cerrarModales(); renderPresupuestos(); renderDashboard(); try{ renderDeudores(); renderAfavor(); renderEntrega(); }catch(e){} if(typeof renderProductos === 'function') renderProductos(); avisoStock(rStock);
  if(!rTr.hecho && rTr.cuantas && (deuda||0) > 0) alert('La deuda anterior de esta boleta ($' + fmt(deuda) + ') no coincide con lo que debía el cliente en las boletas anteriores ($' + fmt(rTr.suma) + '), así que no se unieron solas y esa deuda puede figurar dos veces. Si corresponde, unilas con el botón 🔗 en Pendiente de entrega o en Deudores.');
}
function registrarActividad(tipo, accion, detalle){
  if(!db.actividad) db.actividad=[];
  const ahora = new Date();
  db.actividad.unshift({
    fecha: ahora.toLocaleDateString('es-AR'),
    hora: ahora.toLocaleTimeString('es-AR', {hour:'2-digit',minute:'2-digit'}),
    usuario: (rolActual==='admin' && !esSocioLogin) ? 'Admin' : (nombreUsuarioActual||'Empleado'),
    tipo, accion, detalle
  });
  if(db.actividad.length > 500) db.actividad = db.actividad.slice(0, 500);
}

// ---- GESTIÓN DE EMPLEADOS ----
function puedeGestionarEmpleado(emp){ return nivelDe(emp) !== 'socio' || esAdminReal(); }
async function agregarEmpleado(){
  const nombre = document.getElementById('emp-nuevo-nombre').value.trim();
  if(!nombre){ alert('Ingresá el nombre'); return; }
  if(!db.empleados) db.empleados=[];
  const pass = document.getElementById('emp-nuevo-pass').value.trim();
  var selN = document.getElementById('emp-nuevo-nivel');
  var nivel = selN ? selN.value : 'empleado';
  if(nivel === 'socio' && !esAdminReal()){ alert('Solo el administrador puede crear un socio.'); return; }
  db.empleados.push({ nombre, nivel, tienePass: !!pass });
  document.getElementById('emp-nuevo-nombre').value='';
  document.getElementById('emp-nuevo-pass').value='';
  await guardar();
  if(pass){ const rp = await apiPost('/api/auth/empleado', { nombre: nombre, pass: pass }); if(!rp.ok) alert((rp.j && rp.j.error) || 'No se pudo guardar la contraseña'); }
  renderListaEmpleados();
  renderLoginEmpleados();
}
async function eliminarEmpleado(idx){
  var e = db.empleados[idx];
  if(!e) return;
  if(!puedeGestionarEmpleado(e)){ alert('Solo el administrador puede eliminar a un socio.'); return; }
  if(!confirm('¿Eliminar este empleado?')) return;
  db.empleados.splice(idx,1);
  await guardar();
  renderListaEmpleados();
  renderLoginEmpleados();
}
async function editarEmpleado(idx){
  const e = db.empleados[idx];
  if(!puedeGestionarEmpleado(e)){ alert('Solo el administrador puede modificar a un socio.'); return; }
  const nombre = prompt('Nuevo nombre:', e.nombre);
  if(nombre===null) return;
  const pass = prompt('Nueva contraseña (vacío = no cambiarla; escribí QUITAR para dejarlo sin contraseña):', '');
  if(pass===null) return;
  const nuevoNombre = nombre.trim(), p2 = pass.trim();
  const rp = await apiPost('/api/auth/empleado', { nombre: nuevoNombre, anterior: e.nombre, pass: (p2 && p2 !== 'QUITAR') ? p2 : undefined, quitar: p2 === 'QUITAR' });
  if(!rp.ok){ alert((rp.j && rp.j.error) || 'No se pudo guardar'); return; }
  db.empleados[idx] = Object.assign({}, e, { nombre: nuevoNombre, tienePass: p2 === 'QUITAR' ? false : (p2 ? true : !!e.tienePass) });
  await guardar();
  renderListaEmpleados();
  renderLoginEmpleados();
}
async function cambiarNivelEmpleado(idx, nivel){
  var e = db.empleados[idx];
  if(!e) return;
  if((nivel === 'socio' || nivelDe(e) === 'socio') && !esAdminReal()){
    alert('Solo el administrador puede cambiar el nivel de un socio.');
    renderListaEmpleados();
    return;
  }
  e.nivel = nivel;
  await guardar();
  renderListaEmpleados();
}
function renderListaEmpleados(){
  if(!db.empleados) db.empleados=[];
  const cont = document.getElementById('lista-empleados');
  if(!cont) return;
  if(!db.empleados.length){
    cont.innerHTML='<div style="font-size:13px;color:var(--text3);margin-bottom:8px">Sin empleados. Agregá el primero.</div>';
    return;
  }
  var NIV = [['empleado','Empleado'],['caja','Empleado + Caja'],['socio','Socio (todo)']];
  cont.innerHTML = db.empleados.map(function(e, i){
    var puede = puedeGestionarEmpleado(e);
    var niv = nivelDe(e);
    var opts = NIV.map(function(n){ return '<option value="' + n[0] + '"' + (niv === n[0] ? ' selected' : '') + '>' + n[1] + '</option>'; }).join('');
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">' +
      '<span style="font-size:13px;font-weight:600;flex:1">👤 ' + e.nombre + '</span>' +
      '<select ' + (puede ? '' : 'disabled ') + 'onchange="cambiarNivelEmpleado(' + i + ', this.value)" style="font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--radius)">' + opts + '</select>' +
      '<span style="font-size:12px;color:var(--text3)">' + (e.tienePass ? 'Con contraseña' : 'Sin contraseña') + '</span>' +
      '<button class="btn btn-sm" ' + (puede ? '' : 'disabled ') + 'onclick="editarEmpleado(' + i + ')">✏️</button>' +
      '<button class="btn btn-sm btn-danger" ' + (puede ? '' : 'disabled ') + 'onclick="eliminarEmpleado(' + i + ')">🗑️</button>' +
      '</div>';
  }).join('');
}

function cambiarEstado(idx,val){
  const p=db.presupuestos[idx];
  const anterior=p.estado;
  p.estado=val;
  if(val==='Rechazado' && p.stock_aplicado) devolverStockBoleta(p);
  else if(anterior==='Rechazado' && val!=='Rechazado' && !p.stock_aplicado && (p.lineas||[]).length) avisoStock(descontarStockBoleta(p));
  registrarActividad('presupuesto',\`Cambio estado boleta #\${p.numero}\`,\`\${anterior} → \${val} | Cliente: \${p.cliente?.nombre||'Consumidor final'}\`);
  guardar();
}

function eliminarPresupuesto(idx){
  if(!confirm('¿Eliminar?'))return;
  const p=db.presupuestos[idx];
  registrarActividad('eliminacion',\`Eliminó boleta #\${p.numero}\`,\`Cliente: \${p.cliente?.nombre||'Consumidor final'} | Total: $\${fmt(p.total)}\`);
  if(p.stock_aplicado) devolverStockBoleta(p);
  db.presupuestos.splice(idx,1);
  guardar();renderPresupuestos();renderDashboard(); if(typeof renderProductos === 'function') renderProductos();
}
function limpiarFechasPres(){
  document.getElementById('pres-desde').value='';
  document.getElementById('pres-hasta').value='';
  renderPresupuestos();
}
let filtroPresupuesto='';
function fechaISO(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
var resumenOficinaDatos=null;
// fecha con la que una boleta entra en un resumen: la de impresion (cuando salio de la oficina); si no se imprimio, la de la boleta
function fechaParaResumen(p){
  return p.fecha || ''; // fecha de la boleta (= fecha de entrega)
}
function normNombre(n){ return String(n||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/\\s+/g,' ').trim(); }
function calcularResumenOficina(lista){
  var desde=document.getElementById('res-desde').value, hasta=document.getElementById('res-hasta').value;
  var cod0=({Gloria:'G',Luis:'L',Edgardo:'E'})[lista]||'G';
  var g={lista:lista,filas:[],total:0,boletas:0};
  var porNombre={};
  db.clientes.forEach(function(c){
    var cod=(c.codigo||'').toUpperCase();
    if(cod!==cod0) return; // solo entran los clientes con el codigo del grupo (G, L o E); sin codigo no entra
    var fila={nombre:c.nombre,incluir:!c.fuera_resumen,boletas:0,total:0,pago:0,apagar:0,debe:0,favor:0};
    g.filas.push(fila); porNombre[c.nombre]=fila;
  });
  db.presupuestos.forEach(function(p){
    if(!p.cliente||p.estado==='Rechazado'||p.estado==='Vencido') return;
    var fp=fechaParaResumen(p);
    if(hasta&&fp&&fp>hasta) return; // boletas posteriores a la fecha Hasta no cuentan en nada
    var fc=porNombre[p.cliente.nombre];
    if(!fc){ var nn=normNombre(p.cliente.nombre); Object.keys(porNombre).some(function(k){ if(normNombre(k)===nn){ fc=porNombre[k]; return true; } return false; }); }
    if(!fc && String(p.cliente.codigo||'').toUpperCase()===cod0 && p.cliente.nombre){
      // boleta de un cliente que ya no esta en la lista con ese nombre (renombrado o borrado): igual cuenta en el grupo
      fc={nombre:p.cliente.nombre,incluir:true,huerfano:true,boletas:0,total:0,pago:0,apagar:0,debe:0,favor:0};
      g.filas.push(fc); porNombre[p.cliente.nombre]=fc;
    }
    if(fc){ var sd=saldoPendienteBoleta(p); if(sd>0.01&&p.estado==='Pendiente') fc.debe+=sd; else if(sd<-0.01) fc.favor+=-sd; }
    if(desde&&(!fp||fp<desde)) return;
    if(hasta&&(!fp||fp>hasta)) return;
    var fila=fc; if(!fila) return;
    var consumo=p.total||0; // total de la boleta: incluye la deuda anterior o el saldo a favor que traía
    fila.boletas++; fila.total+=consumo;
    var pagoReal=(p.pagos||[]).reduce(function(a,x){ return a+(x.traspaso?0:(x.monto||0)); },0);
    fila.pago+=pagoReal; fila.apagar+=Math.max(0,consumo-pagoReal);
  });
  g.filas=g.filas.filter(function(x){ return !x.huerfano || x.boletas>0 || Math.abs(x.debe)>0.01 || Math.abs(x.favor)>0.01; });
  g.filas.sort(function(a,b){ return a.nombre.localeCompare(b.nombre,'es'); });
  g.filas.forEach(function(x){ x.neto=x.debe-x.favor; });
  var r={desde:desde,hasta:hasta,lista:lista,filas:g.filas};
  recalcResumen(r);
  return r;
}
function recalcResumen(r){
  var tDebe=0,tFavor=0,tPago=0,tApagar=0,tTotal=0,tBol=0,n=0;
  r.filas.forEach(function(x){
    if(!x.incluir) return;
    n++; tPago+=x.pago; tApagar+=x.apagar; tTotal+=x.total; tBol+=x.boletas;
    if(x.neto>0) tDebe+=x.neto; else if(x.neto<0) tFavor+=-x.neto;
  });
  r.total=tTotal; r.boletas=tBol; r.debe=tDebe; r.favor=tFavor; r.pago=tPago; r.apagar=tApagar; r.nIncluidos=n;
}
function resumenIncluir(i,chk){
  var r=resumenOficinaDatos; if(!r||!r.filas[i]) return;
  r.filas[i].incluir=!!chk;
  recalcResumen(r); dibujarResumenOficina();
}
function cuentaTexto(neto,conSigno){
  if(neto>0.01) return 'Debe $'+fmt(neto);
  if(neto<-0.01) return 'A favor $'+fmt(-neto);
  return 'Al día';
}
function fmtFechaAR(iso){ return iso?new Date(iso+'T12:00:00').toLocaleDateString('es-AR'):''; }
function abrirResumenOficina(lista){
  if(!lista) return;
  if(rolActual!=='admin'){ alert('Solo el administrador puede ver este resumen.'); return; }
  if(!document.getElementById('res-desde').value||!document.getElementById('res-hasta').value){ alert('Elegí las fechas Desde y Hasta para armar el resumen.'); return; }
  var r=calcularResumenOficina(lista); resumenOficinaDatos=r;
  dibujarResumenOficina();
  document.getElementById('modal-resumen').classList.add('open');
}
function dibujarResumenOficina(){
  var r=resumenOficinaDatos; if(!r) return; var lista=r.lista;
  document.getElementById('resumen-titulo').textContent='Resumen de consumo — '+lista;
  document.getElementById('resumen-periodo').textContent='Período: '+fmtFechaAR(r.desde)+' al '+fmtFechaAR(r.hasta)+' · Total de cada boleta (con la deuda anterior o saldo a favor), por fecha de la boleta';
  var h='';
  r.filas.forEach(function(x,i){
    h+='<tr'+(x.incluir?'':' style="opacity:.4"')+'><td><input type="checkbox" '+(x.incluir?'checked ':'')+'onchange="resumenIncluir('+i+',this.checked)" title="Incluir en el resumen"></td><td>'+x.nombre+(x.huerfano?'<div style="font-size:11px;color:var(--amber)">nombre de la boleta: no está en Clientes con este nombre</div>':'')+'</td><td style="text-align:right">'+x.boletas+'</td><td style="text-align:right">$'+fmt(x.total)+'</td><td style="text-align:right">$'+fmt(x.pago)+'</td><td style="text-align:right;font-weight:700">$'+fmt(x.apagar)+'</td><td style="text-align:right;font-weight:600;color:'+(x.neto>0.01?'var(--red)':(x.neto<-0.01?'var(--green)':'var(--text3)'))+'">'+cuentaTexto(x.neto)+'</td></tr>';
  });
  h+='<tr style="background:var(--bg);font-weight:700;font-size:15px"><td></td><td>TOTAL '+lista.toUpperCase()+' ('+r.nIncluidos+' clientes)</td><td style="text-align:right">'+r.boletas+'</td><td style="text-align:right">$'+fmt(r.total)+'</td><td style="text-align:right">$'+fmt(r.pago)+'</td><td style="text-align:right">$'+fmt(r.apagar)+'</td><td style="text-align:right;font-size:12px">Debe $'+fmt(r.debe)+'<br>A favor $'+fmt(r.favor)+'</td></tr>';
  document.getElementById('resumen-tabla').innerHTML=h;
  poblarDetProv();
}
function xlsxBytes(s){
  s = unescape(encodeURIComponent(String(s)));
  var a = new Uint8Array(s.length);
  for(var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}
var xlsxCrcTabla = null;
function xlsxCrc(b){
  if(!xlsxCrcTabla){
    xlsxCrcTabla = [];
    for(var n = 0; n < 256; n++){
      var c = n;
      for(var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      xlsxCrcTabla[n] = c >>> 0;
    }
  }
  var crc = 0xFFFFFFFF;
  for(var i = 0; i < b.length; i++) crc = xlsxCrcTabla[(crc ^ b[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
// zip sin compresion (alcanza para un xlsx chico)
function xlsxZip(archivos){
  var partes = [], central = [], offset = 0;
  archivos.forEach(function(f){
    var nom = xlsxBytes(f.nombre), dat = xlsxBytes(f.datos), crc = xlsxCrc(dat);
    var h = new Uint8Array(30 + nom.length), v = new DataView(h.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true); v.setUint16(8, 0, true);
    v.setUint16(10, 0, true); v.setUint16(12, 33, true); v.setUint32(14, crc, true); v.setUint32(18, dat.length, true);
    v.setUint32(22, dat.length, true); v.setUint16(26, nom.length, true); v.setUint16(28, 0, true);
    h.set(nom, 30);
    var c = new Uint8Array(46 + nom.length), w = new DataView(c.buffer);
    w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true); w.setUint16(8, 0x0800, true);
    w.setUint16(10, 0, true); w.setUint16(12, 0, true); w.setUint16(14, 33, true); w.setUint32(16, crc, true);
    w.setUint32(20, dat.length, true); w.setUint32(24, dat.length, true); w.setUint16(28, nom.length, true);
    w.setUint16(30, 0, true); w.setUint16(32, 0, true); w.setUint16(34, 0, true); w.setUint16(36, 0, true);
    w.setUint32(38, 0, true); w.setUint32(42, offset, true);
    c.set(nom, 46);
    partes.push(h, dat); central.push(c);
    offset += h.length + dat.length;
  });
  var tamC = 0; central.forEach(function(c){ tamC += c.length; });
  var fin = new Uint8Array(22), e = new DataView(fin.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(4, 0, true); e.setUint16(6, 0, true);
  e.setUint16(8, archivos.length, true); e.setUint16(10, archivos.length, true);
  e.setUint32(12, tamC, true); e.setUint32(16, offset, true); e.setUint16(20, 0, true);
  var todo = partes.concat(central, [fin]), tot = 0;
  todo.forEach(function(p){ tot += p.length; });
  var out = new Uint8Array(tot), pos = 0;
  todo.forEach(function(p){ out.set(p, pos); pos += p.length; });
  return out;
}
// Excel (.xlsx) del resumen: rojo = debe, verde = a favor, sin color = al dia
function xlsxResumen(r){
  var Q = String.fromCharCode(34);
  var L = ['A','B','C','D','E','F','G'];
  var rows = [], merges = [];
  function t(col, fila, txt, st){ return '<c r="' + L[col] + fila + '" s="' + st + '" t="inlineStr"><is><t>' + ctbEsc(txt) + '</t></is></c>'; }
  function n(col, fila, num, st){ return '<c r="' + L[col] + fila + '" s="' + st + '"><v>' + (Math.round(num * 100) / 100) + '</v></c>'; }
  function fila(num, celdas, alto){ rows.push('<row r="' + num + '"' + (alto ? ' ht="' + alto + '" customHeight="1"' : '') + '>' + celdas.join('') + '</row>'); }
  fila(1, [t(0, 1, 'Resumen de consumo ' + r.lista, 1)], 24); merges.push('A1:G1');
  fila(2, [t(0, 2, 'Del ' + fmtFechaAR(r.desde) + ' al ' + fmtFechaAR(r.hasta) + ' · Total de cada boleta (con la deuda anterior o saldo a favor), por fecha de la boleta', 2)]); merges.push('A2:G2');
  var enc = ['Cliente','Boletas','Consumo','Pagó','A pagar (período)','Cuenta','Importe cuenta'];
  fila(4, enc.map(function(x, i){ return t(i, 4, x, 3); }), 22);
  var f = 5;
  r.filas.forEach(function(x){
    if(!x.incluir) return;
    var base = x.neto > 0.01 ? 7 : (x.neto < -0.01 ? 10 : 4);
    var txt = x.neto > 0.01 ? 'Debe' : (x.neto < -0.01 ? 'A favor' : 'Al día');
    fila(f, [t(0, f, x.nombre, base), n(1, f, x.boletas, base + 1), n(2, f, x.total, base + 2), n(3, f, x.pago, base + 2), n(4, f, x.apagar, base + 2), t(5, f, txt, base), n(6, f, Math.abs(x.neto), base + 2)]);
    f++;
  });
  fila(f, [t(0, f, 'TOTAL ' + r.lista.toUpperCase(), 13), n(1, f, r.boletas, 14), n(2, f, r.total, 15), n(3, f, r.pago, 15), n(4, f, r.apagar, 15), t(5, f, 'Debe', 13), n(6, f, r.debe, 15)], 20); f++;
  fila(f, [t(0, f, 'TOTAL A FAVOR', 13), t(1, f, '', 13), t(2, f, '', 13), t(3, f, '', 13), t(4, f, '', 13), t(5, f, 'A favor', 13), n(6, f, r.favor, 15)], 20); f += 2;
  fila(f, [t(0, f, 'Rojo = debe · Verde = a favor · Sin color = al día', 2)]); merges.push('A' + f + ':G' + f);
  var anchos = [34, 10, 16, 16, 20, 12, 16];
  var cols = '<cols>' + anchos.map(function(a, i){ return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + a + '" customWidth="1"/>'; }).join('') + '</cols>';
  var hoja = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews>' + cols + '<sheetData>' + rows.join('') + '</sheetData><mergeCells count="' + merges.length + '">' + merges.map(function(m){ return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells><pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';
  var bd = '<border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border>';
  function xf(font, fill, border, fmt, centro){
    return '<xf numFmtId="' + fmt + '" fontId="' + font + '" fillId="' + fill + '" borderId="' + border + '" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"' + (centro ? ' applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' : '/>');
  }
  var estilos = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="1"><numFmt numFmtId="164" formatCode="' + '&quot;$&quot;#,##0.00' + '"/></numFmts>' +
    '<fonts count="6"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font><font><sz val="11"/><color rgb="FF9C0006"/><name val="Calibri"/></font><font><sz val="11"/><color rgb="FF006100"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>' +
    '<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F3864"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC7CE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC6EFCE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC7CE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC6EFCE"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' + bd + '</borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="16">' + [xf(0,0,0,0), xf(2,0,0,0), xf(0,0,0,0), xf(5,2,1,0,true), xf(0,0,1,0), xf(0,0,1,1), xf(0,0,1,164), xf(3,3,1,0), xf(3,3,1,1), xf(3,3,1,164), xf(4,4,1,0), xf(4,4,1,1), xf(4,4,1,164), xf(1,5,1,0), xf(1,5,1,1), xf(1,5,1,164)].join('') + '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  var X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return xlsxZip([
    { nombre: '[Content_Types].xml', datos: X + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
    { nombre: '_rels/.rels', datos: X + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { nombre: 'xl/workbook.xml', datos: X + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + ctbEsc(r.lista) + '" sheetId="1" r:id="rId1"/></sheets></workbook>' },
    { nombre: 'xl/_rels/workbook.xml.rels', datos: X + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
    { nombre: 'xl/styles.xml', datos: estilos },
    { nombre: 'xl/worksheets/sheet1.xml', datos: hoja }
  ]);
}
// PDF para mandar a la oficina: abre la impresion con el cuadro y se elige "Guardar como PDF"
function imprimirResumenOficina(){
  if(rolActual!=='admin') return;
  var r=resumenOficinaDatos; if(!r) return;
  var cel='border:1px solid #bbb;padding:5px 8px;';
  var h='<div style="font-family:Arial,sans-serif;color:#000">' +
    '<div style="font-size:20px;font-weight:700">Resumen de consumo ' + ctbEsc(r.lista) + '</div>' +
    '<div style="font-size:12px;margin:2px 0 12px">Del ' + fmtFechaAR(r.desde) + ' al ' + fmtFechaAR(r.hasta) + ' · Total de cada boleta (con la deuda anterior o saldo a favor), por fecha de la boleta</div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:#1F3864;color:#fff">' +
    ['Cliente','Boletas','Consumo','Pagó','A pagar (período)','Cuenta','Importe cuenta'].map(function(x, i){ return '<th style="' + cel + 'background:#1F3864;color:#fff;text-transform:none;font-size:12px;text-align:' + (i === 0 ? 'left' : 'center') + '">' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
  r.filas.forEach(function(x){
    if(!x.incluir) return;
    var est = x.neto > 0.01 ? 'background:#FFC7CE;color:#9C0006;' : (x.neto < -0.01 ? 'background:#C6EFCE;color:#006100;' : '');
    var txt = x.neto > 0.01 ? 'Debe' : (x.neto < -0.01 ? 'A favor' : 'Al día');
    h += '<tr style="' + est + '"><td style="' + cel + '">' + ctbEsc(x.nombre) + '</td><td style="' + cel + 'text-align:right">' + x.boletas + '</td><td style="' + cel + 'text-align:right">$' + fmt(x.total) + '</td><td style="' + cel + 'text-align:right">$' + fmt(x.pago) + '</td><td style="' + cel + 'text-align:right">$' + fmt(x.apagar) + '</td><td style="' + cel + '">' + txt + '</td><td style="' + cel + 'text-align:right">$' + fmt(Math.abs(x.neto)) + '</td></tr>';
  });
  var tot = 'background:#D9D9D9;font-weight:700;';
  h += '<tr style="' + tot + '"><td style="' + cel + '">TOTAL ' + ctbEsc(r.lista.toUpperCase()) + '</td><td style="' + cel + 'text-align:right">' + r.boletas + '</td><td style="' + cel + 'text-align:right">$' + fmt(r.total) + '</td><td style="' + cel + 'text-align:right">$' + fmt(r.pago) + '</td><td style="' + cel + 'text-align:right">$' + fmt(r.apagar) + '</td><td style="' + cel + '">Debe</td><td style="' + cel + 'text-align:right">$' + fmt(r.debe) + '</td></tr>' +
    '<tr style="' + tot + '"><td style="' + cel + '">TOTAL A FAVOR</td><td style="' + cel + '"></td><td style="' + cel + '"></td><td style="' + cel + '"></td><td style="' + cel + '"></td><td style="' + cel + '">A favor</td><td style="' + cel + 'text-align:right">$' + fmt(r.favor) + '</td></tr>' +
    '</tbody></table><div style="font-size:11px;margin-top:10px;color:#444">Rojo = debe · Verde = a favor · Sin color = al día</div></div>';
  var st = document.createElement('style');
  st.id = 'estilo-impresion-resumen';
  st.textContent = '@media print{@page{size:A4 landscape;margin:10mm}.modal-backdrop{display:none!important}}';
  document.head.appendChild(st);
  document.getElementById('print-area').innerHTML = h;
  var limpiar = function(){
    if(st.parentNode) st.parentNode.removeChild(st);
    document.getElementById('print-area').innerHTML = '';
    window.removeEventListener('afterprint', limpiar);
  };
  window.addEventListener('afterprint', limpiar);
  window.print();
}
// ===== Detalle de cada boleta (formato: Fecha, Sucursal, N de remito, Cantidad, Producto, Precio, Importe) =====
function xlsxPaquete(hoja, estilos, nombreHoja){
  var X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return xlsxZip([
    { nombre: '[Content_Types].xml', datos: X + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
    { nombre: '_rels/.rels', datos: X + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { nombre: 'xl/workbook.xml', datos: X + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + ctbEsc(nombreHoja) + '" sheetId="1" r:id="rId1"/></sheets></workbook>' },
    { nombre: 'xl/_rels/workbook.xml.rels', datos: X + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
    { nombre: 'xl/styles.xml', datos: estilos },
    { nombre: 'xl/worksheets/sheet1.xml', datos: hoja }
  ]);
}
function detalleBoletasDatos(r, provFiltro){
  var nombres = {}; r.filas.forEach(function(x){ if(x.incluir) nombres[normNombre(x.nombre)] = 1; });
  var pf = normNombre(provFiltro || '');
  var boletas = [];
  db.presupuestos.forEach(function(p){
    if(!p.cliente || p.estado === 'Rechazado' || p.estado === 'Vencido') return;
    if(!nombres[normNombre(p.cliente.nombre)]) return;
    var f = fechaParaResumen(p);
    if(!f || (r.desde && f < r.desde) || (r.hasta && f > r.hasta)) return;
    var lineas = (p.lineas || []).filter(function(l){
      if(!pf) return true;
      var prod = buscarProdDeLinea(l);
      return !!(prod && normNombre(prod.proveedor) === pf);
    });
    if(!lineas.length) return;
    boletas.push({ p: p, f: f, lineas: lineas });
  });
  boletas.sort(function(a, b){ return a.f.localeCompare(b.f) || (a.p.numero - b.p.numero); });
  return boletas;
}
function xlsxDetalle(r, provFiltro){
  var boletas = detalleBoletasDatos(r, provFiltro);
  var L = ['A','B','C','D','E','F','G','H','I','J','K'], rows = [], merges = [];
  function t(col, fila, txt, st){ return '<c r="' + L[col] + fila + '" s="' + st + '" t="inlineStr"><is><t>' + ctbEsc(txt) + '</t></is></c>'; }
  function n(col, fila, num, st){ return '<c r="' + L[col] + fila + '" s="' + st + '"><v>' + (Math.round(num * 100) / 100) + '</v></c>'; }
  function fila(num, celdas, alto){ rows.push('<row r="' + num + '"' + (alto ? ' ht="' + alto + '" customHeight="1"' : '') + '>' + celdas.join('') + '</row>'); }
  function vacias(desde, hasta, fila, st){ var o = []; for(var c = desde; c <= hasta; c++) o.push(t(c, fila, '', st)); return o; }
  fila(1, [t(0, 1, 'DETALLE DE BOLETAS ' + r.lista.toUpperCase() + (provFiltro ? ' - ' + provFiltro.toUpperCase() : ''), 1)], 24); merges.push('A1:K1');
  fila(2, [t(0, 2, 'Del ' + fmtFechaAR(r.desde) + ' al ' + fmtFechaAR(r.hasta) + ' · Pagó, Estado y Saldo son de la boleta completa', 8)]); merges.push('A2:K2');
  fila(4, ['Fecha','Sucursal','Nº de Remito','Cantidad','Producto','Precio','Importe','Pagó','Fecha de pago','Estado','Saldo'].map(function(x, i){ return t(i, 4, x, 2); }), 22);
  var f = 5, totalGral = 0;
  boletas.forEach(function(b){
    var tot = 0;
    b.lineas.forEach(function(l, i){
      var cant = l.cant || 0, precio = l.precio || 0, imp = cant * precio; tot += imp;
      fila(f, [i === 0 ? t(0, f, fmtFechaAR(b.f), 3) : t(0, f, '', 3), i === 0 ? t(1, f, b.p.cliente.nombre, 3) : t(1, f, '', 3), i === 0 ? n(2, f, b.p.numero, 4) : t(2, f, '', 3), n(3, f, cant, 4), t(4, f, l.nombre || '', 3), n(5, f, precio, 5), n(6, f, imp, 5)]);
      f++;
    });
    totalGral += tot;
    var pagosReales = (b.p.pagos || []).filter(function(g){ return !g.traspaso; });
    var pagado = pagosReales.reduce(function(a, g){ return a + (g.monto || 0); }, 0);
    var fechasPago = []; pagosReales.forEach(function(g){ var fg = String(g.fecha || ''); if(fg && fechasPago.indexOf(fg) < 0) fechasPago.push(fg); });
    var sal = Math.round(saldoPendienteBoleta(b.p) * 100) / 100;
    var est = sal > 0.01 ? 'Debe' : (sal < -0.01 ? 'A favor' : (pagado > 0 ? 'Pagada' : 'Al día'));
    var sT = sal > 0.01 ? 9 : (sal < -0.01 ? 11 : 6), sN = sal > 0.01 ? 10 : (sal < -0.01 ? 12 : 7);
    fila(f, [t(0, f, '', 6), t(1, f, 'Total boleta ' + b.p.numero, 6), t(2, f, '', 6), t(3, f, '', 6), t(4, f, '', 6), t(5, f, '', 6), n(6, f, tot, 7), n(7, f, pagado, 7), t(8, f, fechasPago.join(' - '), 6), t(9, f, est, sT), n(10, f, Math.abs(sal), sN)]);
    f++;
  });
  if(!boletas.length){ fila(f, [t(0, f, 'No hay boletas en este período' + (provFiltro ? ' con productos de ' + provFiltro : ''), 8)]); f++; }
  else { f++; fila(f, [t(0, f, 'TOTAL', 6), t(1, f, boletas.length + ' boletas', 6), t(2, f, '', 6), t(3, f, '', 6), t(4, f, '', 6), t(5, f, '', 6), n(6, f, totalGral, 7)].concat(vacias(7, 9, f, 6), [t(10, f, '', 6)]), 20); f++; }
  var sinCompra = r.filas.filter(function(x){ return x.incluir && x.boletas === 0 && x.neto > 0.01; });
    if(sinCompra.length){
    f++;
    fila(f, [t(0, f, 'Clientes que no compraron en el período pero deben', 3)]); merges.push('A' + f + ':K' + f); f++;
    sinCompra.forEach(function(x){
      fila(f, [t(0, f, '', 9), t(1, f, x.nombre, 9)].concat(vacias(2, 8, f, 9), [t(9, f, 'Debe', 9), n(10, f, x.neto, 10)]));
      f++;
    });
  }
  var anchos = [12, 34, 14, 10, 42, 14, 16, 16, 16, 10, 16];
  var cols = '<cols>' + anchos.map(function(a, i){ return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + a + '" customWidth="1"/>'; }).join('') + '</cols>';
  var hoja = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews>' + cols + '<sheetData>' + rows.join('') + '</sheetData><mergeCells count="' + merges.length + '">' + merges.map(function(m){ return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';
  var bd = '<border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border>';
  function xf(font, fill, border, fmtId, centro){
    return '<xf numFmtId="' + fmtId + '" fontId="' + font + '" fillId="' + fill + '" borderId="' + border + '" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"' + (centro ? ' applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' : '/>');
  }
  var estilos = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/></numFmts>' +
    '<fonts count="6"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="16"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF9C0006"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF006100"/><name val="Calibri"/></font></fonts>' +
    '<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F4E79"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' + bd + '</borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="13">' + [xf(0,0,0,0), xf(1,0,0,0), xf(2,2,1,0,true), xf(0,0,1,0), xf(0,0,1,1), xf(0,0,1,164), xf(3,3,1,0), xf(3,3,1,164), xf(0,0,0,0), xf(4,4,1,0), xf(4,4,1,164), xf(5,5,1,0), xf(5,5,1,164)].join('') + '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  return xlsxPaquete(hoja, estilos, 'Detalle ' + r.lista);
}
function descargarDetalleBoletas(){
  if(rolActual !== 'admin') return;
  var r = resumenOficinaDatos; if(!r) return;
  var sel = document.getElementById('det-prov'); var prov = sel ? sel.value : '';
  var blob = new Blob([xlsxDetalle(r, prov)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'detalle-boletas-' + r.lista.toLowerCase() + (prov ? '-' + normNombre(prov).replace(/ /g, '-') : '') + '-' + r.desde + '-a-' + r.hasta + '.xlsx';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
}
function poblarDetProv(){
  var sel = document.getElementById('det-prov'); if(!sel) return;
  var v = sel.value;
  sel.innerHTML = '<option value="">Todos los productos</option>' + (db.proveedores || []).map(function(p){ return '<option value="' + ctbEsc(p.nombre) + '">Solo ' + ctbEsc(p.nombre) + '</option>'; }).join('');
  sel.value = v;
}
function descargarResumenOficina(){
  if(rolActual!=='admin') return;
  var r=resumenOficinaDatos; if(!r) return;
  var blob=new Blob([xlsxResumen(r)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='consumo-'+r.lista.toLowerCase()+'-'+r.desde+'-a-'+r.hasta+'.xlsx';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(a.href); },1000);
}
function setFiltroPres(cod,el){
  filtroPresupuesto=cod;
  document.querySelectorAll('#presupuestos .filtro-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active'); renderPresupuestos();
}
function normBusq(s){
  s = String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/([0-9]) *[x×] *([0-9])/g, '$1x$2');
  return s.split(' ').filter(function(w){ return w; }).map(function(w){ return (w.length > 3 && w.charAt(w.length - 1) === 's' && w.charAt(w.length - 2) !== 's') ? w.slice(0, -1) : w; }).join(' ');
}
function renderPresupuestos(){
  renderFiltrosListas();
  const colores={'G':'#185FA5','L':'#3B6D11','E':'#854F0B','S':'#7B3FB0','C':'#A32D2D'};
  const desde=document.getElementById('pres-desde')?.value;
  const hasta=document.getElementById('pres-hasta')?.value;
  const lista=db.presupuestos.filter(p=>{
    const cod=(p.cliente?.codigo||'').toUpperCase();
    var qEl=document.getElementById('pres-buscar');
    var verCob=document.getElementById('pres-ver-cobradas');
    var hayBusqueda=!!(qEl&&qEl.value.trim());
    if(!hayBusqueda){ // al buscar por nombre o numero se ignoran el filtro de grupo y las fechas, para que nada quede escondido
    if(filtroPresupuesto.indexOf('LISTA:')===0){ if(!clienteEnLista(p.cliente,filtroPresupuesto.slice(6))) return false; }
    else if(filtroPresupuesto!==''&&filtroPresupuesto!=='SIN'&&cod!==filtroPresupuesto) return false;
    if(filtroPresupuesto==='SIN'&&cod) return false;
    if(desde&&p.fecha&&p.fecha<desde) return false;
    if(hasta&&p.fecha&&p.fecha>hasta) return false;
    }
    if((p.estado==='Aprobado'||p.impreso)&&!hayBusqueda&&!(verCob&&verCob.checked)) return false;
    var q=qEl?normBusq(qEl.value):'';
    if(q){
      var txt=normBusq(((p.cliente?p.cliente.nombre:'Consumidor final')+' '+p.numero+' '+(p.cliente&&p.cliente.codigo?p.cliente.codigo:'')+' '+(p.lineas||[]).map(function(l){return l.nombre;}).join(' ')));
      if(!q.split(' ').every(function(w){ return txt.indexOf(w)>-1; })) return false;
    }
    return true;
  });
  var nCob=db.presupuestos.filter(function(p){ return p.estado==='Aprobado'||p.impreso; }).length;
  var verC=document.getElementById('pres-ver-cobradas');
  document.getElementById('pres-count').textContent=lista.length+' presupuesto'+(lista.length!==1?'s':'')+((verC&&verC.checked)||!nCob?'':' · '+nCob+' cobrada'+(nCob!==1?'s':'')+' o enviada'+(nCob!==1?'s':'')+' a entrega/deudores (ocultas, se ven con la casilla o buscando)');
  const t=document.getElementById('tabla-presupuestos');
  if(!lista.length){t.innerHTML='<tr class="empty-row"><td colspan="7">Sin presupuestos en este filtro</td></tr>';return;}
  t.innerHTML=lista.map(p=>{
    const i=db.presupuestos.indexOf(p);
    const cod=(p.cliente?.codigo||'').toUpperCase();
    const col=colores[cod]||'var(--text3)';
    const codBadge=cod?\`<span style="background:\${col};color:#fff;padding:1px 7px;border-radius:100px;font-size:11px;font-weight:700;margin-left:6px">\${cod}</span>\`:'';
    return\`<tr>
      <td><strong>\${p.numero}</strong></td>
      <td style="font-size:12px">\${p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):''}</td>
      <td>\${p.cliente?p.cliente.nombre:'Consumidor final'}\${codBadge}</td>
      <td style="font-size:12px;color:var(--text2)">$\${fmt(p.deuda)}</td>
      <td><strong>$\${fmt(p.total)}</strong></td>
      <td>\${p.estado==='Aprobado'?'<span class="badge badge-ok">Cobrada</span>':'<span class="badge badge-low">Pendiente</span>'}</td>
      <td style="white-space:nowrap">
        \${(rolActual==='admin'&&(p.pagos||[]).length)?'<button class="btn btn-sm" onclick="abrirModalPago('+i+')" title="Ver los pagos de la boleta y cancelar uno">💳 Pagos</button> ':''}
        <button class="btn btn-sm" onclick="editarPresupuesto(\${i})">✏️ Editar</button>
        <button class="btn btn-sm btn-green" onclick="imprimirPresupuesto(\${i})">🖨️ Imprimir</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarPresupuesto(\${i})">🗑️</button>
      </td>
    </tr>\`;
  }).join('');
}

// ---- IMPRESIÓN ----
function ajustarTextoImpresion(){
  var pa = document.getElementById('print-area');
  var prev = pa.getAttribute('style');
  pa.style.cssText = 'display:block;position:absolute;left:-10000px;top:0;width:216mm;visibility:hidden';
  var celdas = pa.querySelectorAll('.ph-table td');
  for(var i = 0; i < celdas.length; i++){
    var td = celdas[i];
    var fs = parseFloat(getComputedStyle(td).fontSize);
    while(td.scrollWidth > td.clientWidth + 0.5 && fs > 8){
      fs -= 0.5;
      td.style.fontSize = fs + 'px';
    }
  }
  if(prev === null) pa.removeAttribute('style'); else pa.setAttribute('style', prev);
}

function imprimirPresupuesto(idx){
  const p=db.presupuestos[idx], cfg=db.config;
  if(!p.impreso){
    p.impreso=true; p.fecha_impresion=new Date().toISOString();
    try{ guardar(); }catch(e){}
    try{ renderEntrega(); renderPresupuestos(); }catch(e){}
  }
  const empresa=cfg.nombre||'Distribuidora HAP';
  const numStr=String(p.numero).padStart(6,'0');
  const fechaFmt=p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):'';
  const filasTotales = 15;
  const paginas = Math.max(1, Math.ceil((p.lineas||[]).length / filasTotales));
  const cliente=p.cliente;

  function filasTabla(pag){
    let rows='';
    for(let i=0;i<filasTotales;i++){
      const l=p.lineas[pag*filasTotales+i];
      if(l){
        rows+=\`<tr>
          <td>\${l.nombre}\${l.medida?' ('+l.medida+')':''}</td>
          <td class="center">\${l.cant}</td>
          <td class="right">$\${fmt(l.precio)}</td>
          <td class="right">$\${fmt(l.importe)}</td>
        </tr>\`;
      } else {
        rows+=\`<tr class="empty"><td>&nbsp;</td><td></td><td class="right">$</td><td></td></tr>\`;
      }
    }
    return rows;
  }

  function bloque(esOriginal, pag){
    const esUltima = pag === paginas - 1;
    const marca = esOriginal ? 'X' : '';
    const copiaLabel = (esOriginal ? 'ORIGINAL' : 'DUPLICADO') + (paginas > 1 ? ' — HOJA ' + (pag + 1) + ' DE ' + paginas : '');
    const deudaRow = (esUltima && p.deuda&&p.deuda!=0) ? \`
      <div style="display:flex;justify-content:flex-end;font-size:14.5px;line-height:16px;margin-top:8px;margin-bottom:2px">
        <span style="font-weight:700;margin-right:8px">Deuda Anterior:</span>
        <span style="min-width:100px;text-align:right;border-bottom:1px solid #aaa">$ \${fmt(p.deuda)}</span>
      </div>\` : '';
    return \`<div class="presup-col\${deudaRow ? ' con-deuda' : ''}">
      <div class="ph-copia-label">\${copiaLabel}</div>
      <div class="ph-top">
        <div class="ph-logo-wrap">
          <div class="ph-empresa-nombre">DISTRIBUIDORA</div>
          <div class="ph-empresa-nombre" style="font-size:31px;line-height:27px">HAP</div>
          <div class="ph-empresa-sub">POLIETILENO</div>
          \${cfg.dir?\`<div class="ph-empresa-info">\${cfg.dir}\${cfg.tel?'<br>'+cfg.tel:''}</div>\`:''}
        </div>
        <div class="ph-orig-box">\${marca}</div>
        <div class="ph-titulo-wrap">
          <div class="ptitulo">Presupuesto</div>
          <div class="pnodoc">DOCUMENTO NO VÁLIDO COMO FACTURA</div>
          <div class="pnum">N°: \${numStr}:</div>
          <div class="pfecha">Fecha: <span class="ph-fecha-line">\${fechaFmt}</span></div>
        </div>
      </div>
      <div class="ph-cliente-row">
        <span class="clabel">CLIENTE:</span>
        <span class="cval">\${cliente?cliente.nombre:'Consumidor Final'}</span>
        \${cliente&&cliente.codigo?\`<span style="font-weight:700;color:#00008B;font-size:17px;line-height:19px">\${cliente.codigo}</span>\`:''}
      </div>
      <div class="ph-tabla-wrap"><table class="ph-table">
        <colgroup>
          <col style="width:41%">
          <col style="width:13%">
          <col style="width:22%">
          <col style="width:24%">
        </colgroup>
        <thead><tr>
          <th class="left">DESCRIPCIÓN</th>
          <th>CANT.</th>
          <th>PRECIO</th>
          <th>IMPORTE</th>
        </tr></thead>
        <tbody>\${filasTabla(pag)}</tbody>
      </table></div>
      \${deudaRow}
      <div class="ph-footer">
        <div></div>
        \${esUltima ? '<div class="ph-total-box"><span class="tlabel">TOTAL</span><span class="tflecha">▶</span><span class="tval">$ ' + fmt(p.total) + '</span></div>' : '<div class="ph-total-box"><span class="tlabel" style="font-size:13px">Continúa en la hoja siguiente</span><span class="tflecha">▶</span></div>'}
      </div>
      \${p.obs?\`<div style="font-size:11px;line-height:13px;color:#555;margin-top:4px;border-top:1px solid #ddd;padding-top:3px">\${p.obs}</div>\`:''}
    </div>\`;
  }

  let hojas = '';
  for(let pg = 0; pg < paginas; pg++){
    hojas += '<div class="presup-hoja"' + (pg < paginas - 1 ? ' style="page-break-after:always"' : '') + '>' + bloque(true, pg) + '<div class="divider-cut"></div>' + bloque(false, pg) + '</div>';
  }
  document.getElementById('print-area').innerHTML = hojas;
  ajustarTextoImpresion();
  window.print();
}

// ---- DASHBOARD ----
function renderDashboard(){
  renderRecordatorios(); revisarRecordatorios();
  document.getElementById('fecha-hoy').textContent=new Date().toLocaleDateString('es-AR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('s-pres').textContent=db.presupuestos.length;
  document.getElementById('s-prod').textContent=db.productos.length;
  document.getElementById('s-bajo').textContent=db.productos.filter(p=>p.stock<=p.minimo).length;
  document.getElementById('s-cli').textContent=db.clientes.length;
  const tp=document.getElementById('dash-pres');
  if(!db.presupuestos.length){tp.innerHTML='<tr class="empty-row"><td colspan="6">Sin presupuestos todavía</td></tr>';}
  else tp.innerHTML=db.presupuestos.slice(0,6).map((p,i)=>\`<tr>
    <td><strong>\${p.numero}</strong></td>
    <td style="font-size:12px">\${p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):''}</td>
    <td>\${p.cliente?p.cliente.nombre:'Consumidor final'}</td>
    <td><strong>$\${fmt(p.total)}</strong></td>
    <td><span class="badge \${p.estado==='Aprobado'?'badge-ok':p.estado==='Pendiente'?'badge-low':'badge-out'}">\${p.estado}</span></td>
    <td><button class="btn btn-sm btn-green" onclick="imprimirPresupuesto(\${i})">🖨️</button></td>
  </tr>\`).join('');
  const ta=document.getElementById('dash-alertas');
  const al=db.productos.filter(p=>p.stock<=p.minimo);
  if(!al.length){ta.innerHTML='<tr class="empty-row"><td colspan="4">✅ Todo el stock está bien</td></tr>';}
  else ta.innerHTML=al.map(p=>\`<tr><td><strong>\${p.nombre}</strong></td><td>\${p.stock} \${p.unidad}</td><td>\${p.minimo} \${p.unidad}</td><td>\${estadoBadge(p)}</td></tr>\`).join('');
}

// ---- CONFIG ----
function cargarConfig(){
  const c=db.config;
  document.getElementById('cfg-nombre').value=c.nombre||''; document.getElementById('cfg-cuit').value=c.cuit||'';
  document.getElementById('cfg-tel').value=c.tel||''; document.getElementById('cfg-email').value=c.email||'';
  document.getElementById('cfg-dir').value=c.dir||''; document.getElementById('cfg-iva').value=c.iva||'Responsable Inscripto';
  document.getElementById('cfg-pie').value=c.pie||''; document.getElementById('cfg-dias').value=c.dias||15;
  document.getElementById('cfg-filas').value=c.filas||12;
  document.getElementById('cfg-margen-general').value=c.margenGeneral||30;
  document.getElementById('cfg-contador').value=db.contador?.presupuesto||1;
  renderListaEmpleados();
}
function descargarBackup(){
  var blob = new Blob([JSON.stringify(db)], {type: 'application/json'});
  var a = document.createElement('a');
  var f = new Date();
  a.href = URL.createObjectURL(blob);
  a.download = 'hap-copia-' + f.getFullYear() + '-' + (f.getMonth() + 1) + '-' + f.getDate() + '-' + f.getHours() + f.getMinutes() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
}
function restaurarBackup(inp){
  var file = inp.files && inp.files[0];
  if(!file) return;
  var rd = new FileReader();
  rd.onload = function(){
    var data;
    try { data = JSON.parse(rd.result); } catch(e) { alert('El archivo no es una copia válida.'); return; }
    if(!data || !data.productos || !data.presupuestos){ alert('El archivo no parece una copia del sistema (faltan productos o boletas).'); return; }
    var NL = String.fromCharCode(10);
    if(!confirm('Esta copia tiene ' + data.productos.length + ' productos, ' + (data.clientes || []).length + ' clientes y ' + data.presupuestos.length + ' boletas.' + NL + NL + 'Va a REEMPLAZAR todo lo que hay ahora en el sistema (en todas las computadoras). ¿Seguro?')) return;
    db = data;
    servidorConectado = null;
    guardar().then(function(){
      inp.value = '';
      if(!ultimoGuardadoOk){ alert('No se pudo guardar en el servidor. No cierres esta página y probá de nuevo.'); return; }
      alert('Listo, copia restaurada. Se va a recargar la página.');
      location.reload();
    });
  };
  rd.readAsText(file);
}
async function guardarConfig(){
  const nuevaPass = esSocioLogin ? '' : document.getElementById('cfg-pass')?.value?.trim();
  db.config={ 
    nombre:document.getElementById('cfg-nombre').value.trim(), 
    cuit:document.getElementById('cfg-cuit').value.trim(),
    tel:document.getElementById('cfg-tel').value.trim(), 
    email:document.getElementById('cfg-email').value.trim(),
    dir:document.getElementById('cfg-dir').value.trim(), 
    iva:document.getElementById('cfg-iva').value,
    pie:document.getElementById('cfg-pie').value.trim(), 
    dias:parseInt(document.getElementById('cfg-dias').value)||15,
    filas:parseInt(document.getElementById('cfg-filas').value)||12,
    margenGeneral:parseInt(document.getElementById('cfg-margen-general').value)||30
  };
  if(nuevaPass){
    const rc = await apiPost('/api/auth/admin', { nueva: nuevaPass });
    if(!rc.ok) alert((rc.j && rc.j.error) || 'No se pudo cambiar la contraseña');
    else alert('Contraseña del administrador cambiada.');
  }
  if(!db.contador) db.contador={};
  db.contador.presupuesto = parseInt(document.getElementById('cfg-contador').value)||1;
  if(nuevaPass) document.getElementById('cfg-pass').value='';
  await guardar(); 
  const ok=document.getElementById('cfg-ok'); ok.style.display='inline'; setTimeout(()=>ok.style.display='none',2500);
}

// ---- DEUDA ANTERIOR TRASPASADA A LA BOLETA NUEVA ----
// Cuando una boleta nueva arrastra la "deuda anterior" del cliente, las boletas viejas
// quedan saldadas por traspaso para que la deuda no figure dos veces.
function candidatosTraspaso(nueva){
  if(!nueva || !nueva.cliente) return [];
  var mias = db.presupuestos.filter(function(p){
    if(p === nueva || !p.cliente || p.cliente.nombre !== nueva.cliente.nombre) return false;
    if(p.estado === 'Rechazado' || p.estado === 'Vencido') return false;
    return p.numero < nueva.numero;
  });
  // igual que al armar la boleta: si hay deuda se arrastra la deuda; si no, el saldo a favor
  var deudas = mias.filter(function(p){ return p.estado === 'Pendiente' && !(p.cierre && cierreActivo(p.cierre)) && saldoPendienteBoleta(p) > 0.01; });
  if(deudas.length) return deudas;
  return mias.filter(function(p){ return saldoPendienteBoleta(p) < -0.01; });
}
function traspasarDeudaAnterior(nueva, forzar){
  var olds = candidatosTraspaso(nueva);
  if(!olds.length) return { hecho: false, cuantas: 0 };
  var suma = olds.reduce(function(a, p){ return a + saldoPendienteBoleta(p); }, 0);
  var deuda = nueva.deuda || 0;
  if(!forzar && Math.abs(suma - deuda) > 1) return { hecho: false, cuantas: olds.length, suma: suma, deuda: deuda };
  var hoy = new Date().toLocaleDateString('es-AR');
  olds.forEach(function(p){
    var sd = saldoPendienteBoleta(p);
    if(!p.pagos) p.pagos = [];
    p.pagos.push({ fecha: hoy, monto: Math.round(sd * 100) / 100, forma: 'Traspaso', nota: 'Traspasado a la boleta #' + nueva.numero, traspaso: true });
    p.estado = 'Aprobado';
    p.traspasada_a = nueva.numero;
  });
  registrarActividad('presupuesto', 'Deuda anterior traspasada a boleta #' + nueva.numero, 'Boletas saldadas por traspaso: ' + olds.map(function(p){ return '#' + p.numero; }).join(', ') + ' | Cliente: ' + nueva.cliente.nombre);
  return { hecho: true, cuantas: olds.length, suma: suma, deuda: deuda };
}
function unirDeudaAnterior(idx){
  if(rolActual !== 'admin') return;
  var p = db.presupuestos[idx]; if(!p) return;
  var olds = candidatosTraspaso(p);
  if(!olds.length){ alert('No hay boletas anteriores de este cliente para unir.'); return; }
  var suma = olds.reduce(function(a, x){ return a + saldoPendienteBoleta(x); }, 0);
  var NL = String.fromCharCode(10);
  var msg = 'La boleta #' + p.numero + ' ya trae una deuda anterior de $' + fmt(p.deuda || 0) + '.' + NL + NL + 'Boletas anteriores de ' + p.cliente.nombre + ' que quedan dadas por traspasadas (su saldo pasa a esta boleta):' + NL +
    olds.map(function(x){ return '#' + x.numero + ': ' + (saldoPendienteBoleta(x) > 0 ? 'debe $' : 'a favor $') + fmt(Math.abs(saldoPendienteBoleta(x))); }).join(NL) + NL + NL + 'Suma: $' + fmt(suma);
  if(Math.abs(suma - (p.deuda || 0)) > 1) msg += NL + NL + 'OJO: la suma no coincide con la deuda anterior de esta boleta ($' + fmt(p.deuda || 0) + '). Revisalo antes de seguir.';
  msg += NL + NL + '¿Unir?';
  if(!confirm(msg)) return;
  traspasarDeudaAnterior(p, true);
  guardar();
  renderPresupuestos(); renderDeudores(); renderAfavor(); renderEntrega(); renderDashboard();
}

// ---- UNIR UNA BOLETA A LA ANTERIOR DEL MISMO CLIENTE (solo admin y Tute) ----
function boletaAnteriorPara(p){
  if(!p || !p.cliente) return null;
  var c = db.presupuestos.filter(function(x){
    return x !== p && x.cliente && x.cliente.nombre === p.cliente.nombre && x.estado === 'Pendiente' && x.numero < p.numero;
  });
  c.sort(function(a, b){ return b.numero - a.numero; });
  return c[0] || null;
}
function unirABoletaAnterior(idx){
  if(rolActual !== 'admin') return;
  var p = db.presupuestos[idx]; if(!p) return;
  var t = boletaAnteriorPara(p);
  if(!t){ alert('Este cliente no tiene otra boleta anterior pendiente para unir.'); return; }
  var NL = String.fromCharCode(10);
  var msg = 'Se van a pasar los productos de la boleta #' + p.numero + ' a la boleta #' + t.numero + ' de ' + p.cliente.nombre + ' y la #' + p.numero + ' se elimina.' + NL + NL +
    'Queda UNA sola boleta (#' + t.numero + '): su total pasa de $' + fmt(t.total) + ' a $' + fmt((t.subtotal || 0) + (p.subtotal || 0) + (t.deuda || 0)) + '.' + NL +
    'La deuda anterior de la #' + p.numero + ' ($' + fmt(p.deuda || 0) + ') se descarta, porque esa deuda ya está en la #' + t.numero + '.' + NL +
    'La #' + t.numero + ' vuelve a Pendiente de entrega hasta que la marques entregada.' + NL + NL + '¿Unir?';
  if(!confirm(msg)) return;
  t.lineas = (t.lineas || []).concat(p.lineas || []);
  t.subtotal = (t.subtotal || 0) + (p.subtotal || 0);
  t.total = t.subtotal + (t.deuda || 0);
  t.pagos = (t.pagos || []).concat(p.pagos || []);
  if(p.stock_aplicado || t.stock_aplicado) t.stock_aplicado = (t.stock_aplicado || []).concat(p.stock_aplicado || []);
  if(p.obs) t.obs = (t.obs ? t.obs + ' | ' : '') + p.obs;
  t.impreso = true; if(!t.fecha_impresion) t.fecha_impresion = new Date().toISOString();
  t.entregado = false; delete t.fecha_entrega;
  var i = db.presupuestos.indexOf(p);
  if(i > -1) db.presupuestos.splice(i, 1);
  registrarActividad('presupuesto', 'Unió la boleta #' + p.numero + ' a la #' + t.numero, 'Cliente: ' + p.cliente.nombre + ' | Total nuevo: $' + fmt(t.total));
  guardar();
  renderPresupuestos(); renderDeudores(); renderAfavor(); renderEntrega(); renderDashboard();
}

// ---- MARCAR VARIAS BOLETAS COMO ENTREGADAS (solo admin y Tute) ----
function masivaBoletas(){
  var q=(document.getElementById('masiva-buscar').value||'').toLowerCase().trim();
  return db.presupuestos.map(function(p,i){ return {p:p,i:i}; }).filter(function(x){
    if(x.p.impreso||x.p.estado!=='Pendiente') return false;
    if(!q) return true;
    var t=((x.p.cliente?x.p.cliente.nombre:'Consumidor final')+' '+x.p.numero).toLowerCase();
    return q.split(' ').every(function(w){ return t.indexOf(w)>-1; });
  }).sort(function(a,b){
    var na=(a.p.cliente?a.p.cliente.nombre:'').toLowerCase(), nb=(b.p.cliente?b.p.cliente.nombre:'').toLowerCase();
    return na<nb?-1:na>nb?1:b.p.numero-a.p.numero;
  });
}
function abrirMasiva(){
  if(rolActual!=='admin'){ alert('Solo el administrador puede usar esto.'); return; }
  document.getElementById('masiva-buscar').value='';
  renderMasiva();
  document.getElementById('modal-masiva').classList.add('open');
}
function renderMasiva(){
  var prev={};
  document.querySelectorAll('#masiva-tabla .masiva-chk').forEach(function(c){ if(c.checked) prev[c.getAttribute('data-i')]=true; });
  var l=masivaBoletas(), h='';
  l.forEach(function(x){
    var p=x.p, pag=(p.pagos||[]).reduce(function(a,g){return a+g.monto;},0), sal=saldoPendienteBoleta(p);
    var est=sal<-0.01?'A favor $'+fmt(-sal):(sal<=0.01?'Pagada':(pag>0?'Pagó $'+fmt(pag)+' · debe $'+fmt(sal):'Debe $'+fmt(sal)));
    h+='<tr><td><input type="checkbox" class="masiva-chk" data-i="'+x.i+'"'+(prev[x.i]?' checked':'')+' onchange="contarMasiva()"></td><td>'+p.numero+'</td><td>'+(p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):'')+'</td><td><strong>'+(p.cliente?p.cliente.nombre:'Consumidor final')+'</strong></td><td style="text-align:right">$'+fmt(p.total)+'</td><td style="font-size:12px">'+est+'</td></tr>';
  });
  document.getElementById('masiva-tabla').innerHTML=h||'<tr class="empty-row"><td colspan="6">No hay boletas para marcar</td></tr>';
  contarMasiva();
}
function masivaTildarVisibles(v){
  document.querySelectorAll('#masiva-tabla .masiva-chk').forEach(function(c){ c.checked=v; });
  contarMasiva();
}
function contarMasiva(){
  var n=document.querySelectorAll('#masiva-tabla .masiva-chk:checked').length;
  document.getElementById('masiva-n').textContent=n+' tildada'+(n!==1?'s':'');
}
function aplicarMasiva(){
  if(rolActual!=='admin') return;
  var idx=[];
  document.querySelectorAll('#masiva-tabla .masiva-chk:checked').forEach(function(c){ idx.push(parseInt(c.getAttribute('data-i'),10)); });
  if(!idx.length){ alert('Tildá al menos una boleta'); return; }
  if(!confirm('Marcar '+idx.length+' boleta(s) como entregadas? Dejan de aparecer en Presupuestos: las que deben van a Deudores y las que tienen a favor quedan en A favor.')) return;
  var ahora=new Date().toISOString(), nums=[];
  idx.forEach(function(i){
    var p=db.presupuestos[i]; if(!p) return;
    if(!p.impreso){ p.impreso=true; p.fecha_impresion=ahora; }
    p.entregado=true; p.fecha_entrega=ahora;
    if(saldoPendienteBoleta(p)<=0.01) p.estado='Aprobado';
    nums.push(p.numero);
  });
  registrarActividad('presupuesto','Marcó '+nums.length+' boletas como entregadas','Boletas: '+nums.join(', '));
  guardar(); cerrarModales();
  renderPresupuestos(); renderDeudores(); renderAfavor(); renderEntrega(); renderDashboard();
}

// ---- PENDIENTE DE ENTREGA ----
function renderEntrega(){
  var t=document.getElementById('tabla-entrega'); if(!t) return;
  var qEl=document.getElementById('entrega-buscar');
  var q=qEl?qEl.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''):'';
  var lista=db.presupuestos.filter(function(p){
    if(!p.impreso||p.entregado||p.estado==='Rechazado') return false;
    if(!q) return true;
    var txt=((p.cliente?p.cliente.nombre:'Consumidor final')+' '+p.numero).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return q.split(' ').every(function(w){ return txt.indexOf(w)>-1; });
  });
  lista.sort(function(a,b){ return String(a.fecha_impresion||'').localeCompare(String(b.fecha_impresion||'')); });
  document.getElementById('entrega-total').textContent=lista.length?(lista.length+' boleta'+(lista.length>1?'s':'')+' por entregar'+(rolActual==='admin'?' — Total: $'+fmt(lista.reduce(function(a,p){return a+(p.total||0);},0))+' · A cobrar: $'+fmt(lista.reduce(function(a,p){return a+Math.max(0,saldoPendienteBoleta(p));},0)):'')):'Nada pendiente de entrega';
  if(!lista.length){ t.innerHTML='<tr class="empty-row"><td colspan="6">Sin boletas pendientes de entrega</td></tr>'; return; }
  t.innerHTML=lista.map(function(p){
    var i=db.presupuestos.indexOf(p);
    var pag=(p.pagos||[]).reduce(function(a,x){return a+x.monto;},0), sal=saldoPendienteBoleta(p);
    var imp=sal<=0.01?'<span class="badge badge-ok">Pagada</span>':(pag>0?'<span class="badge badge-low">Pagó $'+fmt(pag)+' · debe $'+fmt(sal)+'</span>':'<span class="badge badge-out">Debe $'+fmt(sal)+'</span>');
    return '<tr><td><strong>'+p.numero+'</strong></td>'+
      '<td style="font-size:12px">'+(p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):'')+'</td>'+
      '<td><strong>'+(p.cliente?p.cliente.nombre:'Consumidor final')+'</strong></td>'+
      '<td><strong>$'+fmt(p.total)+'</strong></td>'+
      '<td>'+imp+'</td>'+
      '<td style="white-space:nowrap">'+
      (rolActual==='admin'?'<button class="btn btn-sm" onclick="editarPresupuesto('+i+')" title="Editar boleta">✏️</button> ':'')+
      ((rolActual==='admin'&&boletaAnteriorPara(p))?'<button class="btn btn-sm" onclick="unirABoletaAnterior('+i+')" title="Pasa los productos de esta boleta a la anterior del mismo cliente y queda una sola">🧩 Unir a la #'+boletaAnteriorPara(p).numero+'</button> ':'')+
      ((rolActual==='admin'&&(p.deuda||0)>0.01&&candidatosTraspaso(p).length)?'<button class="btn btn-sm" onclick="unirDeudaAnterior('+i+')" title="Esta boleta ya trae la deuda anterior: da por traspasadas las boletas viejas del cliente">🔗 Unir deuda anterior</button> ':'')+
      (rolActual==='admin'?'<button class="btn btn-sm btn-danger" onclick="cancelarPedido('+i+')" title="Cancela el pedido: devuelve el stock y lo saca de la lista">❌ Cancelar pedido</button> ':'')+
      '<button class="btn btn-sm btn-primary" onclick="abrirEntrega('+i+')" title="Cargás cuánto pagó; si falta, pasa a Deudores; si pagó de más, queda a favor">📦 Entregado (cargar pago)</button> '+
      '</td></tr>';
  }).join('');
}
function cancelarPedido(idx){
  if(rolActual !== 'admin') return;
  var p = db.presupuestos[idx]; if(!p) return;
  var NL = String.fromCharCode(10);
  var reales = (p.pagos || []).filter(function(x){ return !x.traspaso; });
  var pagado = reales.reduce(function(a, x){ return a + x.monto; }, 0);
  var viejas = db.presupuestos.filter(function(x){ return x.traspasada_a === p.numero; });
  var msg = '¿Cancelar el pedido #' + p.numero + ' de ' + (p.cliente ? p.cliente.nombre : 'Consumidor final') + ' por $' + fmt(p.total) + '?' + NL + NL + 'Se devuelve el stock y la boleta sale de Pendiente de entrega y de Deudores.';
  if(viejas.length) msg += NL + 'Las boletas viejas que se habían unido a esta (' + viejas.map(function(x){ return '#' + x.numero; }).join(', ') + ') vuelven a figurar como deuda.';
  if(pagado > 0.01) msg += NL + NL + 'OJO: tiene pagos cargados por $' + fmt(pagado) + '. Esos movimientos quedan en la Caja: revisalos y devolvé la plata si corresponde.';
  if(!confirm(msg)) return;
  viejas.forEach(function(x){
    x.pagos = (x.pagos || []).filter(function(g){ return !(g.traspaso && g.nota === 'Traspasado a la boleta #' + p.numero); });
    delete x.traspasada_a;
    if(saldoPendienteBoleta(x) > 0.01) x.estado = 'Pendiente';
  });
  if(p.stock_aplicado) devolverStockBoleta(p);
  p.estado = 'Rechazado';
  p.cancelada = true; p.fecha_cancelacion = new Date().toISOString();
  registrarActividad('eliminacion', 'Canceló pedido #' + p.numero, 'Cliente: ' + (p.cliente ? p.cliente.nombre : 'Consumidor final') + ' | Total: $' + fmt(p.total));
  guardar();
  try{ renderEntrega(); renderDeudores(); renderAfavor(); renderPresupuestos(); renderDashboard(); if(typeof renderProductos === 'function') renderProductos(); }catch(e){}
}
function entregarPagado(idx){
  var p=db.presupuestos[idx]; if(!p) return;
  if(saldoPendienteBoleta(p)>0.01){
    cobrarPresupuesto(idx, function(){ marcarEntregado(idx); });
    return;
  }
  p.estado='Aprobado';
  marcarEntregado(idx);
}
function marcarEntregado(idx){
  var p=db.presupuestos[idx]; if(!p) return;
  p.entregado=true; p.fecha_entrega=new Date().toISOString();
  registrarActividad('presupuesto','Entregó boleta #'+p.numero,'Cliente: '+(p.cliente?p.cliente.nombre:'Consumidor final'));
  guardar(); renderEntrega(); try{ renderDeudores(); renderPresupuestos(); }catch(e){}
}

// ---- DEUDORES ----
let filtroCodDeudor = '';
function setFiltroDeudor(cod, el){
  filtroCodDeudor = cod;
  document.querySelectorAll('#deudores .filtro-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderDeudores();
}
function renderDeudores(){
  renderFiltrosListas();
  const pendientes=db.presupuestos.filter(p=>{
    if(p.estado!=='Pendiente') return false;
    if(p.impreso&&!p.entregado) return false;
    if(p.cierre&&cierreActivo(p.cierre)) return false;
    if(filtroCodDeudor==='') return true;
    const cod=(p.cliente?.codigo||'').toUpperCase();
    if(filtroCodDeudor==='SIN') return !cod;
    if(filtroCodDeudor.indexOf('LISTA:')===0) return clienteEnLista(p.cliente, filtroCodDeudor.slice(6));
    return cod===filtroCodDeudor;
  }).filter(p=>{
    var qEl=document.getElementById('deudores-buscar');
    var q=qEl?qEl.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''):'';
    if(!q) return true;
    var txt=((p.cliente?p.cliente.nombre:'Consumidor final')+' '+p.numero+' '+(p.cliente&&p.cliente.tel?p.cliente.tel:'')+' '+(p.cliente&&p.cliente.codigo?p.cliente.codigo:'')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return q.split(' ').every(function(w){ return txt.indexOf(w)>-1; });
  });
  var qG=(document.getElementById('deudores-buscar')||{value:''}).value.trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
  const grupos=(db.cierres||[]).filter(c=>{
    if(c.pagado||cierreSaldo(c)<=0.01) return false;
    if(filtroCodDeudor!==''&&filtroCodDeudor!==c.grupo) return false;
    if(!qG) return true;
    var tg=(c.nombre+' '+c.grupo).toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
    return qG.split(' ').every(function(w){ return tg.indexOf(w)>-1; });
  });
  var bAg=document.getElementById('btn-agrupar'); if(bAg) bAg.style.display=(rolActual==='admin')?'':'none';
  const nItems=pendientes.length+grupos.length;
  const totalSaldo=pendientes.reduce((a,p)=>a+saldoPendienteBoleta(p),0)+grupos.reduce((a,c)=>a+cierreSaldo(c),0);
  document.getElementById('deudores-total').textContent=
    nItems?(rolActual==='admin'?\`\${nItems} \${grupos.length?'deudor':'boleta'}\${nItems>1?(grupos.length?'es':'s'):''} — Saldo: $\${fmt(totalSaldo)}\`:\`\${nItems} \${grupos.length?'deudor':'boleta'}\${nItems>1?(grupos.length?'es':'s'):''}\`):'Sin deudores en este filtro';
  // Mostrar a favor debajo
  const totalFavor = db.presupuestos.reduce((sum,p)=>sum+saldoAFavor(p),0);
  const resumenFavor = document.getElementById('afavor-resumen');
  const resumenMonto = document.getElementById('afavor-resumen-monto');
  if(resumenFavor && resumenMonto){
    if(totalFavor>0){ resumenFavor.style.display='flex'; resumenMonto.textContent='$'+fmt(totalFavor); }
    else { resumenFavor.style.display='none'; }
  }
  const t=document.getElementById('tabla-deudores');
  if(!pendientes.length&&!grupos.length){t.innerHTML='<tr class="empty-row"><td colspan="8">✅ Sin boletas pendientes en este filtro</td></tr>';return;}
  const colores={'G':'#185FA5','L':'#3B6D11','E':'#854F0B','S':'#7B3FB0','C':'#A32D2D'};
  const lista=[...pendientes].sort((a,b)=>saldoPendienteBoleta(b)-saldoPendienteBoleta(a));
  const filasGrupos=grupos.map(c=>{
    const ms=cierreMiembros(c);
    const tot=ms.reduce((a,p)=>a+(p.total||0),0);
    const sal=cierreSaldo(c);
    const pag=ms.reduce((a,p)=>a+(p.pagos||[]).reduce((s,pg)=>s+pg.monto,0),0);
    const col=colores[c.grupo]||'var(--text3)';
    return \`<tr style="background:var(--bg)">
      <td><strong>🗂️</strong></td>
      <td style="font-size:12px">\${cierreFechaCorta(c.hasta)}</td>
      <td><strong style="color:var(--text)">\${ctbEsc(c.nombre)}</strong><span style="background:\${col};color:#fff;padding:1px 7px;border-radius:100px;font-size:11px;font-weight:700;margin-left:6px">\${c.grupo}</span><br><span style="font-size:11px;color:var(--text3)">\${ms.length} boleta\${ms.length!==1?'s':''} juntas</span></td>
      <td><strong>$\${fmt(tot)}</strong></td>
      <td style="color:var(--green)">\${pag>0?'$'+fmt(pag):'<span style="color:var(--text3)">—</span>'}</td>
      <td><strong style="color:var(--red)">$\${fmt(sal)}</strong></td>
      <td><span class="badge badge-low">Deudas juntas</span></td>
      <td style="white-space:nowrap;display:flex;gap:4px;align-items:center">
        \${rolActual==='admin'?'<button class="btn btn-sm btn-green" onclick="cobrarGrupo(\\''+c.id+'\\')">✅ Cobrar todo junto</button>':''}
        <button class="btn btn-sm" onclick="verCierre('\${c.id}')">📋 Ver boletas</button>
        \${rolActual==='admin'?'<button class="btn btn-sm" onclick="deshacerCierre(\\''+c.id+'\\')" title="Vuelve a mostrar las boletas una por una">↩️</button>':''}
      </td>
    </tr>\`;
  }).join('');
  t.innerHTML=filasGrupos+lista.map(p=>{
    const realIdx=db.presupuestos.indexOf(p);
    const pagado=(p.pagos||[]).reduce((s,pg)=>s+pg.monto,0);
    const saldo=saldoPendienteBoleta(p);
    const parcial=pagado>0&&saldo>0;
    const cod=(p.cliente?.codigo||'').toUpperCase();
    const col=colores[cod]||'var(--text3)';
    const codBadge=cod
      ?\`<span style="background:\${col};color:#fff;padding:1px 7px;border-radius:100px;font-size:11px;font-weight:700;margin-left:6px">\${cod}</span>\`
      :'';
    return \`<tr>
      <td><strong>\${p.numero}</strong></td>
      <td style="font-size:12px">\${p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):''}</td>
      <td>
        <strong style="color:var(--text)">\${p.cliente?p.cliente.nombre:'Consumidor final'}</strong>\${codBadge}
        \${p.cliente&&p.cliente.tel?\`<br><span style="font-size:11px;color:var(--text3)">📞 \${p.cliente.tel}</span>\`:''}
      </td>
      <td><strong>$\${fmt(p.total)}</strong></td>
      <td style="color:var(--green)">\${pagado>0?'$'+fmt(pagado):'<span style="color:var(--text3)">—</span>'}</td>
      <td><strong style="color:\${saldo>0?'var(--red)':'var(--green)'}">$\${fmt(saldo)}</strong></td>
      <td>\${parcial?'<span class="badge badge-low">Pago parcial</span>':'<span class="badge badge-out">Sin pagar</span>'}</td>
      <td style="white-space:nowrap;display:flex;gap:4px;align-items:center">
        <button class="btn btn-sm btn-primary" onclick="abrirModalPago(\${realIdx})">💲 Pago</button>
        <button class="btn btn-sm btn-green" onclick="cobrarPresupuesto(\${realIdx})">✅ Total</button>
        \${rolActual==='admin'?\`<button class="btn btn-sm" onclick="editarPresupuesto(\${realIdx})" title="Editar boleta">✏️</button>\`:''}
        \${(rolActual==='admin'&&(p.deuda||0)>0.01&&candidatosTraspaso(p).length)?'<button class="btn btn-sm" onclick="unirDeudaAnterior('+realIdx+')" title="Esta boleta ya trae la deuda anterior: da por traspasadas las boletas viejas del cliente">🔗 Unir deuda</button>':''}
        <button class="btn btn-sm" onclick="imprimirPresupuesto(\${realIdx})">🖨️</button>
      </td>
    </tr>\`;
  }).join('');
}

let pagoIdx=null;
let pagoEntrega=false;
function abrirEntrega(idx){
  abrirModalPago(idx);
  pagoEntrega=true;
  document.getElementById('pago-titulo').textContent='Entregar boleta — ¿cuánto pagó?';
  document.getElementById('pago-btn-ok').textContent='Entregar';
  document.getElementById('pago-monto').placeholder='Vacío = no pagó nada';
}
function abrirModalPago(idx){
  pagoIdx=idx; pagoEntrega=false;
  document.getElementById('pago-titulo').textContent='Registrar pago';
  document.getElementById('pago-btn-ok').textContent='Registrar pago';
  document.getElementById('pago-monto').placeholder='0.00'; document.getElementById('pago-nota').placeholder='Ej: abono parcial, seña...';
  const p=db.presupuestos[idx];
  const pagado=(p.pagos||[]).reduce((s,pg)=>s+pg.monto,0);
  const saldo=saldoPendienteBoleta(p);
  document.getElementById('pago-cliente-nombre').textContent=p.cliente?p.cliente.nombre:'Consumidor final';
  document.getElementById('pago-numero').textContent=p.numero;
  document.getElementById('pago-total').textContent='$'+fmt(p.total);
  document.getElementById('pago-ya-pago').textContent='$'+fmt(pagado);
  document.getElementById('pago-saldo').textContent='$'+fmt(saldo);
  document.getElementById('pago-monto').value='';
  document.getElementById('pago-nota').value='';
  document.getElementById('nuevo-saldo-preview').style.display='none';
  // Historial de pagos
  const hist=document.getElementById('historial-pagos');
  if(p.pagos&&p.pagos.length){
    hist.innerHTML=\`<div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px">Pagos anteriores:</div>\`+
      p.pagos.map((pg,j)=>\`<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text2)">\${pg.fecha} — \${pg.forma}\${pg.nota?' ('+pg.nota+')':''}</span>
        <span><strong style="color:var(--green)">$\${fmt(pg.monto)}</strong>\${rolActual==='admin'?' <button class="btn btn-sm btn-danger" onclick="eliminarPago('+idx+','+j+')" title="Borra este pago (por si se cargó dos veces)">🗑️</button>':''}</span>
      </div>\`).join('');
  } else { hist.innerHTML=''; }
  document.getElementById('modal-pago').classList.add('open');
}

function actualizarNuevoSaldo(){
  const idx=pagoIdx; if(idx===null)return;
  const p=db.presupuestos[idx];
  const saldo=saldoDeuda(p);
  const monto=parseFloat(document.getElementById('pago-monto').value)||0;
  if(monto>0){
    const nuevo=saldo-monto;
    const preview=document.getElementById('nuevo-saldo-preview');
    const val=document.getElementById('nuevo-saldo-val');
    preview.style.display='block';
    if(nuevo>0){
      preview.style.background='var(--blue-light)';
      val.style.color='var(--blue-text)';
      val.textContent='Saldo pendiente: $'+fmt(nuevo);
    } else if(nuevo<-0.01){
      preview.style.background='var(--green-light)';
      val.style.color='var(--green)';
      val.textContent='A favor: $'+fmt(-nuevo)+' (se descuenta en la próxima boleta)';
    } else {
      preview.style.background='var(--green-light)';
      val.style.color='var(--green)';
      val.textContent='✅ Saldo cancelado exacto';
    }
  } else {
    document.getElementById('nuevo-saldo-preview').style.display='none';
  }
}

function confirmarPago(){
  const monto=parseFloat(document.getElementById('pago-monto').value)||0;
  if(pagoEntrega&&!monto){ pagoEntrega=false; cerrarModales(); marcarEntregado(pagoIdx); return; }
  if(!monto||monto<=0){alert('Ingresá un monto mayor a cero');return;}
  if(pagoIdx===null||pagoIdx===undefined) return;
  const p=db.presupuestos[pagoIdx];
  if(!p) return;
  const saldo=saldoDeuda(p);
  if(!p.pagos)p.pagos=[];
  const forma=document.getElementById('pago-forma').value;
  const nota=document.getElementById('pago-nota').value.trim();
  p.pagos.push({ fecha:new Date().toLocaleDateString('es-AR'), monto, forma, nota });
  registrarActividad('pago',\`Registró pago en boleta #\${p.numero}\`,\`Cliente: \${p.cliente?.nombre||'Consumidor final'} | Monto: $\${fmt(monto)} | Forma: \${forma}\${nota?' | Nota: '+nota:''}\`);
  // Si quedó saldo cero o negativo (pagó de más), marcar como Aprobado
  if(saldoPendienteBoleta(p)<=0.01) p.estado='Aprobado';
  // Registrar automáticamente en caja
  if(!db.caja) db.caja=[];
  db.caja.push({
    fecha: new Date().toLocaleDateString('es-AR'),
    tipo: 'entrada',
    medio: forma,
    desc: \`Cobro boleta #\${p.numero}\${p.cliente?' — '+p.cliente.nombre:''}\${nota?' ('+nota+')':''}\`,
    monto
  });
  if(pagoEntrega){ pagoEntrega=false; p.entregado=true; p.fecha_entrega=new Date().toISOString(); registrarActividad('presupuesto','Entregó boleta #'+p.numero,'Cliente: '+(p.cliente?p.cliente.nombre:'Consumidor final')); }
  pagoIdx=null;
  guardar(); cerrarModales(); renderDeudores(); renderAfavor(); renderDashboard(); renderPresupuestos(); try{ renderEntrega(); }catch(e){}
}
function eliminarPago(idx,j){
  if(rolActual!=='admin') return;
  var p=db.presupuestos[idx]; if(!p||!p.pagos||!p.pagos[j]) return;
  var pg=p.pagos[j];
  if(!confirm('¿Borrar el pago de $'+fmt(pg.monto)+' ('+pg.forma+', '+pg.fecha+') de la boleta #'+p.numero+'? También se saca de la Caja.')) return;
  p.pagos.splice(j,1);
  if(!pg.traspaso && db.caja){
    for(var k=db.caja.length-1;k>=0;k--){
      var c=db.caja[k];
      if(c.tipo==='entrada' && Math.abs((c.monto||0)-pg.monto)<0.01 && c.medio===pg.forma && String(c.desc||'').indexOf('boleta #'+p.numero)>-1){ db.caja.splice(k,1); break; }
    }
  }
  if(saldoPendienteBoleta(p)>0.01 && p.estado==='Aprobado') p.estado='Pendiente';
  registrarActividad('eliminacion','Borró pago de boleta #'+p.numero,'Cliente: '+(p.cliente?p.cliente.nombre:'Consumidor final')+' | Monto: $'+fmt(pg.monto)+' | Forma: '+pg.forma);
  guardar(); renderDeudores(); renderAfavor(); renderDashboard(); renderPresupuestos(); try{ renderEntrega(); }catch(e){}
  abrirModalPago(idx);
}

var cobroIdx=null, cobroCb=null;
// ---- SEMANAS AGRUPADAS (Gloria / Luis / Edgardo): varias boletas figuran como un solo deudor ----
var cobroGrupo = null;
var CIERRE_GRUPOS = { G: 'Gloria', L: 'Luis', E: 'Edgardo' };
function cierreActivo(id){
  return (db.cierres || []).some(function(c){ return c.id === id && !c.pagado; });
}
function cierreMiembros(c){
  return db.presupuestos.filter(function(p){ return p.cierre === c.id && p.estado === 'Pendiente' && saldoPendienteBoleta(p) > 0.01; });
}
function cierreSaldo(c){
  return cierreMiembros(c).reduce(function(a, p){ return a + saldoPendienteBoleta(p); }, 0);
}
function cierreFechaCorta(iso){
  var p = String(iso || '').split('-');
  return p.length === 3 ? p[2] + '/' + p[1] : '';
}
function abrirAgrupar(){
  if(rolActual !== 'admin') return;
  var hoy = new Date(), lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  var viernes = new Date(lunes); viernes.setDate(lunes.getDate() + 4);
  document.getElementById('agr-desde').value = fechaISO(lunes);
  document.getElementById('agr-hasta').value = fechaISO(viernes);
  document.getElementById('agr-grupo').value = 'L';
  agrSel = {};
  var nm = document.getElementById('agr-nombre'); nm.value = ''; nm.dataset.manual = '';
  document.getElementById('agr-todos').checked = true;
  agruparPreview();
  document.getElementById('modal-agrupar').classList.add('open');
}
var agrSel = {};
function agruparCandidatas(){
  var cod = document.getElementById('agr-grupo').value;
  var desde = document.getElementById('agr-desde').value, hasta = document.getElementById('agr-hasta').value;
  var r = { lista: [], sinEntregar: 0, extras: [], yaAgrupadas: [] };
  db.presupuestos.forEach(function(p){
    if(p.estado !== 'Pendiente' || !p.cliente) return;
    if(cod !== '*' && (p.cliente.codigo || '').toUpperCase() !== cod) return;
    if(saldoPendienteBoleta(p) <= 0.01) return;
    if(p.cierre){
      var cc = (db.cierres || []).find(function(x){ return x.id === p.cierre && !x.pagado; });
      if(cc) r.yaAgrupadas.push({ p: p, motivo: 'ya está en "' + cc.nombre + '"' });
      return;
    }
    var f = fechaParaResumen(p);
    if(!f || (desde && f < desde) || (hasta && f > hasta)){ r.extras.push({ p: p, motivo: 'fecha ' + cierreFechaCorta(f) + ' (fuera del rango)' }); return; }
    if(p.impreso && !p.entregado){ r.sinEntregar++; r.extras.push({ p: p, motivo: 'impresa, todavía sin entregar' }); return; }
    r.lista.push(p);
  });
  r.extras.sort(function(a, b){ return (a.p.cliente.nombre || '').localeCompare(b.p.cliente.nombre || '', 'es'); });
  r.lista.sort(function(a, b){ return (a.cliente.nombre || '').localeCompare(b.cliente.nombre || '', 'es'); });
  return r;
}
function agruparElegidas(){
  var r = agruparCandidatas();
  return r.lista.filter(function(p){ return agrSel[p.numero] !== false; }).concat(r.extras.filter(function(x){ return agrSel[x.p.numero] === true; }).map(function(x){ return x.p; }));
}
function agruparNombreAuto(){
  var cod = document.getElementById('agr-grupo').value;
  var desde = document.getElementById('agr-desde').value, hasta = document.getElementById('agr-hasta').value;
  var rango = (desde || hasta) ? cierreFechaCorta(desde) + ' al ' + cierreFechaCorta(hasta) : '';
  return cod === '*' ? 'Deudas juntas ' + rango : CIERRE_GRUPOS[cod] + ' semana ' + rango;
}
function agruparToggle(num, on){ agrSel[num] = !!on; agruparPreview(); }
function agruparTodos(on){
  agruparCandidatas().lista.forEach(function(p){ agrSel[p.numero] = !!on; });
  agruparPreview();
}
function agruparPreview(){
  var r = agruparCandidatas(), tot = 0, h = '', n = 0;
  r.lista.forEach(function(p){
    var s = saldoPendienteBoleta(p), on = agrSel[p.numero] !== false;
    if(on){ tot += s; n++; }
    h += '<tr><td><input type="checkbox" ' + (on ? 'checked ' : '') + 'onchange="agruparToggle(' + p.numero + ',this.checked)"></td><td>' + ctbEsc(p.cliente.nombre) + '</td><td style="text-align:right">#' + p.numero + '</td><td style="text-align:right">$' + fmt(s) + '</td></tr>';
  });
  if(r.extras.length || r.yaAgrupadas.length){
    h += '<tr><td colspan="4" style="background:var(--bg);font-size:12px;color:var(--text3);padding:8px">Otras boletas pendientes de este grupo que no entraron solas (tildalas si las querés sumar):</td></tr>';
    r.extras.forEach(function(x){
      var p = x.p, on = agrSel[p.numero] === true, s2 = saldoPendienteBoleta(p);
      if(on){ tot += s2; n++; }
      h += '<tr><td><input type="checkbox" ' + (on ? 'checked ' : '') + 'onchange="agruparToggle(' + p.numero + ',this.checked)"></td><td>' + ctbEsc(p.cliente.nombre) + '<div style="font-size:11px;color:var(--amber)">' + ctbEsc(x.motivo) + '</div></td><td style="text-align:right">#' + p.numero + '</td><td style="text-align:right">$' + fmt(s2) + '</td></tr>';
    });
    r.yaAgrupadas.forEach(function(x){
      h += '<tr style="opacity:.6"><td></td><td>' + ctbEsc(x.p.cliente.nombre) + '<div style="font-size:11px">' + ctbEsc(x.motivo) + '</div></td><td style="text-align:right">#' + x.p.numero + '</td><td style="text-align:right">$' + fmt(saldoPendienteBoleta(x.p)) + '</td></tr>';
    });
  }
  document.getElementById('agr-tabla').innerHTML = h || '<tr class="empty-row"><td colspan="4">No hay boletas pendientes de este grupo en esas fechas</td></tr>';
  var nmEl = document.getElementById('agr-nombre');
  if(!nmEl.dataset.manual) nmEl.value = agruparNombreAuto();
  document.getElementById('agr-resumen').textContent = n + ' de ' + (r.lista.length + r.extras.length) + ' boleta' + ((r.lista.length + r.extras.length) !== 1 ? 's' : '') + ' elegida' + (n !== 1 ? 's' : '') + ' · Total a cobrar $' + fmt(tot) + (r.sinEntregar ? ' · ' + r.sinEntregar + ' impresa' + (r.sinEntregar !== 1 ? 's' : '') + ' sin entregar (no se incluyen salvo que las tildes abajo)' : '');
}
function confirmarAgrupar(){
  if(rolActual !== 'admin') return;
  var r = { lista: agruparElegidas() };
  if(!r.lista.length){ alert('No hay boletas elegidas para juntar.'); return; }
  var cod = document.getElementById('agr-grupo').value;
  var desde = document.getElementById('agr-desde').value, hasta = document.getElementById('agr-hasta').value;
  var nombre = (document.getElementById('agr-nombre').value || '').trim() || agruparNombreAuto();
  if(!db.cierres) db.cierres = [];
  var id = 'c' + Date.now();
  db.cierres.push({ id: id, grupo: cod === '*' ? '' : cod, nombre: nombre, desde: desde, hasta: hasta, creado: new Date().toISOString(), pagado: false });
  r.lista.forEach(function(p){ p.cierre = id; });
  registrarActividad('presupuesto', 'Agrupó semana: ' + nombre, r.lista.length + ' boletas: ' + r.lista.map(function(p){ return '#' + p.numero; }).join(', '));
  guardar(); cerrarModales(); renderDeudores();
}
function verCierre(id){
  var c = (db.cierres || []).find(function(x){ return x.id === id; }); if(!c) return;
  var NL = String.fromCharCode(10);
  var ms = cierreMiembros(c);
  alert(c.nombre + NL + NL + ms.map(function(p){ return '#' + p.numero + ' ' + p.cliente.nombre + ': $' + fmt(saldoPendienteBoleta(p)); }).join(NL) + NL + NL + 'Total: $' + fmt(cierreSaldo(c)));
}
function deshacerCierre(id){
  if(rolActual !== 'admin') return;
  var c = (db.cierres || []).find(function(x){ return x.id === id; }); if(!c || c.pagado) return;
  if(!confirm('¿Deshacer "' + c.nombre + '"? Las boletas vuelven a aparecer una por una en Deudores.')) return;
  db.presupuestos.forEach(function(p){ if(p.cierre === id) delete p.cierre; });
  db.cierres = db.cierres.filter(function(x){ return x.id !== id; });
  registrarActividad('presupuesto', 'Deshizo la semana agrupada: ' + c.nombre, '');
  guardar(); renderDeudores();
}
function cobrarGrupo(id){
  if(rolActual !== 'admin') return;
  var c = (db.cierres || []).find(function(x){ return x.id === id; }); if(!c) return;
  cobroIdx = null; cobroCb = null; cobroGrupo = id;
  document.getElementById('cobro-info').textContent = c.nombre + ' — ' + cierreMiembros(c).length + ' boletas — Total a cobrar: $' + fmt(cierreSaldo(c));
  document.getElementById('cobro-forma').value = 'Efectivo';
  document.getElementById('cobro-efvo').value = '';
  document.getElementById('cobro-monto-wrap').style.display = 'block';
  document.getElementById('cobro-monto').value = Math.round(cierreSaldo(c) * 100) / 100;
  cobroFormaCambio();
  document.getElementById('modal-cobro').classList.add('open');
}
function confirmarCobroGrupo(){
  var c = (db.cierres || []).find(function(x){ return x.id === cobroGrupo; }); if(!c) return;
  var ms = cierreMiembros(c).sort(function(a, b){ return String(a.fecha || '').localeCompare(String(b.fecha || '')) || (a.numero - b.numero); });
  var saldoTotal = Math.round(cierreSaldo(c) * 100) / 100;
  if(!ms.length || saldoTotal <= 0.01){ alert('No queda nada para cobrar en esta semana.'); return; }
  var total = Math.round((parseFloat(document.getElementById('cobro-monto').value) || 0) * 100) / 100;
  if(total <= 0.01){ alert('Escribí cuánto paga ahora.'); return; }
  if(total > saldoTotal + 0.01){ alert('El monto es mayor que lo que se debe ($' + fmt(saldoTotal) + ').'); return; }
  if(total > saldoTotal) total = saldoTotal;
  var parcial = total < saldoTotal - 0.01;
  var forma = document.getElementById('cobro-forma').value;
  var efectivo = 0, transf = 0;
  if(forma === 'Efectivo + Transferencia'){
    efectivo = parseFloat(document.getElementById('cobro-efvo').value) || 0;
    if(efectivo <= 0 || efectivo >= total){ alert('Escribí cuánto pagó en efectivo (menos que el total). El resto se toma como transferencia.'); return; }
    efectivo = Math.round(efectivo * 100) / 100; transf = Math.round((total - efectivo) * 100) / 100;
  }
  var hoy = new Date().toLocaleDateString('es-AR');
  var restoEf = efectivo, resumenCaja = {};
  function sumaCaja(f, m){ resumenCaja[f] = Math.round(((resumenCaja[f] || 0) + m) * 100) / 100; }
  var restoPago = total, nPagadas = 0;
  ms.forEach(function(p){
    var sd = Math.min(Math.round(saldoPendienteBoleta(p) * 100) / 100, restoPago);
    if(sd <= 0.001) return;
    restoPago = Math.round((restoPago - sd) * 100) / 100; nPagadas++;
    if(!p.pagos) p.pagos = [];
    var nota = (parcial ? 'Pago parcial junto: ' : 'Pago junto: ') + c.nombre;
    if(forma !== 'Efectivo + Transferencia'){
      p.pagos.push({ fecha: hoy, monto: sd, forma: forma, nota: nota }); sumaCaja(forma, sd);
    } else {
      var ef = Math.min(restoEf, sd); restoEf = Math.round((restoEf - ef) * 100) / 100;
      var tr = Math.round((sd - ef) * 100) / 100;
      if(ef > 0.001){ p.pagos.push({ fecha: hoy, monto: ef, forma: 'Efectivo', nota: nota }); sumaCaja('Efectivo', ef); }
      if(tr > 0.001){ p.pagos.push({ fecha: hoy, monto: tr, forma: 'Transferencia', nota: nota }); sumaCaja('Transferencia', tr); }
    }
    if(saldoPendienteBoleta(p) <= 0.01) p.estado = 'Aprobado';
  });
  if(!db.caja) db.caja = [];
  Object.keys(resumenCaja).forEach(function(f){
    db.caja.push({ fecha: hoy, tipo: 'entrada', medio: f, desc: (parcial ? 'Pago parcial ' : 'Cobro ') + c.nombre + ' (' + nPagadas + ' boletas)', monto: resumenCaja[f] });
  });
  if(!parcial){ c.pagado = true; c.fecha_pago = new Date().toISOString(); }
  registrarActividad('pago', (parcial ? 'Pago parcial de la semana junta: ' : 'Cobró junta la semana: ') + c.nombre, nPagadas + ' boletas | Total: $' + fmt(total) + (parcial ? ' | Queda: $' + fmt(saldoTotal - total) : '') + ' | Forma: ' + forma);
  cobroGrupo = null;
  guardar(); cerrarModales(); renderDeudores(); renderAfavor(); renderDashboard(); renderPresupuestos(); try{ renderEntrega(); renderCaja(); }catch(e){}
}

function cobrarPresupuesto(idx, cb){
  var p=db.presupuestos[idx]; if(!p) return;
  cobroIdx=idx; cobroCb=cb||null; cobroGrupo=null;
  document.getElementById('cobro-monto-wrap').style.display='none';
  var saldo=saldoDeuda(p);
  document.getElementById('cobro-info').textContent='Boleta #'+p.numero+' — '+(p.cliente?p.cliente.nombre:'Consumidor final')+' — Saldo a cobrar: $'+fmt(saldo);
  document.getElementById('cobro-forma').value='Efectivo';
  document.getElementById('cobro-efvo').value='';
  cobroFormaCambio();
  document.getElementById('modal-cobro').classList.add('open');
}
function cobroFormaCambio(){
  document.getElementById('cobro-mixto').style.display=(document.getElementById('cobro-forma').value==='Efectivo + Transferencia')?'block':'none';
}
function confirmarCobroTotal(){
  if(cobroGrupo){ confirmarCobroGrupo(); return; }
  var idx=cobroIdx; if(idx===null||idx===undefined) return;
  var p=db.presupuestos[idx]; if(!p) return;
  cobroIdx=null;
  var saldo=saldoDeuda(p);
  var forma=document.getElementById('cobro-forma').value;
  var partes=[];
  if(forma==='Efectivo + Transferencia'){
    var ef=parseFloat(document.getElementById('cobro-efvo').value)||0;
    if(ef<=0||ef>=saldo){ alert('Escribí cuánto pagó en efectivo (menos que el total). El resto se toma como transferencia.'); cobroIdx=idx; return; }
    partes=[{forma:'Efectivo',monto:ef},{forma:'Transferencia',monto:Math.round((saldo-ef)*100)/100}];
  } else if(saldo>0){
    partes=[{forma:forma,monto:saldo}];
  }
  if(!p.pagos)p.pagos=[];
  if(!db.caja)db.caja=[];
  var hoy=new Date().toLocaleDateString('es-AR');
  partes.forEach(function(x){
    p.pagos.push({fecha:hoy,monto:x.monto,forma:x.forma,nota:'Pago total'});
    db.caja.push({fecha:hoy,tipo:'entrada',medio:x.forma,desc:'Cobro total boleta #'+p.numero+(p.cliente?' — '+p.cliente.nombre:''),monto:x.monto});
  });
  p.estado='Aprobado';
  registrarActividad('pago','Marcó cobro total boleta #'+p.numero,'Cliente: '+(p.cliente?p.cliente.nombre:'Consumidor final')+' | Total: $'+fmt(p.total)+' | Forma: '+(partes.map(function(x){return x.forma+' $'+fmt(x.monto);}).join(' + ')||'—'));
  var cb=cobroCb; cobroCb=null;
  guardar(); cerrarModales(); renderDeudores(); renderAfavor(); renderDashboard(); renderPresupuestos(); try{ renderEntrega(); }catch(e){}
  if(cb) cb();
}

// ---- EXPORTAR / IMPORTAR ----
function exportarDatos(){
  const json=JSON.stringify(db,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const fecha=new Date().toISOString().split('T')[0];
  a.href=url; a.download=\`papelera-respaldo-\${fecha}.json\`; a.click();
  URL.revokeObjectURL(url);
}
function importarDatos(input){
  const file=input.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!data.productos||!data.clientes||!data.presupuestos)throw new Error('Archivo inválido');
      if(!confirm(\`¿Importar datos?\\nEsto va a reemplazar todo lo que tenés ahora.\\n\\nEl archivo tiene:\\n• \${data.productos.length} productos\\n• \${data.clientes.length} clientes\\n• \${data.presupuestos.length} presupuestos\`))return;
      db=data; guardar(); renderDashboard();
      const msg=document.getElementById('import-msg');
      msg.style.display='block'; msg.style.color='var(--green)';
      msg.textContent=\`✅ Importado: \${data.productos.length} productos, \${data.clientes.length} clientes, \${data.presupuestos.length} presupuestos.\`;
      setTimeout(()=>msg.style.display='none',5000);
    }catch(err){
      const msg=document.getElementById('import-msg');
      msg.style.display='block'; msg.style.color='var(--red)';
      msg.textContent='❌ El archivo no es válido. Usá un respaldo generado por este sistema.';
    }
    input.value='';
  };
  reader.readAsText(file);
}

// ---- A FAVOR ----
let filtroAfavor='';
function setFiltroAfavor(cod,el){
  filtroAfavor=cod;
  document.querySelectorAll('#afavor .filtro-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active'); renderAfavor();
}
function renderAfavor(){
  renderFiltrosListas();
  const colores={'G':'#185FA5','L':'#3B6D11','E':'#854F0B','S':'#7B3FB0','C':'#A32D2D'};
  const lista=db.presupuestos.filter(p=>{
    if(saldoPendienteBoleta(p)>-0.01) return false;
    const cod=(p.cliente?.codigo||'').toUpperCase();
    if(filtroAfavor==='') return true;
    if(filtroAfavor==='SIN') return !cod;
    if(filtroAfavor.indexOf('LISTA:')===0) return clienteEnLista(p.cliente, filtroAfavor.slice(6));
    return cod===filtroAfavor;
  });
  const totalFavor=lista.reduce((a,p)=>a+saldoAFavor(p),0);
  document.getElementById('afavor-total').textContent=
    lista.length?\`\${lista.length} boleta\${lista.length>1?'s':''} — Total a favor: $\${fmt(totalFavor)}\`:'Sin saldos a favor';
  const t=document.getElementById('tabla-afavor');
  if(!lista.length){t.innerHTML='<tr class="empty-row"><td colspan="7">Sin saldos a favor</td></tr>';return;}
  t.innerHTML=lista.map(p=>{
    const pagado=(p.pagos||[]).reduce((s,pg)=>s+pg.monto,0);
    const favor=saldoAFavor(p);
    const cod=(p.cliente?.codigo||'').toUpperCase();
    const col=colores[cod]||'var(--text3)';
    const codBadge=cod?\`<span style="background:\${col};color:#fff;padding:1px 7px;border-radius:100px;font-size:11px;font-weight:700;margin-left:6px">\${cod}</span>\`:'';
    return\`<tr>
      <td><strong>\${p.numero}</strong></td>
      <td style="font-size:12px">\${p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):''}</td>
      <td><strong style="color:var(--text)">\${p.cliente?p.cliente.nombre:'Consumidor final'}</strong>\${codBadge}</td>
      <td>$\${fmt(p.total)}</td>
      <td style="color:var(--green)">$\${fmt(pagado)}</td>
      <td><strong style="color:var(--green);font-size:15px">$\${fmt(favor)}</strong></td>
      <td><span class="badge badge-ok">A favor</span>\${rolActual==='admin'?' <button class="btn btn-sm" onclick="abrirModalPago('+db.presupuestos.indexOf(p)+')" title="Ver los pagos de esta boleta (y borrar uno repetido)">💳 Pagos</button>':''}</td>
    </tr>\`;
  }).join('');
}

// ---- CAJA ----
let filtroCaja='hoy';
let filtroMedioCaja='todos';
function setFiltroCaja(f,el){
  filtroCaja=f;
  document.querySelectorAll('#caja .fc-per').forEach(b=>b.classList.remove('active'));
  var d1=document.getElementById('caja-desde'), d2=document.getElementById('caja-hasta');
  if(d1) d1.value=''; if(d2) d2.value='';
  el.classList.add('active'); renderCaja();
}
function setRangoCaja(){
  var d1=document.getElementById('caja-desde').value, d2=document.getElementById('caja-hasta').value;
  if(!d1&&!d2){ var b=document.querySelector("#caja .fc-per"); if(b) setFiltroCaja('hoy',b); return; }
  filtroCaja='rango';
  document.querySelectorAll('#caja .fc-per').forEach(b=>b.classList.remove('active'));
  renderCaja();
}
function setFiltroMedio(medio,el){
  filtroMedioCaja=medio;
  document.querySelectorAll('#caja .filtro-btn').forEach(b=>{
    if(b.textContent.includes('Efectivo')||b.textContent.includes('Transferencia')||b.textContent.includes('Todos'))
      b.classList.remove('active');
  });
  el.classList.add('active'); renderCaja();
}
function abrirModalMovimiento(){
  document.getElementById('modal-movimiento').classList.add('open');
  document.getElementById('mov-monto').value='';
  document.getElementById('mov-desc').value='';
  document.getElementById('mov-fecha').value=new Date().toISOString().split('T')[0];
  document.getElementById('mov-tipo').value='entrada';
}
async function guardarMovimiento(){
  const monto=parseFloat(document.getElementById('mov-monto').value)||0;
  const desc=document.getElementById('mov-desc').value.trim();
  if(!monto||monto<=0){alert('Ingresá un monto');return;}
  if(!desc){alert('Ingresá una descripción');return;}
  if(!db.caja)db.caja=[];
  const fechaVal=document.getElementById('mov-fecha').value;
  db.caja.push({
    fecha: fechaVal ? new Date(fechaVal+'T12:00:00').toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR'),
    tipo: document.getElementById('mov-tipo').value,
    medio: document.getElementById('mov-medio').value,
    desc, monto, id: nuevoIdCaja()
  });
  cerrarModales(); renderCaja();
  const okMov = await guardar();
  if(!okMov) alert('El movimiento se cargó SOLO en esta computadora: no se pudo guardar en el servidor. No refresques la página; se reintenta solo cada 30 segundos.');
}
function parseFechaAR(s){
  if(!s)return null;
  const p=s.split('/'); if(p.length!==3)return null;
  return new Date(+p[2],+p[1]-1,+p[0]);
}
function renderCaja(){
  if(!db.caja)db.caja=[];
  const hoy=new Date(); hoy.setHours(0,0,0,0);
  const lunes=new Date(hoy); lunes.setDate(hoy.getDate()-((hoy.getDay()+6)%7));
  const priMes=new Date(hoy.getFullYear(),hoy.getMonth(),1);
  // Guardar índices reales antes de filtrar
  const cajaConIdx=db.caja.map((m,i)=>({m,i}));
  const movs=cajaConIdx.filter(({m})=>{
    if(filtroCaja==='rango'){
      const d=parseFechaAR(m.fecha); if(!d)return false;
      d.setHours(0,0,0,0);
      const rd=(document.getElementById('caja-desde')||{}).value, rh=(document.getElementById('caja-hasta')||{}).value;
      const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      if(rd&&k<rd) return false;
      if(rh&&k>rh) return false;
    } else if(filtroCaja!=='todo'){
      const d=parseFechaAR(m.fecha); if(!d)return false;
      d.setHours(0,0,0,0);
      if(filtroCaja==='hoy'&&d.getTime()!==hoy.getTime()) return false;
      if(filtroCaja==='semana'&&d<lunes) return false;
      if(filtroCaja==='mes'&&d<priMes) return false;
    }
    if(filtroMedioCaja!=='todos'&&m.medio!==filtroMedioCaja) return false;
    return true;
  }).reverse();
  // Totales siempre sobre TODO
  let efEnt=0,efSal=0,trEnt=0,trSal=0;
  db.caja.forEach(m=>{
    if(m.medio==='Efectivo'){ if(m.tipo==='entrada')efEnt+=m.monto; else efSal+=m.monto; }
    else { if(m.tipo==='entrada')trEnt+=m.monto; else trSal+=m.monto; }
  });
  document.getElementById('caja-efectivo').textContent='$'+fmt(efEnt-efSal);
  document.getElementById('caja-transf').textContent='$'+fmt(trEnt-trSal);
  document.getElementById('caja-total').textContent='$'+fmt((efEnt-efSal)+(trEnt-trSal));
  const t=document.getElementById('tabla-caja');
  const pcard=document.getElementById('caja-periodo');
  if(pcard){
    if(filtroCaja==='rango'){
      let pe=0,ps=0;
      movs.forEach(({m})=>{ if(m.tipo==='entrada') pe+=m.monto; else ps+=m.monto; });
      pcard.style.display='block';
      pcard.firstElementChild.innerHTML='<strong>'+movs.length+' movimiento'+(movs.length!==1?'s':'')+' en esas fechas</strong>'+
        '<span>Entradas: <strong style="color:var(--green)">$'+fmt(pe)+'</strong></span>'+
        '<span>Salidas: <strong style="color:var(--red)">$'+fmt(ps)+'</strong></span>'+
        '<span>Neto: <strong>$'+fmt(pe-ps)+'</strong></span>';
    } else pcard.style.display='none';
  }
  if(!movs.length){t.innerHTML='<tr class="empty-row"><td colspan="7">Sin movimientos en este período</td></tr>';return;}
  t.innerHTML=movs.map(({m,i})=>\`<tr>
    <td style="font-size:12px">\${m.fecha}</td>
    <td><span class="badge \${m.tipo==='entrada'?'badge-ok':'badge-out'}">\${m.tipo==='entrada'?'Entrada':'Salida'}</span></td>
    <td>\${m.desc}</td>
    <td style="font-size:12px;color:var(--text2)">\${m.medio}</td>
    <td style="color:var(--green);font-weight:600">\${m.tipo==='entrada'?'$'+fmt(m.monto):'—'}</td>
    <td style="color:var(--red);font-weight:600">\${m.tipo==='salida'?'$'+fmt(m.monto):'—'}</td>
    <td style="white-space:nowrap"><button class="btn btn-sm btn-editmedio" onclick="abrirCambioMedio(\${i})" title="Cambiar el medio de pago (efectivo / transferencia)">✏️</button> <button class="btn btn-sm btn-danger" onclick="eliminarMovimiento(\${i})">🗑️</button></td>
  </tr>\`).join('');
  if(rolActual!=='admin') t.querySelectorAll('.btn-danger,.btn-editmedio').forEach(function(b){ b.remove(); });
}

async function guardarCostoProv(prodIdx){
  if(!puedeCostos()) return;
  const input = document.getElementById(\`costo-prov-\${prodIdx}\`);
  if(!input) return;
  db.productos[prodIdx].costo = parseFloat(input.value)||0;
  await guardar();
  input.style.borderColor = 'var(--green)';
  setTimeout(()=>{ input.style.borderColor=''; }, 800);
}

async function guardarStockProv(prodIdx){
  const input = document.getElementById(\`stock-prov-\${prodIdx}\`);
  if(!input) return;
  db.productos[prodIdx].stock = parseInt(input.value)||0;
  await guardar();
  input.style.borderColor = 'var(--green)';
  setTimeout(()=>{ input.style.borderColor=''; renderProveedores(); }, 800);
}

// ---- PLANILLA DE COSTOS POR PROVEEDOR ----
var planillaProv = null;
var planillaItems = [];
var planillaSucia = false;
var planillaUltimoCheck = null;
var PL_NL = String.fromCharCode(10);
var PL_CR = String.fromCharCode(13);

function parseCosto(s){
  s = String(s == null ? '' : s);
  var t = '';
  for(var i = 0; i < s.length; i++){
    var ch = s.charAt(i);
    if((ch >= '0' && ch <= '9') || ch === '.' || ch === ',') t += ch;
  }
  if(!t) return null;
  var lc = t.lastIndexOf(','), ld = t.lastIndexOf('.');
  if(lc > -1 && ld > -1){
    if(lc > ld) t = t.split('.').join('').replace(',', '.');
    else t = t.split(',').join('');
  } else if(lc > -1){
    if(t.split(',').length > 2) t = t.split(',').join('');
    else t = t.replace(',', '.');
  } else if(ld > -1){
    var parts = t.split('.');
    if(parts.length > 2) t = parts.join('');
    else if(parts[1].length === 3 && parts[0].length > 0 && parts[0].length <= 3) t = parts.join('');
  }
  var n = parseFloat(t);
  return (isFinite(n) && n >= 0) ? n : null;
}
function fmtInp(n){ return String(Math.round(n * 1000) / 1000).replace('.', ','); }

// ===== Excel del proveedor: trae el costo por código =====
var xlHojas = {};
function xlLetra(i){ var s = ''; i++; while(i > 0){ var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
function xlEstado(msg, color){ var e = document.getElementById('xl-estado'); if(e){ e.textContent = msg; e.style.color = color || 'var(--text2)'; } }
function xlCargarLibreria(cb){
  if(window.XLSX){ cb(); return; }
  xlEstado('⏳ Cargando lector de Excel...');
  var sc = document.createElement('script');
  sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  sc.onload = function(){ cb(); };
  sc.onerror = function(){ xlEstado('No se pudo cargar el lector de Excel (revisá la conexión a internet).', 'var(--red)'); };
  document.head.appendChild(sc);
}
var xlEsPdf = false;
function xlItemsARows(items){
  var its = items.filter(function(i){ return String(i.s).trim() !== ''; }).sort(function(a, b){ return (b.y - a.y) || (a.x - b.x); });
  var filas = [];
  its.forEach(function(it){
    var f = filas[filas.length - 1];
    if(f && Math.abs(f.y - it.y) <= 3) f.items.push(it); else filas.push({ y: it.y, items: [it] });
  });
  return filas.map(function(f){
    f.items.sort(function(a, b){ return a.x - b.x; });
    var cel = [], ult = null;
    f.items.forEach(function(it){
      if(ult && (it.x - (ult.x + ult.w)) < Math.max(2, (it.h || 8) * 0.5)) cel[cel.length - 1] += ((it.x - (ult.x + ult.w)) > 0.5 ? ' ' : '') + it.s;
      else cel.push(it.s);
      ult = it;
    });
    return cel.map(function(c){ return c.trim(); }).filter(function(c){ return c !== ''; });
  });
}
function xlCargarPdfJs(cb){
  if(window.pdfjsLib){ cb(); return; }
  xlEstado('⏳ Cargando lector de PDF...');
  var sc = document.createElement('script');
  sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  sc.onload = function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    cb();
  };
  sc.onerror = function(){ xlEstado('No se pudo cargar el lector de PDF (revisá la conexión a internet).', 'var(--red)'); };
  document.head.appendChild(sc);
}
function xlLeerPdf(f){
  xlCargarPdfJs(function(){
    xlEstado('⏳ Leyendo el PDF...');
    var fr = new FileReader();
    fr.onload = function(){
      window.pdfjsLib.getDocument({ data: new Uint8Array(fr.result) }).promise.then(function(doc){
        var todas = [], n = 1;
        function pagina(){
          if(n > doc.numPages){
            xlHojas = { 'PDF': todas }; xlEsPdf = true;
            if(!todas.length){ xlEstado('No encontré texto en ese PDF (puede ser una foto escaneada). Probá con el Excel.', 'var(--red)'); return; }
            xlConfigurar(); return;
          }
          doc.getPage(n).then(function(pg){ return pg.getTextContent(); }).then(function(tc){
            var items = tc.items.map(function(i){ return { s: i.str, x: i.transform[4], y: i.transform[5], w: i.width, h: i.height }; });
            todas = todas.concat(xlItemsARows(items));
            n++; pagina();
          });
        }
        pagina();
      }).catch(function(){ xlEstado('No pude leer ese PDF.', 'var(--red)'); });
    };
    fr.readAsArrayBuffer(f);
  });
}
function xlLeerArchivo(inp){
  var f = inp.files && inp.files[0]; if(!f) return;
  if(/[.]pdf$/i.test(f.name)){ xlLeerPdf(f); return; }
  xlEsPdf = false;
  xlCargarLibreria(function(){
    var fr = new FileReader();
    fr.onload = function(){
      try{
        var wb = window.XLSX.read(fr.result, { type: 'array' });
        xlHojas = {};
        wb.SheetNames.forEach(function(n){
          xlHojas[n] = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: '' });
        });
        xlConfigurar();
      }catch(e){ xlEstado('No pude leer ese archivo. Probá guardarlo como .xlsx.', 'var(--red)'); }
    };
    fr.readAsArrayBuffer(f);
  });
}
function xlConfigurar(){
  var nombres = Object.keys(xlHojas);
  var sel = document.getElementById('xl-hoja');
  sel.innerHTML = nombres.map(function(n){ return '<option value="' + ctbEsc(n) + '">' + ctbEsc(n) + '</option>'; }).join('');
  var prov = (db.proveedores || []).find(function(p){ return p.nombre === planillaProv; }) || {};
  document.getElementById('xl-desc').value = prov.descuento || '';
  document.getElementById('xl-config').style.display = nombres.length ? 'block' : 'none';
  xlEstado(nombres.length ? '✅ Archivo leído. Revisá las columnas y apretá "Calcular costos".' : 'El archivo está vacío.', nombres.length ? 'var(--green)' : 'var(--red)');
  xlCambioHoja(true);
}
function xlRowsActual(){ return xlHojas[document.getElementById('xl-hoja').value] || []; }
function xlCambioHoja(inicial){
  var rows = xlRowsActual();
  var ncol = 0;
  rows.slice(0, 40).forEach(function(r){ if(r.length > ncol) ncol = r.length; });
  // buscar la fila de títulos: una que tenga algo tipo "código" y algo tipo "precio"
  var hdr = -1, cCod = -1, cPre = -1;
  for(var i = 0; i < Math.min(rows.length, 25) && hdr < 0; i++){
    var a = -1, b = -1;
    rows[i].forEach(function(v, j){
      var t = String(v).toLowerCase();
      if(a < 0 && /(^| )(cod|c[oó]d|art|sku|ref)/.test(t)) a = j;
      if(b < 0 && /(precio|costo|lista|importe|p.? ?unit)/.test(t)) b = j;
    });
    if(a >= 0 && b >= 0){ hdr = i; cCod = a; cPre = b; }
  }
  var prov = (db.proveedores || []).find(function(p){ return p.nombre === planillaProv; }) || {};
  if(hdr < 0){ cCod = (prov.xl_cod != null) ? prov.xl_cod : 0; cPre = (prov.xl_precio != null) ? prov.xl_precio : 1; }
  if(xlEsPdf){ cCod = 0; cPre = -1; }
  var ops = xlEsPdf ? '<option value="-1">Última columna</option><option value="-2">Anteúltima columna</option><option value="-3">Antes de la anteúltima</option>' : '';
  for(var c = 0; c < Math.max(ncol, 2); c++){
    var tit = hdr >= 0 ? String(rows[hdr][c] == null ? '' : rows[hdr][c]).slice(0, 25) : String(rows[0] && rows[0][c] != null ? rows[0][c] : '').slice(0, 25);
    ops += '<option value="' + c + '">' + xlLetra(c) + (tit ? ' — ' + ctbEsc(tit) : '') + '</option>';
  }
  document.getElementById('xl-col-cod').innerHTML = ops; document.getElementById('xl-col-precio').innerHTML = ops;
  document.getElementById('xl-col-cod').value = cCod; document.getElementById('xl-col-precio').value = cPre;
  document.getElementById('xl-fila').value = hdr >= 0 ? hdr + 2 : 1;
  var h = '<table style="font-size:12px;border-collapse:collapse">';
  rows.slice(0, 6).forEach(function(r, i){
    h += '<tr><td style="color:var(--text3);padding:2px 6px">' + (i + 1) + '</td>';
    for(var c2 = 0; c2 < Math.min(ncol, 8); c2++) h += '<td style="padding:2px 8px;border:1px solid var(--border)">' + ctbEsc(String(r[c2] == null ? '' : r[c2]).slice(0, 28)) + '</td>';
    h += '</tr>';
  });
  document.getElementById('xl-vista').innerHTML = h + '</table>';
  document.getElementById('xl-resultado').innerHTML = '';
}
function xlFactor(txt){
  // "10" = 10% de descuento; "10+5" = 10% y después 5% más
  var f = 1, ok = true;
  String(txt || '').split('+').forEach(function(x){
    if(!x.trim()) return;
    var d = parseCosto(x);
    if(d === null || d < 0 || d >= 100){ ok = false; return; }
    f = f * (1 - d / 100);
  });
  return ok ? f : null;
}
function xlClave(v){
  var s = String(v == null ? '' : v).trim().toUpperCase().split(' ').join('');
  if(typeof v === 'number' && isFinite(v)) s = String(v);
  return s;
}
function xlSinCeros(s){ return /^0+[0-9A-Z]/.test(s) ? s.replace(/^0+/, '') : s; }
function xlAplicar(){
  var rows = xlRowsActual();
  var factor = xlFactor(document.getElementById('xl-desc').value);
  if(factor === null){ alert('El descuento no es válido. Escribí por ejemplo 10 o 10+5.'); return; }
  var cCod = parseInt(document.getElementById('xl-col-cod').value, 10), cPre = parseInt(document.getElementById('xl-col-precio').value, 10);
  var desde = Math.max(1, parseInt(document.getElementById('xl-fila').value, 10) || 1);
  var precios = {};
  for(var i = desde - 1; i < rows.length; i++){
    var r = rows[i], k = xlClave(cCod < 0 ? r[r.length + cCod] : r[cCod]); if(!k) continue;
    var raw = cPre < 0 ? r[r.length + cPre] : r[cPre], pr = (typeof raw === 'number') ? raw : parseCosto(raw);
    if(pr === null || !(pr > 0)) continue;
    if(precios[k] === undefined) precios[k] = pr;
    var k2 = xlSinCeros(k); if(precios[k2] === undefined) precios[k2] = pr;
  }
  var puestos = 0, sinCambio = 0, faltan = [], sinCodigo = [];
  for(var n = 0; n < planillaItems.length; n++){
    var p = planillaProducto(n); if(!p) continue;
    var kc = xlClave(p.codigo);
    if(!kc){ sinCodigo.push(p.nombre); continue; }
    var pr2 = precios[kc] !== undefined ? precios[kc] : precios[xlSinCeros(kc)];
    if(pr2 === undefined){ faltan.push((p.codigo || '') + ' — ' + p.nombre); continue; }
    var costo = Math.round(pr2 * factor * 100) / 100;
    if(Math.abs(costo - (p.costo || 0)) < 0.005) sinCambio++;
    document.getElementById('pl-in-' + n).value = fmtInp(costo);
    puestos++;
  }
  planillaCambio();
  var prov = (db.proveedores || []).find(function(x){ return x.nombre === planillaProv; });
  if(prov){ prov.descuento = document.getElementById('xl-desc').value.trim(); prov.xl_cod = cCod; prov.xl_precio = cPre; }
  var h = '<div style="font-weight:600;margin-top:8px;color:var(--green)">✅ ' + puestos + ' costo' + (puestos !== 1 ? 's' : '') + ' completado' + (puestos !== 1 ? 's' : '') + (sinCambio ? ' (' + sinCambio + ' ya estaban igual)' : '') + (factor !== 1 ? ' con descuento ' + ctbEsc(document.getElementById('xl-desc').value) + '%' : '') + '. Revisá los resaltados y apretá 💾 Guardar todo.</div>';
  if(faltan.length) h += '<div style="margin-top:6px;font-size:13px;color:var(--amber)"><strong>' + faltan.length + ' no se encontraron en el Excel</strong> (quedan con el costo que tenían):<br>' + faltan.map(ctbEsc).join('<br>') + '</div>';
  if(sinCodigo.length) h += '<div style="margin-top:6px;font-size:13px;color:var(--text3)">' + sinCodigo.length + ' sin código cargado, no se pueden buscar: ' + sinCodigo.map(ctbEsc).join(', ') + '</div>';
  document.getElementById('xl-resultado').innerHTML = h;
}

function planillaProducto(k){
  return db.productos.find(function(p){ return p.nombre === planillaItems[k]; });
}
function planillaVisibles(){
  return Array.prototype.slice.call(document.querySelectorAll('#tabla-planilla tr[data-k]'))
    .filter(function(tr){ return tr.style.display !== 'none'; })
    .map(function(tr){ return parseInt(tr.getAttribute('data-k'), 10); });
}

function abrirPlanilla(provIdx){
  if(!puedeCostos()) return;
  var prov = db.proveedores[provIdx];
  if(!prov) return;
  planillaProv = prov.nombre;
  planillaSucia = false;
  planillaUltimoCheck = null;
  document.getElementById('planilla-filtro').value = '';
  document.getElementById('planilla-solosin').checked = false;
  document.getElementById('planilla-igual').value = '';
  xlHojas = {}; document.getElementById('xl-config').style.display = 'none'; document.getElementById('xl-archivo').value = ''; xlEstado('Busca cada código de tus productos en el Excel y trae el precio como costo.');
  showSubseccion('sub-planilla');
  renderPlanilla();
}
function renderPlanilla(){
  var prods = db.productos.filter(function(p){ return (p.proveedor || '').toLowerCase() === planillaProv.toLowerCase(); });
  planillaItems = prods.map(function(p){ return p.nombre; });
  document.getElementById('planilla-titulo').textContent = '📝 Costos de ' + planillaProv + ' (' + prods.length + ' productos)';
  var t = document.getElementById('tabla-planilla');
  if(!prods.length){
    t.innerHTML = '<tr class="empty-row"><td colspan="6">Este proveedor no tiene productos asignados</td></tr>';
    planillaCambio();
    return;
  }
  t.innerHTML = prods.map(function(p, k){
    return '<tr data-k="' + k + '">' +
      '<td><input type="checkbox" class="pl-chk" onclick="planillaClick(event,' + k + ')"></td>' +
      '<td style="font-size:12px;color:var(--text2)">' + (p.codigo || '—') + '</td>' +
      '<td><strong>' + p.nombre + '</strong></td>' +
      '<td style="font-size:12px;color:var(--text2)">' + (p.medida || '—') + '</td>' +
      '<td style="text-align:right;font-weight:600" id="pl-actual-' + k + '">' + (p.costo > 0 ? '$' + fmt(p.costo) : '<span style="color:var(--text3)">—</span>') + '</td>' +
      '<td style="text-align:right"><input type="text" inputmode="decimal" class="inp" id="pl-in-' + k + '" value="' + (p.costo > 0 ? fmtInp(p.costo) : '') + '" placeholder="—" style="width:110px;text-align:right" oninput="planillaCambio()" onpaste="planillaPegar(event,' + k + ')" onkeydown="planillaTecla(event,' + k + ')" onblur="planillaNormalizar(' + k + ')"></td>' +
    '</tr>';
  }).join('');
  planillaSelCount();
  planillaCambio();
}

// Cuenta y resalta los cambios (solo cuenta celdas con un número distinto al costo actual)
function planillaCambio(){
  var n = 0;
  for(var k = 0; k < planillaItems.length; k++){
    var inp = document.getElementById('pl-in-' + k);
    if(!inp) continue;
    var p = planillaProducto(k);
    var v = parseCosto(inp.value);
    var cambio = (v !== null && p && Math.abs(v - (p.costo || 0)) > 0.000001);
    if(cambio) n++;
    inp.style.background = cambio ? 'var(--amber-light)' : '';
    inp.style.borderColor = (inp.value.trim() !== '' && v === null) ? 'var(--red)' : '';
  }
  planillaSucia = n > 0;
  var lab = document.getElementById('planilla-cambios');
  lab.style.color = n > 0 ? 'var(--amber)' : 'var(--text2)';
  lab.textContent = n === 0 ? 'Sin cambios' : (n + (n === 1 ? ' cambio sin guardar' : ' cambios sin guardar'));
  return n;
}
function planillaNormalizar(k){
  var inp = document.getElementById('pl-in-' + k);
  if(!inp) return;
  var v = parseCosto(inp.value);
  if(v !== null) inp.value = fmtInp(v);
  planillaCambio();
}
function planillaTecla(e, k){
  var vis = planillaVisibles();
  var pos = vis.indexOf(k);
  var dest = null;
  if(e.key === 'Enter' || e.key === 'ArrowDown') dest = vis[pos + 1];
  else if(e.key === 'ArrowUp') dest = vis[pos - 1];
  else return;
  e.preventDefault();
  if(dest !== null && dest !== undefined){
    var nx = document.getElementById('pl-in-' + dest);
    if(nx){ nx.focus(); nx.select(); }
  }
}
// Pegar una columna copiada de Excel: se completa hacia abajo desde la celda actual
function planillaPegar(e, k){
  var cd = e.clipboardData || window.clipboardData;
  var txt = cd ? cd.getData('text') : '';
  var lines = txt.split(PL_NL).map(function(l){ return l.split(PL_CR).join(''); });
  while(lines.length && lines[lines.length - 1] === '') lines.pop();
  if(lines.length <= 1) return;
  e.preventDefault();
  var vis = planillaVisibles();
  var start = vis.indexOf(k);
  var puestos = 0;
  lines.forEach(function(l, i){
    var kk = vis[start + i];
    if(kk === undefined) return;
    var cells = l.split(String.fromCharCode(9));
    var v = parseCosto(cells[cells.length - 1]);
    if(v === null) return;
    document.getElementById('pl-in-' + kk).value = fmtInp(v);
    puestos++;
  });
  planillaCambio();
  var lab = document.getElementById('planilla-cambios');
  lab.textContent = lab.textContent + ' · pegados ' + puestos + ' valores';
}

function planillaSelCount(){
  var n = document.querySelectorAll('#tabla-planilla .pl-chk:checked').length;
  document.getElementById('planilla-selcount').textContent = n;
}
function planillaClick(e, k){
  var on = e.target.checked;
  if(e.shiftKey && planillaUltimoCheck !== null){
    var vis = planillaVisibles();
    var a = vis.indexOf(planillaUltimoCheck), b = vis.indexOf(k);
    if(a > -1 && b > -1){
      var lo = Math.min(a, b), hi = Math.max(a, b);
      for(var i = lo; i <= hi; i++){
        var c = document.querySelector('#tabla-planilla tr[data-k="' + vis[i] + '"] .pl-chk');
        if(c) c.checked = on;
      }
    }
  }
  planillaUltimoCheck = k;
  planillaSelCount();
}
function planillaSelTodos(on){
  planillaVisibles().forEach(function(k){
    var c = document.querySelector('#tabla-planilla tr[data-k="' + k + '"] .pl-chk');
    if(c) c.checked = on;
  });
  planillaSelCount();
}
function filtrarPlanilla(){
  var q = document.getElementById('planilla-filtro').value.toLowerCase().trim();
  var soloSin = document.getElementById('planilla-solosin').checked;
  Array.prototype.slice.call(document.querySelectorAll('#tabla-planilla tr[data-k]')).forEach(function(tr){
    var k = parseInt(tr.getAttribute('data-k'), 10);
    var p = planillaProducto(k);
    var txt = p ? ((p.nombre || '') + ' ' + (p.medida || '') + ' ' + (p.codigo || '')).toLowerCase() : '';
    var ver = (!q || txt.indexOf(q) > -1) && (!soloSin || !(p && p.costo > 0));
    tr.style.display = ver ? '' : 'none';
    if(!ver){ var c = tr.querySelector('.pl-chk'); if(c) c.checked = false; }
  });
  document.getElementById('planilla-todos').checked = false;
  planillaUltimoCheck = null;
  planillaSelCount();
}
function aplicarIgualPlanilla(){
  var v = parseCosto(document.getElementById('planilla-igual').value);
  if(v === null){ alert('Ingresá un costo válido'); return; }
  var marcados = Array.prototype.slice.call(document.querySelectorAll('#tabla-planilla .pl-chk:checked'));
  if(!marcados.length){ alert('Primero marcá los productos que van a tener ese costo'); return; }
  marcados.forEach(function(c){
    var k = parseInt(c.closest('tr').getAttribute('data-k'), 10);
    document.getElementById('pl-in-' + k).value = fmtInp(v);
    c.checked = false;
  });
  document.getElementById('planilla-igual').value = '';
  document.getElementById('planilla-todos').checked = false;
  planillaUltimoCheck = null;
  planillaSelCount();
  planillaCambio();
}

// Un solo guardado para todos los cambios
async function guardarPlanilla(){
  var cambios = [];
  for(var k = 0; k < planillaItems.length; k++){
    var inp = document.getElementById('pl-in-' + k);
    var p = planillaProducto(k);
    var v = inp ? parseCosto(inp.value) : null;
    if(p && v !== null && Math.abs(v - (p.costo || 0)) > 0.000001) cambios.push({ k: k, p: p, v: v });
  }
  var lab = document.getElementById('planilla-cambios');
  if(!cambios.length){ lab.textContent = 'No hay cambios para guardar'; return; }
  var btn = document.getElementById('planilla-guardar');
  btn.disabled = true; btn.textContent = '⏳ Guardando...';
  cambios.forEach(function(c){ c.p.costo = c.v; });
  try { await guardar(); } catch(e) {}
  btn.disabled = false; btn.textContent = '💾 Guardar todo';
  cambios.forEach(function(c){
    var cel = document.getElementById('pl-actual-' + c.k);
    if(cel) cel.innerHTML = c.v > 0 ? '$' + fmt(c.v) : '<span style="color:var(--text3)">—</span>';
  });
  planillaCambio();
  lab.style.color = 'var(--green)';
  lab.textContent = '✅ ' + cambios.length + (cambios.length === 1 ? ' costo guardado' : ' costos guardados');
  renderProveedores();
}
function cerrarPlanilla(){
  if(planillaCambio() > 0 && !confirm('Tenés cambios sin guardar. ¿Salir igual y perderlos?')) return;
  planillaSucia = false;
  planillaProv = null;
  showSubseccion('sub-proveedores');
  renderProveedores();
}

// ---- ASIGNADOR DE PROVEEDORES ----
function showSubseccion(id){
  document.getElementById('sub-proveedores').style.display = id==='sub-proveedores'?'block':'none';
  document.getElementById('sub-asignar').style.display = id==='sub-asignar'?'block':'none';
  var spl = document.getElementById('sub-planilla'); if(spl) spl.style.display = id==='sub-planilla'?'block':'none';
  var scu = document.getElementById('sub-cuenta'); if(scu) scu.style.display = id==='sub-cuenta'?'block':'none';
  if(id==='sub-asignar') renderAsignador();
}

function renderAsignador(){
  // Actualizar opciones del select de filtro
  const selFiltro = document.getElementById('asignar-filtro-prov');
  const provActuales = [...new Set(db.productos.map(p=>p.proveedor||'').filter(Boolean))];
  const optsExtra = provActuales.map(p=>\`<option value="\${p}">\${p}</option>\`).join('');
  selFiltro.innerHTML = \`<option value="">Todos los proveedores</option><option value="SIN">Sin asignar</option>\${optsExtra}\`;

  const q = (document.getElementById('asignar-filtro')?.value||'').toLowerCase();
  const filtroProv = document.getElementById('asignar-filtro-prov')?.value||'';
  const proveedores = db.proveedores||[];

  const lista = db.productos.filter((p,i)=>{
    const matchTexto = !q || p.nombre.toLowerCase().includes(q) || (p.medida||'').toLowerCase().includes(q);
    const prov = p.proveedor||'';
    const matchProv = !filtroProv ? true : filtroProv==='SIN' ? !prov : prov===filtroProv;
    return matchTexto && matchProv;
  });

  const t = document.getElementById('tabla-asignador');
  if(!lista.length){
    t.innerHTML='<tr class="empty-row"><td colspan="5">Sin resultados</td></tr>';
    return;
  }

  const colores={'Kohut':'#854F0B','Mapsa':'#185FA5','Walter':'#3B6D11','Lenci':'#7B3FB0'};
  const optsProveedores = \`<option value="">-- Sin asignar --</option>\` +
    proveedores.map(p=>\`<option value="\${p.nombre}">\${p.nombre}</option>\`).join('');

  t.innerHTML = lista.map(prod=>{
    const realIdx = db.productos.indexOf(prod);
    const prov = prod.proveedor||'';
    const col = colores[prov]||'var(--text3)';
    const badge = prov
      ? \`<span style="background:\${col};color:#fff;padding:2px 9px;border-radius:100px;font-size:11px;font-weight:700">\${prov}</span>\`
      : \`<span style="color:var(--text3);font-size:12px">Sin asignar</span>\`;
    return \`<tr>
      <td><strong>\${prod.nombre}</strong></td>
      <td style="font-size:12px;color:var(--text2)">\${prod.categoria}</td>
      <td style="font-size:12px">\${prod.medida||'—'}</td>
      <td>\${badge}</td>
      <td>
        <select onchange="asignarProveedor(\${realIdx},this.value)"
          style="font-size:13px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);min-width:130px">
          \${optsProveedores.replace(\`value="\${prov}"\`,\`value="\${prov}" selected\`)}
        </select>
      </td>
      <td>\${prov?\`<button class="btn btn-sm btn-danger" onclick="asignarProveedor(\${realIdx},'')" title="Quitar proveedor">✕</button>\`:'<span style="color:var(--text3)">—</span>'}</td>
    </tr>\`;
  }).join('');
}

function asignarProveedor(prodIdx, provNombre){
  if(!puedeAsignarProv()) return;
  db.productos[prodIdx].proveedor = provNombre||'';
  guardar();
  // Refrescar sin perder el scroll
  renderAsignador();
  renderProveedores();
}
let editProvIdx = null;
function abrirModalProveedor(idx){
  editProvIdx = idx ?? null;
  document.getElementById('modal-proveedor').classList.add('open');
  document.getElementById('titulo-modal-prov').textContent = idx !== undefined ? 'Editar proveedor' : 'Nuevo proveedor';
  ['prov-nombre','prov-tel','prov-email','prov-contacto','prov-dir','prov-notas'].forEach(id=>document.getElementById(id).value='');
  if(idx !== undefined){
    const p=db.proveedores[idx];
    document.getElementById('prov-nombre').value=p.nombre||'';
    document.getElementById('prov-tel').value=p.tel||'';
    document.getElementById('prov-email').value=p.email||'';
    document.getElementById('prov-contacto').value=p.contacto||'';
    document.getElementById('prov-dir').value=p.dir||'';
    document.getElementById('prov-notas').value=p.notas||'';
  }
}
function guardarProveedor(){
  const nombre=document.getElementById('prov-nombre').value.trim();
  if(!nombre){alert('Ingresá el nombre del proveedor');return;}
  const datos={
    nombre, tel:document.getElementById('prov-tel').value.trim(),
    email:document.getElementById('prov-email').value.trim(),
    contacto:document.getElementById('prov-contacto').value.trim(),
    dir:document.getElementById('prov-dir').value.trim(),
    notas:document.getElementById('prov-notas').value.trim()
  };
  if(!db.proveedores)db.proveedores=[];
  if(editProvIdx!==null){
    var nomViejo = db.proveedores[editProvIdx] ? db.proveedores[editProvIdx].nombre : '';
    db.proveedores[editProvIdx]=datos;
    if(nomViejo && nomViejo !== datos.nombre){ db.productos.forEach(function(p){ if(p.proveedor === nomViejo) p.proveedor = datos.nombre; }); (db.prov_movs || []).forEach(function(m){ if(m.proveedor === nomViejo) m.proveedor = datos.nombre; }); }
  }
  else db.proveedores.push(datos);
  ordenarDatos();
  guardar(); cerrarModales(); renderProveedores();
}
function eliminarProveedor(idx){
  if(!confirm('¿Eliminar este proveedor?'))return;
  db.proveedores.splice(idx,1); guardar(); renderProveedores();
}
function puedeAsignarProv(){ return rolActual==='admin' || nivelActual==='caja'; }
function renderProveedores(){
  if(!db.proveedores)db.proveedores=[];
  // Renderizar botones según rol
  const headerBtns = document.getElementById('prov-header-btns');
  if(headerBtns){
    if(rolActual==='admin'){
      headerBtns.innerHTML = \`
        <button class="btn" onclick="showSubseccion('sub-asignar')">📋 Asignar productos</button>
        <button class="btn btn-green" onclick="abrirModalProducto()">+ Nuevo producto</button>
        <button class="btn btn-primary" onclick="abrirModalProveedor()">+ Nuevo proveedor</button>\`;
    } else {
      headerBtns.innerHTML = (puedeAsignarProv() ? \`
        <button class="btn" onclick="showSubseccion('sub-asignar')">📋 Asignar productos</button>\` : '') + \`
        <button class="btn btn-green" onclick="abrirModalProducto()">+ Nuevo producto</button>
        <button class="btn btn-primary" onclick="abrirModalProveedor()">+ Nuevo proveedor</button>\`;
    }
  }

  const cont=document.getElementById('proveedores-cards');
  if(!db.proveedores.length){
    cont.innerHTML='<div style="color:var(--text3);text-align:center;padding:3rem">Sin proveedores. Agregá el primero.</div>';
    return;
  }

  function tablaProds(prods){
    if(!prods.length) return \`<div style="font-size:13px;color:var(--text3);padding:12px 0">Sin productos asignados.</div>\`;
    return \`<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">
      <thead><tr>
        <th style="text-align:left;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Producto</th>
        <th style="text-align:left;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Medida</th>
        \${puedeCostos()?\`
        <th style="text-align:right;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Costo actual</th>
        <th style="text-align:center;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Editar costo</th>\`
        :''}
        <th style="text-align:center;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Stock actual</th>
        \${rolActual==='admin'?\`<th style="text-align:center;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg)">Editar stock</th>\`:''}
      </tr></thead>
      <tbody>\${prods.map(p=>{
        const pi=db.productos.indexOf(p);
        return\`<tr>
          <td style="padding:8px 10px;border-bottom:1px solid var(--border)">
            <strong>\${p.nombre}</strong>
            \${rolActual==='admin'?\`<button class="btn btn-sm" onclick="abrirModalProducto(\${pi})" style="margin-left:6px;padding:2px 7px;font-size:11px">✏️</button> <button class="btn btn-sm btn-danger" onclick="eliminarProducto(\${pi})" style="padding:2px 7px;font-size:11px">🗑️</button>\`:''}
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text2)">\${p.medida||'—'}</td>
        \${puedeCostos()?\`<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;font-weight:600">\${p.costo>0?'$'+fmt(p.costo):'<span style="color:var(--text3)">—</span>'}</td>
          <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center">
            <div style="display:flex;gap:4px;justify-content:center;align-items:center">
              <input type="number" id="costo-prov-\${pi}" value="\${p.costo||''}" min="0" step="0.01"
                style="width:90px;font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);text-align:right"
                onkeydown="if(event.key==='Enter') guardarCostoProv(\${pi})">
              <button class="btn btn-sm btn-primary" onclick="guardarCostoProv(\${pi})" style="padding:3px 8px;font-size:12px">✓</button>
            </div>
          </td>\`
          :''}
          <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center">\${p.stock} <span style="font-size:11px;color:var(--text3)">\${p.unidad}</span></td>
          \${rolActual==='admin'?\`<td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center">
            <div style="display:flex;gap:4px;justify-content:center;align-items:center">
              <input type="number" id="stock-prov-\${pi}" value="\${p.stock}" min="0"
                style="width:70px;font-size:12px;padding:3px 6px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg2);color:var(--text);text-align:center"
                onkeydown="if(event.key==='Enter') guardarStockProv(\${pi})">
              <button class="btn btn-sm btn-primary" onclick="guardarStockProv(\${pi})" style="padding:3px 8px;font-size:12px">✓</button>
            </div>
          </td>\`:''}
        </tr>\`;
      }).join('')}</tbody>
    </table>\`;
  }

  // Cards de proveedores
  let html = db.proveedores.map((prov,i)=>{
    const prods=db.productos.filter(p=>(p.proveedor||'').toLowerCase()===prov.nombre.toLowerCase());
    const info=[];
    if(prov.tel) info.push(\`📞 \${prov.tel}\`);
    if(prov.email) info.push(\`✉️ \${prov.email}\`);
    if(prov.contacto) info.push(\`👤 \${prov.contacto}\`);
    return \`<div class="card" style="margin-bottom:1.25rem">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:16px;font-weight:700">\${prov.nombre}</span>
          \${info.length?\`<span style="font-size:12px;color:var(--text2);margin-left:12px">\${info.join('  ·  ')}</span>\`:''}
          \${prov.notas?\`<div style="font-size:11px;color:var(--text3);margin-top:2px">\${prov.notas}</div>\`:''}
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          \${rolActual==='admin'?\`<span style="font-size:13px;margin-right:4px">\${provSaldoTexto(provSaldo(prov.nombre))}</span><button class="btn btn-sm" onclick="abrirCuentaProv(\${i})">📒 Cuenta</button>\`:''}
          <button class="btn btn-sm btn-primary" onclick="abrirModalPedido(\${i})">📦 Registrar pedido</button>
          \${puedeAsignarProv()?\`<button class="btn btn-sm btn-green" onclick="abrirModalAsignarProd(\${i})">+ Agregar producto</button>\`:''}
          \${puedeCostos()?\`<button class="btn btn-sm" onclick="abrirPlanilla(\${i})">📝 Planilla de costos</button>\`:''}
          \${rolActual==='admin'?\`
          <button class="btn btn-sm" onclick="abrirModalProveedor(\${i})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarProveedor(\${i})">🗑️</button>\`:''}
        </div>
      </div>
      <div style="padding:0 0 4px">\${tablaProds(prods)}</div>
    </div>\`;
  }).join('');

  // Productos sin proveedor al final
  const sinProv = db.productos.filter(p=>!p.proveedor);
  if(sinProv.length){
    html += \`<div class="card" style="margin-bottom:1.25rem;border-color:var(--border)">
      <div class="card-header">
        <span style="font-size:15px;font-weight:700;color:var(--text3)">⚠️ Sin proveedor asignado</span>
        \${puedeAsignarProv()?\`<button class="btn btn-sm" onclick="showSubseccion('sub-asignar')">📋 Asignar proveedor</button>\`:''}
      </div>
      <div style="padding:0 0 4px">\${tablaProds(sinProv)}</div>
    </div>\`;
  }

  if(rolActual==='admin'){
    var totDeuda=db.proveedores.reduce(function(a,p){ return a+Math.max(0,provSaldo(p.nombre)); },0);
    if(totDeuda>0.005) html='<div style="margin-bottom:1rem;font-size:14px;font-weight:600">Deuda total con proveedores: <span style="color:var(--red)">$'+fmt(totDeuda)+'</span></div>'+html;
  }
  cont.innerHTML = html;
}

// ---- ASIGNAR PRODUCTO A PROVEEDOR ----
let asignarProvIdx=null;
function abrirModalAsignarProd(provIdx){
  asignarProvIdx=provIdx;
  const prov=db.proveedores[provIdx];
  document.getElementById('titulo-asignar-prod').textContent=\`Agregar producto a \${prov.nombre}\`;
  document.getElementById('asignar-prod-search').value='';
  document.getElementById('asignar-prod-idx').value='';
  document.getElementById('asignar-prod-costo').value='';
  var cEl=document.getElementById('asignar-prod-costo'); if(cEl&&cEl.closest('.form-group')) cEl.closest('.form-group').style.display = puedeCostos() ? '' : 'none';
  document.getElementById('asignar-prod-info').style.display='none';
  document.getElementById('asignar-prod-ac').classList.remove('open');
  document.getElementById('modal-asignar-prod').classList.add('open');
}
function acAsignarProd(q){
  const list=document.getElementById('asignar-prod-ac');
  document.getElementById('asignar-prod-idx').value='';
  document.getElementById('asignar-prod-info').style.display='none';
  if(!q.trim()){list.classList.remove('open');return;}
  const res=db.productos.map((p,i)=>({p,i}))
    .filter(({p})=>p.nombre.toLowerCase().includes(q.toLowerCase())||(p.medida||'').toLowerCase().includes(q.toLowerCase()));
  if(!res.length){list.innerHTML='<div class="ac-empty">Sin resultados</div>';list.classList.add('open');return;}
  list.innerHTML=res.slice(0,12).map(({p,i})=>\`
    <div class="ac-item" onmousedown="elegirAsignarProd(\${i})">
      <strong>\${p.nombre}</strong>
      <div class="ac-sub">\${p.medida||''} — Proveedor: \${p.proveedor||'Sin asignar'}</div>
    </div>\`).join('');
  list.classList.add('open');
}
function elegirAsignarProd(idx){
  const p=db.productos[idx];
  document.getElementById('asignar-prod-search').value=p.nombre+(p.medida?' – '+p.medida:'');
  document.getElementById('asignar-prod-idx').value=idx;
  document.getElementById('asignar-prod-ac').classList.remove('open');
  document.getElementById('asignar-prod-nombre').textContent=p.nombre;
  document.getElementById('asignar-prod-provactual').textContent=p.proveedor||'Sin asignar';
  document.getElementById('asignar-prod-costo').value=p.costo>0?p.costo:'';
  document.getElementById('asignar-prod-info').style.display='block';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#asignar-prod-search')&&!e.target.closest('#asignar-prod-ac'))
    document.getElementById('asignar-prod-ac')?.classList.remove('open');
});
function confirmarAsignarProd(){
  const idxVal=document.getElementById('asignar-prod-idx').value;
  if(idxVal===''){alert('Seleccioná un producto');return;}
  const idx=parseInt(idxVal);
  const prov=db.proveedores[asignarProvIdx];
  db.productos[idx].proveedor=prov.nombre;
  const costo=parseFloat(document.getElementById('asignar-prod-costo').value)||0;
  if(costo>0 && puedeCostos()) db.productos[idx].costo=costo;
  ordenarDatos();
  guardar(); cerrarModales(); renderProveedores();
}

// ---- PEDIDOS A PROVEEDOR ----
// ===== Cuenta corriente con cada proveedor =====
function provFechaCorta(iso){
  var p = String(iso || '').split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '';
}
function provMovs(nombre){
  return (db.prov_movs || []).filter(function(m){ return (m.proveedor || '').toLowerCase() === String(nombre || '').toLowerCase(); });
}
function provSaldo(nombre){
  return Math.round(provMovs(nombre).reduce(function(a, m){ return a + (m.tipo === 'pago' ? -m.monto : m.monto); }, 0) * 100) / 100;
}
function provSaldoTexto(s){
  if(s > 0.005) return '<span style="color:var(--red);font-weight:700">Le debemos $' + fmt(s) + '</span>';
  if(s < -0.005) return '<span style="color:var(--green);font-weight:700">A favor nuestro $' + fmt(-s) + '</span>';
  return '<span style="color:var(--text3)">Al día</span>';
}
var cuentaProv = null;
function abrirCuentaProv(i){
  if(rolActual !== 'admin') return;
  var prov = db.proveedores[i]; if(!prov) return;
  cuentaProv = prov.nombre;
  document.getElementById('cuenta-filtro').value = 'todo'; document.getElementById('cuenta-desde').value = ''; document.getElementById('cuenta-hasta').value = '';
  document.getElementById('cp-base').value = ''; document.getElementById('cp-pct').value = ''; calcPctProv();
  showSubseccion('sub-cuenta');
  renderCuentaProv();
}
function cerrarCuentaProv(){
  cuentaProv = null;
  showSubseccion('sub-proveedores');
  renderProveedores();
}
function renderCuentaProv(){
  if(!cuentaProv) return;
  var movs = provMovs(cuentaProv);
  document.getElementById('cuenta-titulo').textContent = '📒 Cuenta de ' + cuentaProv;
  document.getElementById('cuenta-saldo').innerHTML = provSaldoTexto(provSaldo(cuentaProv));
  var orden = movs.slice().sort(function(a, b){ return String(a.fecha || '').localeCompare(String(b.fecha || '')) || String(a.creado || '').localeCompare(String(b.creado || '')); });
  var acum = 0, filas = orden.map(function(m){
    acum = Math.round((acum + (m.tipo === 'pago' ? -m.monto : m.monto)) * 100) / 100;
    return { m: m, saldo: acum };
  }).reverse();
  var ft = document.getElementById('cuenta-filtro').value, fd = document.getElementById('cuenta-desde').value, fh = document.getElementById('cuenta-hasta').value;
  filas = filas.filter(function(x){
    if(ft !== 'todo' && x.m.tipo !== ft) return false;
    if(fd && String(x.m.fecha) < fd) return false;
    if(fh && String(x.m.fecha) > fh) return false;
    return true;
  });
  var sp = 0, sg = 0, np = 0, ng = 0;
  filas.forEach(function(x){ if(x.m.tipo === 'pago'){ sg += x.m.monto; ng++; } else { sp += x.m.monto; np++; } });
  document.getElementById('cuenta-totales').innerHTML = (ft !== 'pago' ? 'Pedidos: <span style="color:var(--red)">$' + fmt(sp) + '</span> (' + np + ')' : '') + (ft === 'todo' ? ' · ' : '') + (ft !== 'pedido' ? 'Pagos: <span style="color:var(--green)">$' + fmt(sg) + '</span> (' + ng + ')' : '');
  var t = document.getElementById('tabla-cuenta');
  if(!filas.length){ t.innerHTML = '<tr class="empty-row"><td colspan="6">Todavía no hay movimientos con este proveedor</td></tr>'; return; }
  t.innerHTML = filas.map(function(x){
    var m = x.m, esPago = m.tipo === 'pago';
    var det = ctbEsc(m.desc || (esPago ? 'Pago' : 'Pedido'));
    if(m.lineas && m.lineas.length) det += '<div style="font-size:11px;color:var(--text3)">' + m.lineas.map(function(l){ return ctbEsc(l.cant + ' x ' + l.nombre) + (l.costo ? ' a $' + fmt(l.costo) : ''); }).join(' · ') + '</div>';
    if(esPago && m.medio) det += '<div style="font-size:11px;color:var(--text3)">' + ctbEsc(m.medio) + (m.caja_id ? ' · salió de Caja' : '') + '</div>';
    return '<tr><td style="font-size:12px">' + provFechaCorta(m.fecha) + '</td><td>' + det + '</td>' +
      '<td style="color:var(--red);font-weight:600">' + (esPago ? '—' : '$' + fmt(m.monto)) + '</td>' +
      '<td style="color:var(--green);font-weight:600">' + (esPago ? '$' + fmt(m.monto) : '—') + '</td>' +
      '<td style="font-weight:700">$' + fmt(x.saldo) + '</td>' +
      '<td><button class="btn btn-sm btn-danger" onclick="eliminarMovProv(\\'' + m.id + '\\')">🗑️</button></td></tr>';
  }).join('');
}
function cpUsar(que){
  var v = 0;
  if(que === 'deuda') v = Math.max(0, provSaldo(cuentaProv));
  else {
    var ft = document.getElementById('cuenta-filtro').value, fd = document.getElementById('cuenta-desde').value, fh = document.getElementById('cuenta-hasta').value;
    provMovs(cuentaProv).forEach(function(m){
      if(m.tipo !== 'pedido') return;
      if(fd && String(m.fecha) < fd) return;
      if(fh && String(m.fecha) > fh) return;
      v += m.monto;
    });
  }
  document.getElementById('cp-base').value = v > 0 ? String(Math.round(v * 100) / 100).replace('.', ',') : '';
  calcPctProv();
}
function calcPctProv(){
  var base = parseCosto(document.getElementById('cp-base').value), pct = parseCosto(document.getElementById('cp-pct').value);
  var out = document.getElementById('cp-resultado');
  if(base === null || pct === null){ out.innerHTML = '<span style="color:var(--text3)">Poné el monto y el porcentaje para ver el resultado.</span>'; return; }
  var x = Math.round(base * pct) / 100;
  out.innerHTML =
    '<div>El <strong>' + fmt(pct) + '%</strong> de $' + fmt(base) + ' es <strong>$' + fmt(x) + '</strong></div>' +
    '<div style="margin-top:4px">Sumándole el ' + fmt(pct) + '%: <strong>$' + fmt(base + x) + '</strong></div>' +
    '<div style="margin-top:4px">Restándole el ' + fmt(pct) + '%: <strong>$' + fmt(base - x) + '</strong></div>';
}
function abrirMovProv(tipo){
  if(rolActual !== 'admin' || !cuentaProv) return;
  document.getElementById('pmov-tipo').value = tipo || 'pago';
  document.getElementById('pmov-monto').value = '';
  document.getElementById('pmov-desc').value = '';
  document.getElementById('pmov-fecha').value = fechaISO(new Date());
  document.getElementById('pmov-medio').value = 'Efectivo';
  document.getElementById('pmov-caja').checked = true;
  document.getElementById('titulo-pmov').textContent = 'Movimiento con ' + cuentaProv;
  pmovCambio();
  document.getElementById('modal-provmov').classList.add('open');
}
function pmovCambio(){
  var pago = document.getElementById('pmov-tipo').value === 'pago';
  document.getElementById('pmov-pagoextra').style.display = pago ? 'block' : 'none';
}
function confirmarMovProv(){
  if(rolActual !== 'admin' || !cuentaProv) return;
  var tipo = document.getElementById('pmov-tipo').value;
  var monto = parseCosto(document.getElementById('pmov-monto').value);
  if(monto === null || monto <= 0){ alert('Ingresá un monto válido'); return; }
  var fecha = document.getElementById('pmov-fecha').value || fechaISO(new Date());
  var desc = document.getElementById('pmov-desc').value.trim();
  if(!db.prov_movs) db.prov_movs = [];
  var mov = { id: 'pv' + Date.now() + Math.random().toString(36).slice(2, 6), proveedor: cuentaProv, fecha: fecha, tipo: tipo === 'pago' ? 'pago' : 'pedido', monto: monto, desc: desc || (tipo === 'pago' ? 'Pago' : 'Deuda cargada'), creado: new Date().toISOString() };
  if(tipo === 'pago'){
    mov.medio = document.getElementById('pmov-medio').value;
    if(document.getElementById('pmov-caja').checked){
      if(!db.caja) db.caja = [];
      var cid = nuevoIdCaja();
      var p = fecha.split('-');
      db.caja.push({ fecha: new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR'), tipo: 'salida', medio: mov.medio, desc: 'Pago proveedor ' + cuentaProv + (desc ? ' - ' + desc : ''), monto: monto, id: cid });
      mov.caja_id = cid;
    }
  }
  db.prov_movs.push(mov);
  registrarActividad(tipo === 'pago' ? 'pago' : 'presupuesto', (tipo === 'pago' ? 'Pagó a proveedor ' : 'Cargó deuda con proveedor ') + cuentaProv, 'Monto: $' + fmt(monto));
  guardar().then(function(ok){ if(!ok) alert('Quedó SOLO en esta computadora: no se pudo guardar en el servidor. No refresques la página.'); });
  cerrarModales(); renderCuentaProv();
  try{ renderCaja(); }catch(e){}
}
function eliminarMovProv(id){
  if(rolActual !== 'admin') return;
  var m = (db.prov_movs || []).find(function(x){ return x.id === id; }); if(!m) return;
  var msg = '¿Eliminar este ' + (m.tipo === 'pago' ? 'pago' : 'pedido') + ' de $' + fmt(m.monto) + ' de la cuenta de ' + m.proveedor + '?';
  if(m.tipo === 'pedido') msg += ' (No cambia el stock.)';
  if(m.caja_id) msg += ' También se saca el movimiento de Caja.';
  if(!confirm(msg)) return;
  db.prov_movs = db.prov_movs.filter(function(x){ return x.id !== id; });
  if(m.caja_id) db.caja = (db.caja || []).filter(function(c){ return c.id !== m.caja_id; });
  guardar();
  renderCuentaProv();
  try{ renderCaja(); }catch(e){}
}
function pedidoRecalc(){
  var tot = document.getElementById('ped-total'); if(!tot || tot.dataset.manual) return;
  var s = 0;
  document.querySelectorAll('#lineas-pedido > div').forEach(function(row){
    var c = parseInt(row.querySelector('.ped-cant').value, 10) || 0;
    var ce = row.querySelector('.ped-costo'); var k = ce ? (parseCosto(ce.value) || 0) : 0;
    s += c * k;
  });
  tot.value = s > 0 ? String(Math.round(s * 100) / 100).replace('.', ',') : '';
}

let pedidoProvIdx=null;
function abrirModalPedido(provIdx){
  pedidoProvIdx=provIdx;
  const prov=db.proveedores[provIdx];
  document.getElementById('titulo-modal-pedido').textContent=\`Pedido a \${prov.nombre}\`;
  document.getElementById('ped-fecha').value=new Date().toISOString().split('T')[0];
  document.getElementById('ped-remito').value='';
  var pt=document.getElementById('ped-total'); pt.value=''; pt.dataset.manual='';
  document.getElementById('ped-stock').checked=true;
  document.getElementById('ped-admin-extra').style.display = rolActual==='admin' ? 'block' : 'none';
  document.getElementById('lineas-pedido').innerHTML='';
  agregarLineaPedido();
  document.getElementById('modal-pedido').classList.add('open');
}
function agregarLineaPedido(){
  const prov=db.proveedores[pedidoProvIdx];
  // Filtrar productos de este proveedor
  const prodsDelProv=db.productos
    .map((p,i)=>({p,i}))
    .filter(({p})=>(p.proveedor||'').toLowerCase()===prov.nombre.toLowerCase());

  const div=document.createElement('div');
  div.style.cssText='display:grid;grid-template-columns:' + (rolActual==='admin' ? '2fr 90px 120px 36px' : '2fr 100px 36px') + ';gap:8px;align-items:center;margin-bottom:8px';
  div.innerHTML=\`
    <div class="ac-wrap">
      <input type="text" class="inp ped-prod-search" placeholder="Buscar producto de \${prov.nombre}..." oninput="acPedidoProd(this,\${pedidoProvIdx})" autocomplete="off" style="width:100%">
      <input type="hidden" class="ped-prod-idx">
      <div class="ac-list ped-prod-ac"></div>
    </div>
    <input type="number" class="inp ped-cant" placeholder="Cantidad" min="1" value="1" oninput="pedidoRecalc()">
    \${rolActual==='admin'?'<input type="text" inputmode="decimal" class="inp ped-costo" placeholder="Costo unit. $" oninput="pedidoRecalc()">':''}
    <button class="btn btn-sm btn-danger" onclick="this.closest('div').remove();pedidoRecalc()" style="align-self:center">✕</button>\`;
  document.getElementById('lineas-pedido').appendChild(div);
}
function acPedidoProd(input, provIdx){
  const q=input.value.toLowerCase().trim();
  const list=input.closest('.ac-wrap').querySelector('.ped-prod-ac');
  document.querySelectorAll('.ped-prod-ac').forEach(l=>{if(l!==list)l.classList.remove('open');});
  const prov=db.proveedores[provIdx];
  const res=db.productos.map((p,i)=>({p,i}))
    .filter(({p})=>(p.proveedor||'').toLowerCase()===prov.nombre.toLowerCase()
      &&(!q||p.nombre.toLowerCase().includes(q)||(p.medida||'').toLowerCase().includes(q)));
  if(!res.length){list.innerHTML='<div class="ac-empty">Sin resultados</div>';list.classList.add('open');return;}
  list.innerHTML=res.slice(0,15).map(({p,i})=>\`
    <div class="ac-item" onmousedown="elegirPedidoProd(this,\${i})">
      <strong>\${p.nombre}</strong>
      <div class="ac-sub">\${p.medida||''} — Stock actual: \${p.stock} \${p.unidad}</div>
    </div>\`).join('');
  list.classList.add('open');
}
function elegirPedidoProd(el,idx){
  const p=db.productos[idx];
  const wrap=el.closest('.ac-wrap');
  wrap.querySelector('.ped-prod-search').value=p.nombre+(p.medida?' – '+p.medida:'');
  wrap.querySelector('.ped-prod-idx').value=idx;
  var ce=wrap.parentNode.querySelector('.ped-costo'); if(ce&&p.costo>0){ ce.value=String(p.costo).replace('.',','); pedidoRecalc(); }
  wrap.querySelector('.ped-prod-ac').classList.remove('open');
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.ped-prod-search')&&!e.target.closest('.ped-prod-ac'))
    document.querySelectorAll('.ped-prod-ac').forEach(l=>l.classList.remove('open'));
});
function confirmarPedido(){
  const lineas=[];
  let ok=true;
  document.querySelectorAll('#lineas-pedido > div').forEach(row=>{
    const idxVal=row.querySelector('.ped-prod-idx').value;
    const cant=parseInt(row.querySelector('.ped-cant').value)||0;
    const ce=row.querySelector('.ped-costo');
    const costo=ce?(parseCosto(ce.value)||0):0;
    if(!idxVal){ok=false;return;}
    if(cant>0) lineas.push({prodIdx:parseInt(idxVal),cant,costo});
  });
  if(!ok||!lineas.length){alert('Completá al menos un producto con cantidad');return;}
  const prov=db.proveedores[pedidoProvIdx];
  const fecha=document.getElementById('ped-fecha').value;
  const remito=document.getElementById('ped-remito').value.trim();
  const esAdmin=rolActual==='admin';
  const sumarStock=!esAdmin||document.getElementById('ped-stock').checked;
  const total=esAdmin?(parseCosto(document.getElementById('ped-total').value)||0):0;
  // Sumar al stock
  if(sumarStock) lineas.forEach(({prodIdx,cant})=>{
    db.productos[prodIdx].stock=(db.productos[prodIdx].stock||0)+cant;
  });
  // Guardar historial en el proveedor
  if(!prov.pedidos)prov.pedidos=[];
  prov.pedidos.unshift({
    fecha: fecha?new Date(fecha+'T12:00:00').toLocaleDateString('es-AR'):new Date().toLocaleDateString('es-AR'),
    remito,
    lineas: lineas.map(({prodIdx,cant})=>({nombre:db.productos[prodIdx].nombre,cant}))
  });
  // Sumar el total a la cuenta del proveedor
  if(esAdmin&&total>0){
    if(!db.prov_movs) db.prov_movs=[];
    db.prov_movs.push({
      id:'pv'+Date.now()+Math.random().toString(36).slice(2,6), proveedor:prov.nombre,
      fecha:fecha||fechaISO(new Date()), tipo:'pedido', monto:total,
      desc:'Pedido'+(remito?' (remito '+remito+')':''),
      lineas:lineas.map(({prodIdx,cant,costo})=>({nombre:db.productos[prodIdx].nombre,cant,costo})),
      creado:new Date().toISOString()
    });
    registrarActividad('presupuesto','Pedido a proveedor '+prov.nombre,'Total: $'+fmt(total)+(sumarStock?' | Stock sumado':''));
  }
  guardar().then(function(g){ if(!g) alert('Quedó SOLO en esta computadora: no se pudo guardar en el servidor. No refresques la página.'); });
  cerrarModales(); renderProveedores();
  alert((sumarStock?'✅ Stock actualizado ('+lineas.length+' producto'+(lineas.length>1?'s':'')+'). ':'✅ Pedido registrado. ')+(esAdmin?(total>0?'Se sumaron $'+fmt(total)+' a la deuda con '+prov.nombre+'.':'No pusiste total, así que no se cargó deuda.'):''));
}

var medioIdx = null;
function boletaDeMovimiento(m){
  var r = /boleta #(\\d+)/i.exec(m.desc || ''); if(!r) return null;
  return db.presupuestos.find(function(p){ return p.numero === parseInt(r[1], 10); }) || null;
}
function pagoDeMovimiento(m, p){
  if(!p) return null;
  return (p.pagos || []).find(function(g){ return !g.traspaso && g.forma === m.medio && Math.abs((g.monto || 0) - m.monto) < 0.01; }) || null;
}
function abrirCambioMedio(i){
  if(rolActual !== 'admin') return;
  var m = db.caja[i]; if(!m) return;
  medioIdx = i;
  document.getElementById('medio-info').textContent = m.fecha + ' · ' + (m.tipo === 'entrada' ? 'Entrada' : 'Salida') + ' $' + fmt(m.monto) + ' · ' + (m.desc || '') + ' · hoy figura como: ' + m.medio;
  document.getElementById('medio-nuevo').value = m.medio === 'Efectivo' ? 'Transferencia' : 'Efectivo';
  var p = boletaDeMovimiento(m), g = pagoDeMovimiento(m, p);
  var wrap = document.getElementById('medio-boleta-wrap');
  wrap.style.display = g ? 'flex' : 'none';
  document.getElementById('medio-boleta').checked = true;
  document.getElementById('medio-boleta-num').textContent = g ? '(#' + p.numero + ')' : '';
  document.getElementById('modal-medio').classList.add('open');
}
function confirmarCambioMedio(){
  if(rolActual !== 'admin') return;
  var m = db.caja[medioIdx]; if(!m) return;
  var nuevo = document.getElementById('medio-nuevo').value;
  if(nuevo === m.medio){ cerrarModales(); return; }
  var viejo = m.medio, p = boletaDeMovimiento(m), g = pagoDeMovimiento(m, p);
  if(g && document.getElementById('medio-boleta').checked) g.forma = nuevo;
  m.medio = nuevo;
  registrarActividad('caja', 'Cambió el medio de un movimiento de caja', '$' + fmt(m.monto) + ' ' + (m.desc || '') + ': ' + viejo + ' → ' + nuevo);
  medioIdx = null;
  guardar().then(function(ok){ if(!ok) alert('No se pudo guardar en el servidor. No refresques la página; se reintenta solo.'); });
  cerrarModales(); renderCaja();
}
function eliminarMovimiento(idx){
  if(rolActual!=='admin'){ alert('No tenés permiso para eliminar movimientos de caja.'); return; }
  if(!confirm('¿Eliminar este movimiento de la caja?'))return;
  db.caja.splice(idx,1); renderCaja(); guardar().then(function(ok){ if(!ok) alert('No se pudo guardar en el servidor. No refresques la página; se reintenta solo.'); });
}

// ---- GANANCIA ----
function acGanancia(q){
  const list=document.getElementById('gan-ac');
  if(!q.trim()){list.classList.remove('open');limpiarGanancia();return;}
  const res=db.presupuestos.map((p,i)=>({p,i})).filter(({p})=>
    String(p.numero).includes(q)||
    (p.cliente?.nombre||'').toLowerCase().includes(q.toLowerCase())
  );
  if(!res.length){list.innerHTML='<div class="ac-empty">Sin resultados</div>';list.classList.add('open');return;}
  list.innerHTML=res.slice(0,10).map(({p,i})=>\`
    <div class="ac-item" onmousedown="mostrarGanancia(\${i})">
      <strong>#\${p.numero}</strong> — \${p.cliente?p.cliente.nombre:'Consumidor final'}
      <div class="ac-sub">\${p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):''} — $\${fmt(p.total)}</div>
    </div>\`).join('');
  list.classList.add('open');
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#gan-search')&&!e.target.closest('#gan-ac'))
    document.getElementById('gan-ac')?.classList.remove('open');
});
function limpiarGanancia(){
  document.getElementById('gan-resultado').style.display='none';
  document.getElementById('gan-vacio').style.display='block';
}
function mostrarGanancia(idx){
  const p=db.presupuestos[idx];
  document.getElementById('gan-search').value=\`#\${p.numero} — \${p.cliente?p.cliente.nombre:'Consumidor final'}\`;
  document.getElementById('gan-ac').classList.remove('open');
  document.getElementById('gan-vacio').style.display='none';
  document.getElementById('gan-resultado').style.display='block';
  document.getElementById('gan-titulo').textContent='Presupuesto #'+p.numero;
  document.getElementById('gan-fecha').textContent=p.fecha?new Date(p.fecha+'T12:00:00').toLocaleDateString('es-AR'):'';
  document.getElementById('gan-cliente').textContent=p.cliente?p.cliente.nombre:'Consumidor final';
  document.getElementById('gan-deuda').textContent='$'+fmt(p.deuda||0);
  let costoTotal=0, ventaTotal=0, sinCosto=false;
  const filas=p.lineas.map(l=>{
    const prod=buscarProdDeLinea(l);
    const costoReal=prod?.costo||0;
    if(!costoReal) sinCosto=true;
    const costo=costoReal>0?costoReal:l.precio;
    const sv=l.cant*l.precio, sc=l.cant*costo, gan=sv-sc;
    const margen=sv>0?((gan/sv)*100).toFixed(1)+'%':'—';
    costoTotal+=sc; ventaTotal+=sv;
    const col=gan>0?'var(--green)':gan<0?'var(--red)':'var(--text2)';
    return \`<tr>
      <td><strong>\${l.nombre}</strong></td>
      <td style="text-align:center">\${l.cant}</td>
      <td>$\${fmt(l.precio)}</td>
      <td>\${costoReal>0?'$'+fmt(costo):'<span style="color:var(--text3)">Sin costo (= venta)</span>'}</td>
      <td>$\${fmt(sv)}</td>
      <td>\${costoReal>0?'$'+fmt(sc):'<span style="color:var(--text3)">$'+fmt(sc)+'</span>'}</td>
      <td style="font-weight:600;color:\${col}">$\${fmt(gan)}</td>
      <td style="font-size:12px;color:\${col}">\${margen}</td>
    </tr>\`;
  });
  document.getElementById('gan-tabla').innerHTML=filas.join('');
  const ganBruta=ventaTotal-costoTotal;
  const margenTotal=ventaTotal>0?((ganBruta/ventaTotal)*100).toFixed(1):0;
  document.getElementById('gan-total').textContent='$'+fmt(ventaTotal);
  document.getElementById('gan-costo').textContent='$'+fmt(costoTotal);
  document.getElementById('gan-ganancia').textContent='$'+fmt(ganBruta);
  document.getElementById('gan-margen').textContent='Margen: '+margenTotal+'%';
  document.getElementById('gan-aviso').style.display=sinCosto?'block':'none';
}

// ---- CONTROL DE STOCK SEMANAL ----
var csValores = {};      // lo que se fue escribiendo: { indiceProducto: 'texto' }
var csSucio = false;
function csNum(v){ var n = listasNum(String(v == null ? '' : v)); return n; }
var csVistaActual = 'semanal';
var cgValores = {}, cgSucio = false;
function csVista(v){
  csVistaActual = v;
  document.getElementById('cs-vista-semanal').style.display = v === 'semanal' ? '' : 'none';
  document.getElementById('cs-vista-guardado').style.display = v === 'guardado' ? '' : 'none';
  document.getElementById('cs-tab-semanal').classList.toggle('active', v === 'semanal');
  document.getElementById('cs-tab-guardado').classList.toggle('active', v === 'guardado');
  if(v === 'guardado') renderGuardado(); else renderControlStock();
}
function renderGuardado(){
  if(rolActual !== 'admin') return;
  var q = (document.getElementById('cg-buscar').value || '').toLowerCase().trim();
  var todos = document.getElementById('cg-todos').checked;
  var h = '', n = 0, valor = 0, sinCosto = 0, ks = [];
  db.productos.forEach(function(p, k){
    var t = ((p.nombre || '') + ' ' + (p.medida || '') + ' ' + (p.codigo || '')).toLowerCase();
    if(q && !q.split(' ').every(function(w){ return t.indexOf(w) > -1; })) return;
    var tiene = (p.guardado || 0) > 0 || cgValores[k] !== undefined;
    if(!tiene && !(todos || q)) return;
    ks.push(k);
  });
  ks.sort(function(a, b){ return (db.productos[a].nombre || '').localeCompare(db.productos[b].nombre || '', 'es'); });
  ks.forEach(function(k){
    var p = db.productos[k], v = cgValores[k] === undefined ? ((p.guardado || 0) > 0 ? p.guardado : '') : cgValores[k];
    h += '<tr><td><strong>' + ctbEsc(p.nombre) + '</strong>' + (p.medida ? '<div style="font-size:11px;color:var(--text3)">' + ctbEsc(p.medida) + '</div>' : '') + '</td>' +
      '<td style="text-align:right;font-weight:600">' + (p.stock || 0) + ' <span style="font-size:11px;color:var(--text3);font-weight:400">' + ctbEsc(p.unidad || '') + '</span></td>' +
      '<td style="text-align:right"><input type="text" inputmode="decimal" class="inp cg-in" data-k="' + k + '" value="' + ctbEsc(v) + '" placeholder="0" style="width:90px;text-align:right" oninput="cgCambio(this)"></td>' +
      '<td style="white-space:nowrap"><button class="btn btn-sm" title="Pasa una parte del stock al guardado" onclick="cgMover(' + k + ',1)">Al guardado →</button> <button class="btn btn-sm" title="Vuelve una parte del guardado al stock" onclick="cgMover(' + k + ',0)">← Al stock</button></td></tr>';
  });
  db.productos.forEach(function(p){
    if((p.guardado || 0) > 0){ n++; if(p.costo > 0) valor += p.guardado * p.costo; else sinCosto++; }
  });
  document.getElementById('cg-tabla').innerHTML = h || '<tr class="empty-row"><td colspan="4">No hay productos con stock guardado. Marcá "Mostrar también los que no tienen guardado" para cargar uno.</td></tr>';
  document.getElementById('cg-resumen').textContent = n + ' producto' + (n !== 1 ? 's' : '') + ' guardado' + (n !== 1 ? 's' : '') + ' · valor al costo ' + ctbMoney(valor) + (sinCosto ? ' (' + sinCosto + ' sin costo cargado)' : '');
}
function cgCambio(inp){
  cgValores[inp.getAttribute('data-k')] = inp.value;
  cgSucio = true;
}
async function cgGuardar(){
  if(rolActual !== 'admin') return;
  var ks = Object.keys(cgValores), cambios = [];
  for(var i = 0; i < ks.length; i++){
    var k = ks[i], p = db.productos[k]; if(!p) continue;
    var txt = cgValores[k], n = (txt === '' ? 0 : csNum(txt));
    if(n === null || n < 0){ alert('Cantidad inválida en "' + p.nombre + '". Corregila antes de guardar.'); return; }
    if(Math.abs(n - (p.guardado || 0)) > 0.0005) cambios.push({ k: k, nombre: p.nombre, antes: p.guardado || 0, despues: n });
  }
  if(!cambios.length){ alert('No hay cambios para guardar.'); return; }
  cambios.forEach(function(x){ db.productos[x.k].guardado = x.despues; });
  registrarActividad('producto', 'Stock guardado', cambios.map(function(x){ return x.nombre + ': ' + x.antes + ' → ' + x.despues; }).join(' | '));
  cgValores = {}; cgSucio = false;
  var ok = await guardar();
  renderGuardado();
  if(typeof renderProductos === 'function') renderProductos();
  renderDashboard();
  if(!ok) alert('Los cambios quedaron SOLO en esta computadora: no se pudieron guardar en el servidor. No cierres la página y probá de nuevo.');
}
async function cgMover(k, haciaGuardado){
  if(rolActual !== 'admin') return;
  var p = db.productos[k]; if(!p) return;
  var disp = haciaGuardado ? (p.stock || 0) : (p.guardado || 0);
  var txt = prompt((haciaGuardado ? 'Pasar al guardado' : 'Volver al stock') + ' — ' + p.nombre + String.fromCharCode(10) + 'Disponible: ' + disp + String.fromCharCode(10) + '¿Cuántos?');
  if(txt === null || txt === '') return;
  var n = csNum(txt);
  if(n === null || n <= 0){ alert('Escribí una cantidad mayor a cero.'); return; }
  if(n > disp + 0.0005){ alert('No hay tanto: solo tenés ' + disp + '.'); return; }
  if(haciaGuardado){ p.stock = Math.round(((p.stock || 0) - n) * 1000) / 1000; p.guardado = Math.round(((p.guardado || 0) + n) * 1000) / 1000; }
  else { p.guardado = Math.round(((p.guardado || 0) - n) * 1000) / 1000; p.stock = Math.round(((p.stock || 0) + n) * 1000) / 1000; }
  delete cgValores[k];
  registrarActividad('producto', haciaGuardado ? 'Pasó al stock guardado' : 'Volvió al stock', p.nombre + ': ' + n);
  var ok = await guardar();
  renderGuardado();
  if(typeof renderProductos === 'function') renderProductos();
  renderDashboard();
  if(!ok) alert('El cambio quedó SOLO en esta computadora: no se pudo guardar en el servidor. No cierres la página y probá de nuevo.');
}
function iniciarControlStock(){
  if(!db.controles_stock) db.controles_stock = [];
  var cats = {};
  db.productos.forEach(function(p){ if(p.categoria) cats[p.categoria] = true; });
  var sel = document.getElementById('cs-cat'), actual = sel.value;
  sel.innerHTML = '<option value="">Todas las categorías</option>' + Object.keys(cats).sort(function(a, b){ return a.localeCompare(b, 'es'); }).map(function(c){ return '<option>' + ctbEsc(c) + '</option>'; }).join('');
  sel.value = actual;
  renderControlStock();
  if(csVistaActual === 'guardado') renderGuardado();
}
function csVisibles(){
  var q = (document.getElementById('cs-buscar').value || '').toLowerCase().trim();
  var cat = document.getElementById('cs-cat').value;
  var ocultarCero = document.getElementById('cs-ocultar-cero').checked;
  var soloSin = document.getElementById('cs-solo-sin').checked;
  var r = [];
  db.productos.forEach(function(p, k){
    if(cat && p.categoria !== cat) return;
    if(ocultarCero && !(p.stock > 0) && csValores[k] === undefined) return;
    if(soloSin && csValores[k] !== undefined && csValores[k] !== '') return;
    if(q){
      var t = ((p.nombre || '') + ' ' + (p.medida || '') + ' ' + (p.codigo || '')).toLowerCase();
      if(!q.split(' ').every(function(w){ return t.indexOf(w) > -1; })) return;
    }
    r.push(k);
  });
  r.sort(function(a, b){ return (db.productos[a].nombre || '').localeCompare(db.productos[b].nombre || '', 'es'); });
  return r;
}
function renderControlStock(){
  if(rolActual !== 'admin') return;
  var ks = csVisibles(), h = '';
  ks.forEach(function(k){
    var p = db.productos[k], v = csValores[k] === undefined ? '' : csValores[k];
    h += '<tr data-k="' + k + '"><td><strong>' + ctbEsc(p.nombre) + '</strong>' + (p.medida ? '<div style="font-size:11px;color:var(--text3)">' + ctbEsc(p.medida) + '</div>' : '') + '</td>' +
      '<td style="color:var(--text2);font-size:12px">' + ctbEsc(p.categoria || '') + '</td>' +
      '<td style="text-align:right;font-weight:600">' + (p.stock || 0) + ' <span style="font-size:11px;color:var(--text3);font-weight:400">' + ctbEsc(p.unidad || '') + '</span>' + (p.guardado > 0 ? '<div style="font-size:11px;color:var(--text3);font-weight:400">+' + p.guardado + ' guardados (no se cuentan)</div>' : '') + '</td>' +
      '<td style="text-align:right"><input type="text" inputmode="decimal" class="inp cs-in" data-k="' + k + '" value="' + ctbEsc(v) + '" placeholder="—" style="width:90px;text-align:right" oninput="csCambio(this)" onkeydown="csTecla(event,this)"></td>' +
      '<td style="text-align:right;width:90px" id="cs-dif-' + k + '"></td>' +
      '<td><button class="btn btn-sm" title="Está bien, coincide con el sistema" onclick="csIgual(' + k + ')">✔</button></td></tr>';
  });
  document.getElementById('cs-tabla').innerHTML = h || '<tr class="empty-row"><td colspan="6">No hay productos con este filtro</td></tr>';
  ks.forEach(function(k){ csPintarDif(k); });
  csResumen();
  csHistorial();
}
function csPintarDif(k){
  var el = document.getElementById('cs-dif-' + k); if(!el) return;
  var p = db.productos[k], txt = csValores[k];
  if(txt === undefined || txt === ''){ el.innerHTML = ''; return; }
  var n = csNum(txt);
  if(n === null){ el.innerHTML = '<span style="color:var(--red);font-size:12px">número?</span>'; return; }
  var d = Math.round((n - (p.stock || 0)) * 1000) / 1000;
  el.innerHTML = d === 0 ? '<span style="color:var(--green)">✔ igual</span>' : '<strong style="color:' + (d > 0 ? 'var(--blue)' : 'var(--red)') + '">' + (d > 0 ? '+' : '') + d + '</strong>';
}
function csCambio(inp){
  var k = inp.getAttribute('data-k');
  csValores[k] = inp.value;
  csSucio = true;
  csPintarDif(k);
  csResumen();
}
function csIgual(k){
  csValores[k] = String(db.productos[k].stock || 0);
  csSucio = true;
  var inp = document.querySelector('#cs-tabla .cs-in[data-k="' + k + '"]');
  if(inp) inp.value = csValores[k];
  csPintarDif(k); csResumen();
}
function csTecla(e, inp){
  var k = e.key;
  if(k !== 'Enter' && k !== 'ArrowDown' && k !== 'ArrowUp') return;
  e.preventDefault();
  var todos = Array.prototype.slice.call(document.querySelectorAll('#cs-tabla .cs-in'));
  var i = todos.indexOf(inp), dest = todos[i + (k === 'ArrowUp' ? -1 : 1)];
  if(dest){ dest.focus(); dest.select(); }
}
function csCalculo(){
  var cambios = [], iguales = 0, malos = 0;
  Object.keys(csValores).forEach(function(k){
    var txt = csValores[k]; if(txt === '' || txt === undefined) return;
    var p = db.productos[k]; if(!p) return;
    var n = csNum(txt);
    if(n === null){ malos++; return; }
    if(Math.abs(n - (p.stock || 0)) < 0.0005) iguales++; else cambios.push({ k: parseInt(k, 10), nombre: p.nombre, antes: p.stock || 0, despues: n });
  });
  return { cambios: cambios, iguales: iguales, malos: malos };
}
function csResumen(){
  var r = csCalculo();
  var contados = r.cambios.length + r.iguales;
  document.getElementById('cs-resumen').textContent = contados + ' contado' + (contados !== 1 ? 's' : '') + ' · ' + r.cambios.length + ' con diferencia · ' + r.iguales + ' coinciden' + (r.malos ? ' · ' + r.malos + ' con número inválido' : '');
}
function csHistorial(){
  var l = (db.controles_stock || []).slice(-5).reverse();
  var el = document.getElementById('cs-historial');
  if(!l.length){ el.innerHTML = '<div style="color:var(--text3);font-size:13px">Todavía no hiciste ningún control.</div>'; return; }
  el.innerHTML = l.map(function(c){
    return '<details style="margin-bottom:6px"><summary style="cursor:pointer;font-size:13px"><strong>' + ctbEsc(c.fecha) + '</strong> · ' + ctbEsc(c.usuario || '') + ' · ' + (c.cambios || []).length + ' ajuste(s)</summary><div style="font-size:12px;margin:6px 0 0 14px">' +
      ((c.cambios || []).map(function(x){ return ctbEsc(x.nombre) + ': ' + x.antes + ' → ' + x.despues; }).join('<br>') || 'Sin diferencias') + '</div></details>';
  }).join('');
}
function csLimpiar(){
  if(csSucio && !confirm('¿Borrar todo lo que escribiste sin aplicar?')) return;
  csValores = {}; csSucio = false; renderControlStock();
}
async function csAplicar(){
  if(rolActual !== 'admin') return;
  var r = csCalculo();
  if(r.malos){ alert('Hay ' + r.malos + ' cantidad(es) con un número inválido. Corregilas (se marcan con "número?").'); return; }
  if(!r.cambios.length && !r.iguales){ alert('No escribiste ninguna cantidad.'); return; }
  var lineas = r.cambios.slice(0, 15).map(function(x){ return x.nombre + ': ' + x.antes + ' → ' + x.despues; }).join(String.fromCharCode(10));
  var msg = r.cambios.length ? 'Se van a ajustar ' + r.cambios.length + ' producto(s):' + String.fromCharCode(10) + lineas + (r.cambios.length > 15 ? String.fromCharCode(10) + '... y ' + (r.cambios.length - 15) + ' más' : '') + String.fromCharCode(10) + String.fromCharCode(10) + '¿Aplicar el control?' : 'Todo lo que contaste coincide con el sistema. ¿Registrar el control igual?';
  if(!confirm(msg)) return;
  var ahora = new Date();
  r.cambios.forEach(function(x){ db.productos[x.k].stock = x.despues; });
  if(!db.controles_stock) db.controles_stock = [];
  db.controles_stock.push({ fecha: ahora.toLocaleDateString('es-AR') + ' ' + ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }), usuario: (rolActual === 'admin' && !esSocioLogin) ? 'Admin' : (nombreUsuarioActual || ''), contados: r.cambios.length + r.iguales, cambios: r.cambios.map(function(x){ return { nombre: x.nombre, antes: x.antes, despues: x.despues }; }) });
  if(db.controles_stock.length > 60) db.controles_stock = db.controles_stock.slice(-60);
  registrarActividad('producto', 'Control de stock semanal', r.cambios.length + ' ajustes de ' + (r.cambios.length + r.iguales) + ' contados');
  csValores = {}; csSucio = false;
  var ok = await guardar();
  renderControlStock();
  if(typeof renderProductos === 'function') renderProductos();
  renderDashboard();
  if(!ok) alert('El control quedó SOLO en esta computadora: no se pudo guardar en el servidor. No cierres la página y probá de nuevo en unos segundos.');
}

// ---- CONTABILIDAD ----
var CTB_MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
var ctbIniciado = false;
function ctbEsc(t){ return String(t == null ? '' : t).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;'); }
function ctbMoney(n){ return n < 0 ? '-$' + fmt(-n) : '$' + fmt(n); }
function iniciarContabilidad(){
  if(!ctbIniciado){ ctbIniciado = true; ctbPeriodo('mes'); return; }
  renderContabilidad();
}
function ctbPeriodo(tipo){
  var h = new Date(), y = h.getFullYear(), m = h.getMonth(), desde = '', hasta = '';
  if(tipo === 'mes'){ desde = fechaISO(new Date(y, m, 1)); hasta = fechaISO(new Date(y, m + 1, 0)); }
  else if(tipo === 'mesant'){ desde = fechaISO(new Date(y, m - 1, 1)); hasta = fechaISO(new Date(y, m, 0)); }
  else if(tipo === 'anio'){ desde = y + '-01-01'; hasta = y + '-12-31'; }
  document.getElementById('ctb-desde').value = desde;
  document.getElementById('ctb-hasta').value = hasta;
  renderContabilidad();
}
function ctbGrupo(cli){
  if(!cli) return 'Consumidor final';
  var real = db.clientes.find(function(x){ return x.nombre === cli.nombre; });
  var cod = ((real && real.codigo) || cli.codigo || '').toUpperCase();
  if(cod === 'G') return 'Gloria';
  if(cod === 'L') return 'Luis';
  if(cod === 'E') return 'Edgardo';
  if(real && real.lista_precio && real.lista_precio !== 'General') return real.lista_precio;
  return 'Sin asignar / General';
}
// ventas y costo de una boleta (sin la deuda anterior). Sin costo cargado: costo = precio de venta
function ctbBoleta(p){
  var r = { v: 0, c: 0, sinCosto: 0, lineas: [] };
  (p.lineas || []).forEach(function(l){
    var prod = buscarProdDeLinea(l), cant = l.cant || 0, v = cant * (l.precio || 0);
    var tiene = !!(prod && prod.costo > 0);
    var c = cant * (tiene ? prod.costo : (l.precio || 0));
    if(!tiene) r.sinCosto++;
    r.v += v; r.c += c;
    r.lineas.push({ prod: prod, nombre: prod ? prod.nombre : (l.nombre || '?'), cat: (prod && prod.categoria) || 'Sin categoría', cant: cant, v: v, c: c });
  });
  return r;
}
function ctbBarrasH(items, colorVar, fmtVal){
  if(!items.length) return '<div style="color:var(--text3);font-size:13px;padding:6px 0">Sin datos en este período</div>';
  var max = 0; items.forEach(function(x){ if(Math.abs(x.valor) > max) max = Math.abs(x.valor); });
  if(max <= 0) max = 1;
  return items.map(function(x){
    var w = Math.max(1, Math.round(Math.abs(x.valor) / max * 100));
    var col = x.valor < 0 ? 'var(--red)' : colorVar;
    return '<div style="margin-bottom:7px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px"><span>' + ctbEsc(x.label) + '</span><strong>' + (fmtVal ? fmtVal(x.valor) : ctbMoney(x.valor)) + (x.extra ? ' <span style="color:var(--text3);font-weight:400">' + x.extra + '</span>' : '') + '</strong></div>' +
      '<div style="background:var(--bg);border-radius:4px;height:10px"><div style="width:' + w + '%;height:10px;border-radius:4px;background:' + col + '"></div></div></div>';
  }).join('');
}
function ctbBarrasV(meses, series){
  var max = 0;
  meses.forEach(function(m){ series.forEach(function(s){ var v = Math.abs(m[s.key] || 0); if(v > max) max = v; }); });
  if(max <= 0) max = 1;
  var alto = 150;
  var leyenda = '<div style="display:flex;gap:14px;font-size:12px;margin-bottom:8px;flex-wrap:wrap">' + series.map(function(s){ return '<span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + s.color + ';margin-right:4px"></span>' + s.label + '</span>'; }).join('') + '</div>';
  var cols = meses.map(function(m){
    var barras = series.map(function(s){
      var v = m[s.key] || 0, hh = Math.round(Math.abs(v) / max * alto);
      return '<div title="' + s.label + ' ' + ctbMoney(v) + '" style="width:12px;height:' + Math.max(hh, v ? 2 : 0) + 'px;background:' + (v < 0 ? 'var(--red)' : s.color) + ';border-radius:2px 2px 0 0"></div>';
    }).join('');
    return '<div style="flex:1;min-width:34px;text-align:center"><div style="height:' + alto + 'px;display:flex;align-items:flex-end;justify-content:center;gap:2px">' + barras + '</div><div style="font-size:11px;color:var(--text3);margin-top:4px">' + m.label + '</div></div>';
  }).join('');
  return leyenda + '<div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:4px">' + cols + '</div>';
}
function ctbTabla(filas, cabeza, alineaDerecha){
  var h = '<table style="width:100%;font-size:13px"><thead><tr>' + cabeza.map(function(c, i){ return '<th' + (alineaDerecha && i > 0 ? ' style="text-align:right"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
  h += filas.map(function(f){
    return '<tr' + (f.negrita ? ' style="font-weight:700;background:var(--bg)"' : '') + '>' + f.celdas.map(function(c, i){ return '<td' + (alineaDerecha && i > 0 ? ' style="text-align:right"' : '') + '>' + c + '</td>'; }).join('') + '</tr>';
  }).join('');
  return h + '</tbody></table>';
}
var ctbUltimo = null;
function renderContabilidad(){
  if(rolActual !== 'admin') return;
  var desde = document.getElementById('ctb-desde').value, hasta = document.getElementById('ctb-hasta').value;
  function enRango(iso){ if(!iso) return false; if(desde && iso < desde) return false; if(hasta && iso > hasta) return false; return true; }
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  // ---- ventas del período
  var ventas = 0, costo = 0, nBol = 0, sinCosto = 0;
  var porCliente = {}, porProd = {}, porGrupo = {}, porCat = {};
  db.presupuestos.forEach(function(p){
    if(p.estado === 'Rechazado' || p.estado === 'Vencido') return;
    if(!enRango(p.fecha)) return;
    var b = ctbBoleta(p);
    ventas += b.v; costo += b.c; nBol++; sinCosto += b.sinCosto;
    var cn = p.cliente ? p.cliente.nombre : 'Consumidor final';
    var fc = porCliente[cn] || (porCliente[cn] = { nombre: cn, v: 0, g: 0, n: 0 }); fc.v += b.v; fc.g += b.v - b.c; fc.n++;
    var gn = ctbGrupo(p.cliente);
    var fg = porGrupo[gn] || (porGrupo[gn] = { nombre: gn, v: 0, g: 0 }); fg.v += b.v; fg.g += b.v - b.c;
    b.lineas.forEach(function(l){
      var fp = porProd[l.nombre] || (porProd[l.nombre] = { nombre: l.nombre, uni: 0, v: 0, g: 0 }); fp.uni += l.cant; fp.v += l.v; fp.g += l.v - l.c;
      var ft = porCat[l.cat] || (porCat[l.cat] = { nombre: l.cat, v: 0, g: 0 }); ft.v += l.v; ft.g += l.v - l.c;
    });
  });
  var gananciaBruta = ventas - costo;
  // ---- caja del período
  var entradas = 0, salidas = 0, porMedio = {}, gastos = [];
  (db.caja || []).forEach(function(m){
    var dt = parseFechaAR(m.fecha); if(!dt || !enRango(fechaISO(dt))) return;
    var med = m.medio || 'Otro'; var fm = porMedio[med] || (porMedio[med] = { ent: 0, sal: 0 });
    if(m.tipo === 'entrada'){ entradas += m.monto; fm.ent += m.monto; } else { salidas += m.monto; fm.sal += m.monto; gastos.push(m); }
  });
  var resultado = gananciaBruta - salidas;
  // ---- balance a hoy
  var efectivo = 0, banco = 0;
  (db.caja || []).forEach(function(m){
    var s = (m.tipo === 'entrada' ? 1 : -1) * m.monto;
    if(m.medio === 'Efectivo') efectivo += s; else banco += s;
  });
  var porCobrar = 0, aFavor = 0, deudores = {}, aging = [0, 0, 0, 0, 0], nDeudas = 0;
  db.presupuestos.forEach(function(p){
    if(p.estado === 'Rechazado' || p.estado === 'Vencido') return;
    var sd = saldoPendienteBoleta(p);
    if(sd < -0.01){ aFavor += -sd; return; }
    if(sd > 0.01 && p.estado === 'Pendiente'){
      porCobrar += sd; nDeudas++;
      var cn = p.cliente ? p.cliente.nombre : 'Consumidor final';
      deudores[cn] = (deudores[cn] || 0) + sd;
      var dias = p.fecha ? Math.floor((hoy - new Date(p.fecha + 'T12:00:00')) / 86400000) : 0;
      var k = dias <= 7 ? 0 : dias <= 15 ? 1 : dias <= 30 ? 2 : dias <= 60 ? 3 : 4;
      aging[k] += sd;
    }
  });
  var stockCosto = 0, stockVenta = 0, prodSinCosto = 0, stockItems = [];
  db.productos.forEach(function(pr){
    var st = Math.max(0, pr.stock || 0);
    if(pr.costo > 0){ stockCosto += st * pr.costo; stockItems.push({ label: pr.nombre, valor: st * pr.costo, extra: st + ' u. x ' + ctbMoney(pr.costo) }); } else if(st > 0) prodSinCosto++;
    stockVenta += st * getPrecioGeneral(pr);
  });
  var totalActivo = efectivo + banco + porCobrar + stockCosto;
  var patrimonio = totalActivo - aFavor;
  // ---- últimos 12 meses
  var meses = [];
  for(var i = 11; i >= 0; i--){
    var f = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ key: f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0'), label: CTB_MESES[f.getMonth()] + (f.getMonth() === 0 ? ' ' + String(f.getFullYear()).slice(2) : ''), v: 0, g: 0, ent: 0, sal: 0 });
  }
  var mapaM = {}; meses.forEach(function(m){ mapaM[m.key] = m; });
  db.presupuestos.forEach(function(p){
    if(p.estado === 'Rechazado' || p.estado === 'Vencido' || !p.fecha) return;
    var m = mapaM[p.fecha.slice(0, 7)]; if(!m) return;
    var b = ctbBoleta(p); m.v += b.v; m.g += b.v - b.c;
  });
  (db.caja || []).forEach(function(c){
    var dt = parseFechaAR(c.fecha); if(!dt) return;
    var m = mapaM[fechaISO(dt).slice(0, 7)]; if(!m) return;
    if(c.tipo === 'entrada') m.ent += c.monto; else m.sal += c.monto;
  });
  // ---- dibujar
  var pct = function(a, b){ return b > 0 ? (a / b * 100).toFixed(1) + '%' : '—'; };
  var kpi = function(label, val, sub, cls, color){ return '<div class="stat-card ' + (cls || '') + '"><div class="slabel">' + label + '</div><div class="svalue" style="font-size:20px' + (color ? ';color:' + color : '') + '">' + val + '</div><div class="ssub">' + (sub || '&nbsp;') + '</div></div>'; };
  document.getElementById('ctb-kpis').innerHTML =
    kpi('Ventas', ctbMoney(ventas), nBol + ' boletas · ticket prom. ' + ctbMoney(nBol ? ventas / nBol : 0), 'stat-blue') +
    kpi('Costo de lo vendido', ctbMoney(costo), sinCosto ? sinCosto + ' línea(s) sin costo (se toman a precio de venta)' : '') +
    kpi('Ganancia bruta', ctbMoney(gananciaBruta), 'Margen ' + pct(gananciaBruta, ventas), 'stat-green') +
    kpi('Gastos y retiros (caja)', ctbMoney(salidas), 'Salidas de Caja del período', '', 'var(--red)') +
    kpi('Resultado del período', ctbMoney(resultado), 'Ganancia bruta − gastos', resultado >= 0 ? 'stat-green' : '', resultado < 0 ? 'var(--red)' : '') +
    kpi('Cobrado (entradas de caja)', ctbMoney(entradas), 'Neto de caja: ' + ctbMoney(entradas - salidas), 'stat-amber');
  document.getElementById('ctb-resultados').innerHTML = ctbTabla([
    { celdas: ['Ventas (sin deuda anterior)', ctbMoney(ventas)] },
    { celdas: ['(−) Costo de la mercadería vendida', ctbMoney(-costo)] },
    { celdas: ['= Ganancia bruta', ctbMoney(gananciaBruta) + ' (' + pct(gananciaBruta, ventas) + ')'], negrita: true },
    { celdas: ['(−) Gastos y retiros (salidas de Caja)', ctbMoney(-salidas)] },
    { celdas: ['= Resultado del período', ctbMoney(resultado)], negrita: true }
  ], ['Estado de resultados', 'Importe'], true);
  document.getElementById('ctb-balance').innerHTML = ctbTabla([
    { celdas: ['Caja en efectivo', ctbMoney(efectivo)] },
    { celdas: ['Banco / transferencias / tarjetas', ctbMoney(banco)] },
    { celdas: ['Cuentas a cobrar (Deudores)', ctbMoney(porCobrar) + ' · ' + nDeudas + ' boletas'] },
    { celdas: ['Mercadería en stock (a costo)', ctbMoney(stockCosto)] },
    { celdas: ['TOTAL ACTIVO', ctbMoney(totalActivo)], negrita: true },
    { celdas: ['Saldos a favor de clientes', ctbMoney(aFavor)] },
    { celdas: ['TOTAL PASIVO', ctbMoney(aFavor)], negrita: true },
    { celdas: ['PATRIMONIO NETO (activo − pasivo)', ctbMoney(patrimonio)], negrita: true }
  ], ['Balance a hoy', 'Importe'], true) +
    '<div style="font-size:12px;color:var(--text3);margin-top:8px">Stock a precio de venta: ' + ctbMoney(stockVenta) + ' (ganancia potencial ' + ctbMoney(stockVenta - stockCosto) + ').' + (prodSinCosto ? ' ' + prodSinCosto + ' producto(s) con stock no tienen costo cargado y no suman al stock a costo.' : '') + ' No se cargan deudas con proveedores porque el sistema no las registra.</div>';
  document.getElementById('ctb-g-meses').innerHTML = ctbBarrasV(meses, [{ key: 'v', label: 'Ventas', color: '#185FA5' }, { key: 'g', label: 'Ganancia bruta', color: '#3B6D11' }]);
  document.getElementById('ctb-g-caja').innerHTML = ctbBarrasV(meses, [{ key: 'ent', label: 'Entradas', color: '#3B6D11' }, { key: 'sal', label: 'Salidas', color: '#A32D2D' }]);
  var arr = function(o){ return Object.keys(o).map(function(k){ return o[k]; }); };
  document.getElementById('ctb-g-grupos').innerHTML = ctbBarrasH(arr(porGrupo).sort(function(a, b){ return b.v - a.v; }).map(function(x){ return { label: x.nombre, valor: x.v, extra: pct(x.v, ventas) + ' · gan. ' + ctbMoney(x.g) }; }), '#185FA5');
  document.getElementById('ctb-g-clientes').innerHTML = ctbBarrasH(arr(porCliente).sort(function(a, b){ return b.v - a.v; }).slice(0, 10).map(function(x){ return { label: x.nombre, valor: x.v, extra: x.n + ' bol.' }; }), '#185FA5');
  document.getElementById('ctb-g-productos').innerHTML = ctbBarrasH(arr(porProd).sort(function(a, b){ return b.g - a.g; }).slice(0, 10).map(function(x){ return { label: x.nombre, valor: x.g, extra: Math.round(x.uni) + ' u.' }; }), '#3B6D11');
  document.getElementById('ctb-g-categorias').innerHTML = ctbBarrasH(arr(porCat).sort(function(a, b){ return b.v - a.v; }).map(function(x){ return { label: x.nombre, valor: x.v, extra: 'gan. ' + ctbMoney(x.g) }; }), '#854F0B');
  document.getElementById('ctb-g-stock').innerHTML = ctbBarrasH(stockItems.sort(function(a, b){ return b.valor - a.valor; }).slice(0, 10), '#7B3FB0');
  var etiq = ['0 a 7 días', '8 a 15 días', '16 a 30 días', '31 a 60 días', 'Más de 60 días'];
  document.getElementById('ctb-g-aging').innerHTML = ctbBarrasH(aging.map(function(v, i){ return { label: etiq[i], valor: v, extra: pct(v, porCobrar) }; }), '#A32D2D');
  document.getElementById('ctb-g-deudores').innerHTML = ctbBarrasH(Object.keys(deudores).map(function(k){ return { label: k, valor: deudores[k] }; }).sort(function(a, b){ return b.valor - a.valor; }).slice(0, 10), '#A32D2D');
  document.getElementById('ctb-g-medios').innerHTML = ctbTabla(Object.keys(porMedio).map(function(k){ return { celdas: [ctbEsc(k), ctbMoney(porMedio[k].ent), ctbMoney(porMedio[k].sal), ctbMoney(porMedio[k].ent - porMedio[k].sal)] }; }), ['Medio', 'Entradas', 'Salidas', 'Neto'], true);
  document.getElementById('ctb-g-gastos').innerHTML = gastos.length ? ctbTabla(gastos.slice().sort(function(a, b){ return b.monto - a.monto; }).slice(0, 10).map(function(m){ return { celdas: [ctbEsc(m.fecha + ' — ' + (m.desc || '')), ctbMoney(m.monto)] }; }), ['Mayores salidas del período', 'Importe'], true) : '<div style="color:var(--text3);font-size:13px">Sin salidas de caja en este período</div>';
  ctbUltimo = { desde: desde, hasta: hasta, ventas: ventas, costo: costo, gananciaBruta: gananciaBruta, salidas: salidas, resultado: resultado, entradas: entradas, efectivo: efectivo, banco: banco, porCobrar: porCobrar, stockCosto: stockCosto, totalActivo: totalActivo, aFavor: aFavor, patrimonio: patrimonio, meses: meses, clientes: arr(porCliente), productos: arr(porProd), grupos: arr(porGrupo), deudores: deudores };
}
function descargarContabilidad(){
  if(rolActual !== 'admin' || !ctbUltimo) return;
  var r = ctbUltimo, NL = String.fromCharCode(13, 10), Q = String.fromCharCode(34);
  function cel(v){ return Q + String(v).split(Q).join(Q + Q) + Q; }
  function num(n){ return (Math.round(n * 100) / 100).toFixed(2).replace('.', ','); }
  function fa(iso){ return iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-AR') : ''; }
  var o = [];
  o.push(cel('Contabilidad Distribuidora HAP') + ';' + cel('Del ' + (fa(r.desde) || 'inicio') + ' al ' + (fa(r.hasta) || 'hoy')));
  o.push('');
  o.push(cel('ESTADO DE RESULTADOS') + ';');
  o.push(cel('Ventas') + ';' + num(r.ventas));
  o.push(cel('Costo de la mercaderia vendida') + ';' + num(r.costo));
  o.push(cel('Ganancia bruta') + ';' + num(r.gananciaBruta));
  o.push(cel('Gastos y retiros (salidas de caja)') + ';' + num(r.salidas));
  o.push(cel('Resultado del periodo') + ';' + num(r.resultado));
  o.push('');
  o.push(cel('BALANCE A HOY') + ';');
  o.push(cel('Caja en efectivo') + ';' + num(r.efectivo));
  o.push(cel('Banco / transferencias / tarjetas') + ';' + num(r.banco));
  o.push(cel('Cuentas a cobrar') + ';' + num(r.porCobrar));
  o.push(cel('Mercaderia en stock a costo') + ';' + num(r.stockCosto));
  o.push(cel('TOTAL ACTIVO') + ';' + num(r.totalActivo));
  o.push(cel('Saldos a favor de clientes (pasivo)') + ';' + num(r.aFavor));
  o.push(cel('PATRIMONIO NETO') + ';' + num(r.patrimonio));
  o.push('');
  o.push(cel('VENTAS Y GANANCIA POR MES (ultimos 12)') + ';' + cel('Ventas') + ';' + cel('Ganancia bruta') + ';' + cel('Entradas caja') + ';' + cel('Salidas caja'));
  r.meses.forEach(function(m){ o.push(cel(m.key) + ';' + num(m.v) + ';' + num(m.g) + ';' + num(m.ent) + ';' + num(m.sal)); });
  o.push('');
  o.push(cel('VENTAS POR GRUPO') + ';' + cel('Ventas') + ';' + cel('Ganancia'));
  r.grupos.sort(function(a, b){ return b.v - a.v; }).forEach(function(x){ o.push(cel(x.nombre) + ';' + num(x.v) + ';' + num(x.g)); });
  o.push('');
  o.push(cel('CLIENTES') + ';' + cel('Ventas') + ';' + cel('Ganancia') + ';' + cel('Boletas'));
  r.clientes.sort(function(a, b){ return b.v - a.v; }).forEach(function(x){ o.push(cel(x.nombre) + ';' + num(x.v) + ';' + num(x.g) + ';' + x.n); });
  o.push('');
  o.push(cel('PRODUCTOS') + ';' + cel('Unidades') + ';' + cel('Ventas') + ';' + cel('Ganancia'));
  r.productos.sort(function(a, b){ return b.g - a.g; }).forEach(function(x){ o.push(cel(x.nombre) + ';' + num(x.uni) + ';' + num(x.v) + ';' + num(x.g)); });
  o.push('');
  o.push(cel('DEUDORES') + ';' + cel('Saldo'));
  Object.keys(r.deudores).sort(function(a, b){ return r.deudores[b] - r.deudores[a]; }).forEach(function(k){ o.push(cel(k) + ';' + num(r.deudores[k])); });
  var blob = new Blob([String.fromCharCode(0xFEFF) + o.join(NL)], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'contabilidad-' + (r.desde || 'inicio') + '-a-' + (r.hasta || 'hoy') + '.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
}

// ---- VENTAS ----
var ventasInit = false;
function isoLocal(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function iniciarVentas(){
  if(!ventasInit){
    ventasInit = true;
    var hoy = new Date();
    document.getElementById('ventas-desde').value = isoLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
    document.getElementById('ventas-hasta').value = isoLocal(hoy);
  }
  renderVentas();
}
function setPeriodoVentas(tipo, el){
  var hoy = new Date();
  var desde = '', hasta = '';
  if(tipo === 'hoy'){ desde = isoLocal(hoy); hasta = isoLocal(hoy); }
  else if(tipo === 'semana'){
    var lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    desde = isoLocal(lunes); hasta = isoLocal(hoy);
  }
  else if(tipo === 'mes'){
    desde = isoLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 1)); hasta = isoLocal(hoy);
  }
  else if(tipo === 'mespasado'){
    desde = isoLocal(new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1));
    hasta = isoLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 0));
  }
  ventasInit = true;
  document.getElementById('ventas-desde').value = desde;
  document.getElementById('ventas-hasta').value = hasta;
  document.querySelectorAll('#ventas .filtro-btn').forEach(function(b){ b.classList.remove('active'); });
  if(el) el.classList.add('active');
  renderVentas();
}
function ventasFechasManual(){
  document.querySelectorAll('#ventas .filtro-btn').forEach(function(b){ b.classList.remove('active'); });
  renderVentas();
}
function buscarProdDeLinea(l){
  var i = prodDeLinea(l);
  if(i >= 0) return db.productos[i];
  return db.productos.find(function(pr){
    return (pr.nombre + (pr.medida ? ' – ' + pr.medida : '')) === l.nombre;
  });
}
function sincronizarNombresBoletas(){
  var n = 0, boletas = 0;
  (db.presupuestos || []).forEach(function(b){
    var t = false;
    (b.lineas || []).forEach(function(l){
      if(!l.pid && !l.cod) return;
      var i = prodDeLinea(l);
      if(i >= 0 && db.productos[i].nombre !== l.nombre){ l.nombre = db.productos[i].nombre; n++; t = true; }
    });
    if(t) boletas++;
  });
  return { lineas: n, boletas: boletas };
}
function renderVentas(){
  var desde = document.getElementById('ventas-desde').value;
  var hasta = document.getElementById('ventas-hasta').value;
  var estado = document.getElementById('ventas-estado').value;
  var q = (document.getElementById('ventas-buscar').value || '').toLowerCase().trim();
  var filas = {};
  var totVenta = 0, totCosto = 0, totUni = 0, nBoletas = 0;
  var lineasSinCosto = 0;
  db.presupuestos.forEach(function(p){
    if(!p.fecha) return;
    if(desde && p.fecha < desde) return;
    if(hasta && p.fecha > hasta) return;
    if(estado === 'aprobado' && p.estado !== 'Aprobado') return;
    if(estado === 'activas' && (p.estado === 'Rechazado' || p.estado === 'Vencido')) return;
    var cuenta = false;
    (p.lineas || []).forEach(function(l){
      var prod = buscarProdDeLinea(l);
      if(q && ((prod ? prod.nombre : '') + ' ' + (l.nombre || '')).toLowerCase().indexOf(q) === -1) return;
      cuenta = true;
      var costoReal = prod ? (prod.costo || 0) : 0;
      var costoU = costoReal > 0 ? costoReal : (l.precio || 0);
      var cant = l.cant || 0;
      var venta = cant * (l.precio || 0);
      var key = prod ? 'P|' + prod.codigo + '|' + prod.nombre : l.nombre;
      if(!filas[key]) filas[key] = { nombre: prod ? prod.nombre : l.nombre, unidad: prod ? (prod.unidad || '') : '', uni: 0, venta: 0, costo: 0, sinCosto: false };
      var f = filas[key];
      f.uni += cant;
      f.venta += venta;
      f.costo += cant * costoU;
      if(!(costoReal > 0)){ f.sinCosto = true; lineasSinCosto++; }
      totVenta += venta;
      totCosto += cant * costoU;
      totUni += cant;
    });
    if(cuenta) nBoletas++;
  });
  var lista = Object.keys(filas).map(function(k){ return filas[k]; });
  lista.sort(function(a, b){ return b.uni - a.uni; });
  var gan = totVenta - totCosto;
  var margen = totVenta > 0 ? (gan / totVenta * 100).toFixed(1) : '0.0';
  document.getElementById('v-venta').textContent = '$' + fmt(totVenta);
  document.getElementById('v-boletas').textContent = nBoletas + (nBoletas === 1 ? ' boleta' : ' boletas');
  document.getElementById('v-costo').textContent = '$' + fmt(totCosto);
  document.getElementById('v-ganancia').textContent = '$' + fmt(gan);
  document.getElementById('v-margen').textContent = 'Margen: ' + margen + '%';
  document.getElementById('v-unidades').textContent = totUni.toLocaleString('es-AR');
  document.getElementById('v-productos').textContent = lista.length + (lista.length === 1 ? ' producto distinto' : ' productos distintos');
  var aviso = document.getElementById('v-aviso');
  var sinCosto = lista.filter(function(f){ return f.sinCosto; }).length;
  if(sinCosto){
    aviso.style.display = 'block';
    aviso.textContent = '⚠️ ' + sinCosto + (sinCosto === 1 ? ' producto no tiene' : ' productos no tienen') + ' precio de costo cargado (o ya no existe en Productos). Para esos productos se tomó como costo el mismo precio de venta, o sea que no suman ganancia (ganancia $0).';
  } else {
    aviso.style.display = 'none';
  }
  var t = document.getElementById('tabla-ventas');
  if(!lista.length){
    t.innerHTML = '<tr class="empty-row"><td colspan="6">Sin ventas en este período</td></tr>';
    return;
  }
  var html = lista.map(function(f){
    var g = f.venta - f.costo;
    var col = g > 0 ? 'var(--green)' : (g < 0 ? 'var(--red)' : 'var(--text2)');
    var m = f.venta > 0 ? (g / f.venta * 100).toFixed(1) + '%' : '—';
    return '<tr>' +
      '<td><strong>' + f.nombre + '</strong></td>' +
      '<td>' + f.uni.toLocaleString('es-AR') + ' <span style="font-size:11px;color:var(--text3)">' + f.unidad + '</span></td>' +
      '<td>$' + fmt(f.venta) + '</td>' +
      '<td>' + ('$' + fmt(f.costo) + (f.sinCosto ? ' <span style="font-size:11px;color:var(--text3)">(sin costo = venta)</span>' : '')) + '</td>' +
      '<td style="font-weight:600;color:' + col + '">$' + fmt(g) + '</td>' +
      '<td style="font-size:12px;color:' + col + '">' + m + '</td>' +
    '</tr>';
  }).join('');
  html += '<tr style="background:var(--bg);font-weight:700">' +
    '<td>TOTAL</td>' +
    '<td>' + totUni.toLocaleString('es-AR') + '</td>' +
    '<td>$' + fmt(totVenta) + '</td>' +
    '<td>$' + fmt(totCosto) + '</td>' +
    '<td style="color:var(--green)">$' + fmt(gan) + '</td>' +
    '<td>' + margen + '%</td>' +
  '</tr>';
  t.innerHTML = html;
}

// ---- ACTIVIDAD ----
let filtroActividad = '';
function setFiltroActividad(tipo, el){
  filtroActividad = tipo;
  document.querySelectorAll('#actividad .filtro-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderActividad();
}
function renderActividad(){
  if(!db.actividad) db.actividad=[];
  const lista = filtroActividad
    ? db.actividad.filter(a=>a.tipo===filtroActividad)
    : db.actividad;
  const t = document.getElementById('tabla-actividad');
  if(!lista.length){
    t.innerHTML='<tr class="empty-row"><td colspan="4">Sin actividad registrada</td></tr>';
    return;
  }
  const iconos = { presupuesto:'🧾', pago:'💲', eliminacion:'🗑️' };
  t.innerHTML = lista.map(a=>\`<tr>
    <td style="font-size:12px;white-space:nowrap">\${a.fecha} \${a.hora}</td>
    <td><span class="badge \${a.usuario==='Admin'?'badge-blue':'badge-ok'}">\${a.usuario}</span></td>
    <td>\${iconos[a.tipo]||'•'} <strong>\${a.accion}</strong></td>
    <td style="font-size:12px;color:var(--text2)">\${a.detalle||''}</td>
  </tr>\`).join('');
}

// Botón actualizar en el sidebar se renderiza en aplicarRol
// NO hay auto-sync automático - solo manual

// Arrancar en pantalla de login
// Auto-sync cada 30 segundos - solo baja del servidor, no pisa si se está guardando
setInterval(async () => {
  if(!rolActual) return; // solo si está logueado
  if(guardandoEnServidor) return; // no interferir si se está guardando
  if(planillaSucia || listasSucia || pgSucia || csSucio || cgSucio) return; // no pisar una planilla de costos con cambios sin guardar
  if(snapSync !== null && armarDelta().hay){
    // hay cambios que no llegaron al servidor: reintentar antes de bajar nada (si no, se perderian)
    var okRe = await guardar();
    if(!okRe){
      try{ var rh = await fetch(API + '/health'); if(rh.ok && servidorConectado === false) avisoServidor(true); }catch(e){}
      return;
    }
  }
  await cargarDesdeServidor();
  try {
    const secActiva = document.querySelector('.section.active')?.id;
    const renders = {
      dashboard: renderDashboard,
      productos: ()=>renderProductos(),
      clientes: ()=>renderClientes(),
      presupuestos: renderPresupuestos,
      entrega: renderEntrega,
      deudores: renderDeudores,
      afavor: renderAfavor,
      caja: renderCaja,
      proveedores: renderProveedores,
      actividad: renderActividad
    };
    if(secActiva && renders[secActiva]) renders[secActiva]();
  } catch(e){ console.warn('Error en auto-sync:', e); }
}, 30 * 1000);

// Arrancar: cargar local (rápido) luego servidor, después mostrar login
cargar();
renderLoginEmpleados();
cargarLoginInfo(); // los datos del sistema se bajan recien despues de ingresar
</script>
</body>
</html>
`;

// ---- Guardado por cambios (delta): cada compu manda solo lo que cambio y el servidor lo aplica sobre lo ultimo que hay ----
function cajaStampIds(arr){
  const vistos = {};
  (arr || []).forEach(m => {
    if(!m || m.id) return;
    const sig = [m.fecha, m.tipo, m.medio, m.desc, m.monto].join('|');
    vistos[sig] = (vistos[sig] || 0) + 1;
    m.id = 'L|' + sig + '|' + vistos[sig];
  });
}
function aplicarDelta(actual, d){
  const key = d.key, mapa = {}, orden = [];
  (Array.isArray(actual) ? actual : []).forEach(r => {
    if(!r || r[key] === undefined || r[key] === null) return;
    const k = String(r[key]); if(!(k in mapa)) orden.push(k); mapa[k] = r;
  });
  (d.deletes || []).forEach(k => { delete mapa[String(k)]; });
  (d.upserts || []).forEach(r => {
    const k = String(r[key]); if(!(k in mapa)) orden.push(k); mapa[k] = r;
  });
  return orden.filter(k => k in mapa).map(k => mapa[k]);
}
// Dos personas pueden crear boletas a la vez con el mismo numero: la que llega segunda recibe otro numero (antes pisaba a la primera)
function renumerarColisiones(actual, d){
  const out = [], porNum = {}; let max = 0;
  (Array.isArray(actual) ? actual : []).forEach(r => { if(!r) return; porNum[String(r.numero)] = r; if(typeof r.numero === 'number' && r.numero > max) max = r.numero; });
  (d.upserts || []).forEach(r => { if(r && typeof r.numero === 'number' && r.numero > max) max = r.numero; });
  (d.upserts || []).forEach(r => {
    if(!r || !r.uid) return;
    const ex = porNum[String(r.numero)];
    if(ex && ex.uid !== r.uid){
      const de = r.numero; max += 1; r.numero = max; out.push({ uid: r.uid, de: de, a: max });
      porNum[String(max)] = r;
    } else porNum[String(r.numero)] = r;
  });
  return out;
}
async function leerTabla(t){
  const { data, error } = await supabase.from('hap_data').select('valor').eq('tabla', t).maybeSingle();
  if(error) throw new Error(error.message);
  return data ? data.valor : null;
}
async function escribirTabla(t, v){
  const { error } = await supabase.from('hap_data').upsert({ tabla: t, valor: v }, { onConflict: 'tabla' });
  if(error) throw new Error(error.message);
}
let dbLock = Promise.resolve();
function conLock(fn){ const p = dbLock.then(fn, fn); dbLock = p.catch(() => {}); return p; }

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.send(HTML);
});

// ================= SEGURIDAD =================
const crypto = require('crypto');
const TABLAS_OCULTAS = (t) => t === 'auth' || String(t).indexOf('backup_') === 0;
const TABLAS_TODOS = ['recordatorios', 'presupuestos', 'productos', 'clientes', 'actividad', 'contador', 'proveedores', 'caja'];
const NIVELES_POR_DEFECTO = { hugo: 'caja', ale: 'caja', tute: 'socio' };
function nivelDe(emp){
  if(emp && emp.nivel) return emp.nivel;
  const n = emp && emp.nombre ? String(emp.nombre).trim().toLowerCase() : '';
  return NIVELES_POR_DEFECTO[n] || 'empleado';
}
const esAdminNivel = (n) => n === 'admin' || n === 'socio';

function hashPass(p){
  const salt = crypto.randomBytes(16).toString('hex');
  return { salt, h: crypto.scryptSync(String(p), salt, 64).toString('hex') };
}
function checkPass(p, rec){
  if(!rec || !rec.salt || !rec.h) return false;
  const a = crypto.scryptSync(String(p), rec.salt, 64), b = Buffer.from(rec.h, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Credenciales: viven en la tabla "auth", que nunca se manda al navegador
let authCache = null;
async function cargarAuth(){
  if(authCache) return authCache;
  let a = await leerTabla('auth');
  if(!a || typeof a !== 'object') a = {};
  if(!a.empleados) a.empleados = {};
  if(!a.secret) a.secret = crypto.randomBytes(32).toString('hex');
  authCache = a;
  return a;
}
async function guardarAuth(){ await escribirTabla('auth', authCache); }
// Pasa las contraseñas viejas (texto plano) a hash y las borra de los datos
let authMigrado = false;
async function asegurarAuth(){
  const a = await cargarAuth();
  if(authMigrado) return a;
  let cambio = false;
  const cfg = await leerTabla('config');
  if(!a.admin){
    const plana = (cfg && cfg.password) ? String(cfg.password) : '1234';
    a.admin = hashPass(plana);
    cambio = true;
  }
  if(cfg && cfg.password !== undefined){ const c2 = Object.assign({}, cfg); delete c2.password; await escribirTabla('config', c2); }
  const emps = await leerTabla('empleados');
  if(Array.isArray(emps) && emps.some(e => e && e.pass !== undefined)){
    emps.forEach(e => {
      if(!e) return;
      const k = String(e.nombre || '').trim().toLowerCase();
      if(e.pass && !a.empleados[k]){ a.empleados[k] = hashPass(e.pass); cambio = true; }
    });
    await escribirTabla('empleados', emps.map(e => { const c = Object.assign({}, e); delete c.pass; return c; }));
  }
  if(cambio || !a.guardado){ a.guardado = true; await guardarAuth(); }
  authMigrado = true;
  return a;
}
const SECRETO_ENV = process.env.SESSION_SECRET || '';
function firmar(payload){
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const s = crypto.createHmac('sha256', SECRETO_ENV || authCache.secret).update(b).digest('base64url');
  return b + '.' + s;
}
function leerToken(t){
  try {
    const [b, s] = String(t || '').split('.');
    if(!b || !s || !authCache) return null;
    const esp = crypto.createHmac('sha256', SECRETO_ENV || authCache.secret).update(b).digest('base64url');
    if(s.length !== esp.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(esp))) return null;
    const p = JSON.parse(Buffer.from(b, 'base64url').toString());
    if(!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch(e){ return null; }
}
async function requerirAuth(req, res, next){
  try { await cargarAuth(); } catch(e){ return res.status(500).json({ error: 'No se pudo verificar la sesión' }); }
  const h = req.headers.authorization || '';
  const u = leerToken(h.indexOf('Bearer ') === 0 ? h.slice(7) : '');
  if(!u) return res.status(401).json({ error: 'Sesión vencida o inválida' });
  req.user = u; next();
}
// Freno a la fuerza bruta: 5 errores seguidos = 10 minutos bloqueado
const intentos = new Map();
function estaBloqueado(ip){ const r = intentos.get(ip); return r && r.hasta && r.hasta > Date.now(); }
function falloLogin(ip){
  const r = intentos.get(ip) || { n: 0 };
  r.n++; if(r.n >= 5){ r.hasta = Date.now() + 10 * 60 * 1000; r.n = 0; }
  intentos.set(ip, r);
}

app.get('/api/public/login-info', async (req, res) => {
  try {
    await conLock(asegurarAuth);
    const emps = (await leerTabla('empleados')) || [];
    res.json({ empleados: emps.filter(e => e && e.nombre).map(e => ({ nombre: e.nombre, tienePass: !!authCache.empleados[String(e.nombre).trim().toLowerCase()] })) });
  } catch(e){ res.status(500).json({ error: 'No se pudo leer' }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const ip = req.ip || 'x';
    if(estaBloqueado(ip)) return res.status(429).json({ error: 'Demasiados intentos. Esperá 10 minutos.' });
    await conLock(asegurarAuth);
    const { tipo, nombre, password } = req.body || {};
    const pass = String(password == null ? '' : password);
    let usuario = null;
    if(tipo === 'admin'){
      if(checkPass(pass, authCache.admin)) usuario = { nivel: 'admin', nombre: 'Admin', codigo: '', claveDefault: pass === '1234' };
    } else {
      const emps = (await leerTabla('empleados')) || [];
      const emp = emps.find(e => e && e.nombre === nombre);
      if(emp){
        const rec = authCache.empleados[String(emp.nombre).trim().toLowerCase()];
        if(!rec || checkPass(pass, rec)) usuario = { nivel: nivelDe(emp), nombre: emp.nombre, codigo: emp.codigo || '' };
      }
    }
    if(!usuario){ falloLogin(ip); return res.status(401).json({ error: 'Contraseña incorrecta' }); }
    intentos.delete(ip);
    const token = firmar({ nivel: usuario.nivel, nombre: usuario.nombre, exp: Date.now() + 12 * 3600 * 1000 });
    res.json({ token, nivel: usuario.nivel, nombre: usuario.nombre, codigo: usuario.codigo, claveDefault: !!usuario.claveDefault });
  } catch(e){ console.error('login error:', e.message); res.status(500).json({ error: 'Error al iniciar sesión' }); }
});

// Cambiar contraseñas (solo desde el servidor, nunca viajan guardadas en los datos)
app.post('/api/auth/admin', requerirAuth, async (req, res) => {
  try {
    if(req.user.nivel !== 'admin') return res.status(403).json({ error: 'Solo el administrador' });
    const nueva = String((req.body && req.body.nueva) || '');
    if(nueva.length < 4) return res.status(400).json({ error: 'La contraseña tiene que tener al menos 4 caracteres' });
    await conLock(async () => { const a = await cargarAuth(); a.admin = hashPass(nueva); await guardarAuth(); });
    res.json({ ok: true });
  } catch(e){ res.status(500).json({ error: e.message }); }
});
app.post('/api/auth/empleado', requerirAuth, async (req, res) => {
  try {
    if(!esAdminNivel(req.user.nivel)) return res.status(403).json({ error: 'Sin permiso' });
    const { nombre, anterior, pass, quitar } = req.body || {};
    if(!nombre) return res.status(400).json({ error: 'Falta el nombre' });
    await conLock(async () => {
      const a = await cargarAuth();
      const k = String(nombre).trim().toLowerCase(), ka = String(anterior || nombre).trim().toLowerCase();
      const emps = (await leerTabla('empleados')) || [];
      const objetivo = emps.find(e => e && String(e.nombre).trim().toLowerCase() === ka);
      if(objetivo && nivelDe(objetivo) === 'socio' && req.user.nivel !== 'admin') throw Object.assign(new Error('Solo el administrador puede modificar a un socio'), { codigo: 403 });
      if(ka !== k && a.empleados[ka]){ a.empleados[k] = a.empleados[ka]; delete a.empleados[ka]; }
      if(quitar) delete a.empleados[k];
      else if(pass) a.empleados[k] = hashPass(pass);
      await guardarAuth();
    });
    res.json({ ok: true });
  } catch(e){ res.status(e.codigo || 500).json({ error: e.message }); }
});

// ---- Lectura: cada usuario ve solo lo que le corresponde, sin contraseñas ----
app.get('/api/db/all', requerirAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('hap_data').select('tabla, valor');
    if (error) { console.error('GET error:', error.message); return res.status(500).json({ error: 'Error de lectura' }); }
    const result = {};
    (data || []).forEach(row => { if(!TABLAS_OCULTAS(row.tabla)) result[row.tabla] = row.valor; });
    if(Array.isArray(result.caja)) cajaStampIds(result.caja);
    if(result.config) delete result.config.password;
    if(Array.isArray(result.empleados)){
      result.empleados = result.empleados.filter(Boolean).map(e => {
        const c = Object.assign({}, e); delete c.pass;
        c.tienePass = !!authCache.empleados[String(e.nombre || '').trim().toLowerCase()];
        return c;
      });
    }
    if(!esAdminNivel(req.user.nivel)) delete result.prov_movs;
    res.json(result);
  } catch (e) { res.status(500).json({ error: 'Error de lectura' }); }
});

// ---- Escritura por cambios, con permisos por nivel ----
function puedeEscribir(nivel, tabla){
  if(TABLAS_OCULTAS(tabla)) return false;
  if(esAdminNivel(nivel)) return true;
  return TABLAS_TODOS.indexOf(tabla) > -1;
}
app.post('/api/db/delta', requerirAuth, async (req, res) => {
  try {
    const tables = (req.body && req.body.tables) || {};
    const nivel = req.user.nivel, admin = esAdminNivel(nivel);
    const ignoradas = [], renumeradas = [];
    await conLock(async () => {
      for(const t of Object.keys(tables)){
        let d = tables[t] || {};
        if(!puedeEscribir(nivel, t)){ ignoradas.push(t); continue; }
        // los empleados que no son admin solo pueden AGREGAR a la caja, no borrar ni cambiar
        if(t === 'caja' && !admin){
          const actual = (await leerTabla('caja')) || []; cajaStampIds(actual);
          let nuevas = d.mode === 'records' ? (d.upserts || []) : (Array.isArray(d.valor) ? d.valor : []);
          cajaStampIds(nuevas);
          const ids = {}; actual.forEach(m => { ids[m.id] = 1; });
          await escribirTabla('caja', actual.concat(nuevas.filter(m => m && !ids[m.id])));
          continue;
        }
        if(t === 'empleados'){
          const actual = (await leerTabla('empleados')) || [];
          const socios = actual.filter(e => e && nivelDe(e) === 'socio');
          const sociosNombres = socios.map(e => String(e.nombre).trim().toLowerCase());
          let nuevo = Array.isArray(d.valor) ? d.valor.filter(Boolean).map(e => { const c = Object.assign({}, e); delete c.pass; delete c.tienePass; return c; }) : actual;
          if(req.user.nivel !== 'admin'){
            nuevo = nuevo.filter(e => sociosNombres.indexOf(String(e.nombre).trim().toLowerCase()) === -1);
            nuevo = nuevo.map(e => (e.nivel === 'socio' ? Object.assign({}, e, { nivel: 'empleado' }) : e)).concat(socios);
          }
          await escribirTabla('empleados', nuevo);
          const a = await cargarAuth();
          const nombres = nuevo.map(e => String(e.nombre).trim().toLowerCase());
          Object.keys(a.empleados).forEach(k => { if(nombres.indexOf(k) === -1) delete a.empleados[k]; });
          await guardarAuth();
          continue;
        }
        if(t === 'config'){
          const c = Object.assign({}, d.valor || {}); delete c.password;
          await escribirTabla('config', c); continue;
        }
        if(d.mode === 'records'){
          const actual = await leerTabla(t);
          if(t === 'caja') cajaStampIds(actual);
          if(t === 'presupuestos'){
            const nuevasNum = renumerarColisiones(actual, d);
            if(nuevasNum.length){
              renumeradas.push.apply(renumeradas, nuevasNum);
              const ct = (await leerTabla('contador')) || {};
              const mx = Math.max.apply(null, nuevasNum.map(x => x.a)) + 1;
              ct.presupuesto = Math.max(ct.presupuesto || 1, mx);
              await escribirTabla('contador', ct);
            }
          }
          await escribirTabla(t, aplicarDelta(actual, d));
        } else if(t === 'contador'){
          const actual = (await leerTabla(t)) || {};
          const nuevo = Object.assign({}, d.valor || {});
          Object.keys(actual).forEach(k => {
            if(typeof actual[k] === 'number' && typeof nuevo[k] === 'number') nuevo[k] = Math.max(actual[k], nuevo[k]);
            else if(nuevo[k] === undefined) nuevo[k] = actual[k];
          });
          await escribirTabla(t, nuevo);
        } else {
          await escribirTabla(t, d.valor);
        }
      }
    });
    respaldoDiario().catch(e => console.error('respaldo:', e.message));
    res.json({ ok: true, ignoradas, renumeradas });
  } catch (e) { console.error('delta error:', e.message); res.status(500).json({ error: 'Error al guardar' }); }
});

// ---- Copia de seguridad automática: una por día, se guardan las últimas 14 ----
let ultimoRespaldo = '';
async function respaldoDiario(){
  const dia = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  if(ultimoRespaldo === dia) return;
  ultimoRespaldo = dia;
  if(await leerTabla('backup_' + dia)) return;
  const { data, error } = await supabase.from('hap_data').select('tabla, valor');
  if(error) throw new Error(error.message);
  const tablas = {};
  (data || []).forEach(r => { if(!TABLAS_OCULTAS(r.tabla)) tablas[r.tabla] = r.valor; });
  await escribirTabla('backup_' + dia, { fecha: dia, tablas });
  const { data: lista } = await supabase.from('hap_data').select('tabla').like('tabla', 'backup_%');
  const viejos = (lista || []).map(r => r.tabla).sort().reverse().slice(14);
  for(const v of viejos){ await supabase.from('hap_data').delete().eq('tabla', v); }
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log('HAP corriendo en puerto ' + PORT));
