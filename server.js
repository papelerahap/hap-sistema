const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ── DATOS ──────────────────────────────────────────────
// Guardamos todo en una sola tabla: hap_data
// con una fila por "tabla" (productos, clientes, etc.)

async function getData(tabla) {
  const { data, error } = await supabase
    .from('hap_data')
    .select('valor')
    .eq('tabla', tabla)
    .single();
  if (error || !data) return [];
  return data.valor;
}

async function setData(tabla, valor) {
  const { error } = await supabase
    .from('hap_data')
    .upsert({ tabla, valor }, { onConflict: 'tabla' });
  if (error) throw error;
}

// ── RUTAS API ───────────────────────────────────────────

// GET /api/:tabla — obtener datos
app.get('/api/:tabla', async (req, res) => {
  try {
    const data = await getData(req.params.tabla);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/:tabla — guardar datos
app.post('/api/:tabla', async (req, res) => {
  try {
    await setData(req.params.tabla, req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/db/all — obtener todo de una vez
app.get('/api/db/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hap_data')
      .select('tabla, valor');
    if (error) throw error;
    const result = {};
    data.forEach(row => { result[row.tabla] = row.valor; });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/db/all — guardar todo de una vez
app.post('/api/db/all', async (req, res) => {
  try {
    const db = req.body;
    const rows = Object.entries(db).map(([tabla, valor]) => ({ tabla, valor }));
    const { error } = await supabase
      .from('hap_data')
      .upsert(rows, { onConflict: 'tabla' });
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── HEALTH CHECK ────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ HAP Sistema corriendo en puerto ${PORT}`);
});
