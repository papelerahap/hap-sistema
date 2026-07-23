-- Ejecutar esto en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS hap_data (
  tabla TEXT PRIMARY KEY,
  valor JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hap_data_updated_at
  BEFORE UPDATE ON hap_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Permitir acceso desde la API
ALTER TABLE hap_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON hap_data
  FOR ALL USING (true) WITH CHECK (true);
