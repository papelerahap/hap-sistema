const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 10000;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qfrmfwtgnjzlawhhwmnp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_deCqDep8bLWg7H34xlfalA_Z8euE7q4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET todo
app.get('/api/db/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hap_data')
      .select('tabla, valor');
    if (error) {
      console.error('Error Supabase GET:', error);
      return res.status(500).json({ error: error.message });
    }
    const result = {};
    (data||[]).forEach(row => { result[row.tabla] = row.valor; });
    res.json(result);
  } catch (e) {
    console.error('Error GET:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST todo - guarda cada tabla por separado
app.post('/api/db/all', async (req, res) => {
  try {
    const db = req.body;
    const tablas = Object.keys(db);
    
    for(const tabla of tablas) {
      const valor = db[tabla];
      const { error } = await supabase
        .from('hap_data')
        .upsert({ tabla, valor }, { onConflict: 'tabla' });
      if(error) {
        console.error(`Error guardando tabla ${tabla}:`, error.message);
        // Continuar con las demás tablas aunque una falle
      }
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('Error POST:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log('HAP Sistema corriendo en puerto ' + PORT);
});
