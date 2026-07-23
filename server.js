const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = 'https://qfrmfwtgnjzlawhhwmnp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_deCqDep8bLWg7H34xlfalA_Z8euE7q4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.get('/api/db/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hap_data')
      .select('tabla, valor');
    if (error) throw error;
    const result = {};
    (data||[]).forEach(row => { result[row.tabla] = row.valor; });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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

app.get('/api/:tabla', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hap_data')
      .select('valor')
      .eq('tabla', req.params.tabla)
      .single();
    if (error || !data) return res.json([]);
    res.json(data.valor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/:tabla', async (req, res) => {
  try {
    const { error } = await supabase
      .from('hap_data')
      .upsert({ tabla: req.params.tabla, valor: req.body }, { onConflict: 'tabla' });
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log('HAP Sistema corriendo en puerto ' + PORT);
});
