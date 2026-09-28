import express from 'express';
import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(process.cwd(), 'riego_montecarmelo.sqlite');

let db: Database;

async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const filebuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(filebuffer);
    } catch {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create registros table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      created_at TEXT,
      fundo TEXT,
      lote TEXT,
      cultivo TEXT,
      fecha_riego TEXT,
      sfr_ph TEXT,
      sfr_ce TEXT,
      fibra_ph TEXT,
      fibra_ce TEXT,
      drenaje_ph TEXT,
      drenaje_ce TEXT,
      otros_drenaje_pct TEXT,
      otros_humedad_pct TEXT,
      temp_max TEXT,
      temp_min TEXT,
      radiacion_solar TEXT,
      precipitacion TEXT,
      volumen_riego TEXT,
      tiempo_riego TEXT,
      frecuencia TEXT,
      tipo_riego TEXT,
      lamina_riego TEXT,
      ec_agua_riego TEXT,
      ph_agua_riego TEXT,
      observaciones TEXT
    );
  `);
  saveDatabase();
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  }
}

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json());

  // API Endpoints for SQLite Database

  // GET /api/records - Retrieve all records from SQLite
  app.get('/api/records', (_req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM registros ORDER BY rowid DESC');
      const records = [];

      while (stmt.step()) {
        const row = stmt.getAsObject();
        records.push({
          id: String(row.id),
          timestamp: String(row.timestamp || ''),
          createdAt: String(row.created_at || ''),
          fundo: String(row.fundo || 'FUNDO MONTE CARMELO'),
          lote: String(row.lote || 'LOTE 1'),
          cultivo: String(row.cultivo || 'Arándano'),
          fechaRiego: String(row.fecha_riego || ''),
          lecturasDia: {
            sfrPh: String(row.sfr_ph || ''),
            sfrCe: String(row.sfr_ce || ''),
            fibraPh: String(row.fibra_ph || ''),
            fibraCe: String(row.fibra_ce || ''),
            drenajePh: String(row.drenaje_ph || ''),
            drenajeCe: String(row.drenaje_ce || ''),
            otrosDrenajePct: String(row.otros_drenaje_pct || ''),
            otrosHumedadPct: String(row.otros_humedad_pct || ''),
          },
          condicionesClimaticas: {
            tempMax: String(row.temp_max || ''),
            tempMin: String(row.temp_min || ''),
            radiacionSolar: String(row.radiacion_solar || ''),
            precipitacion: String(row.precipitacion || ''),
          },
          observaciones: String(row.observaciones || ''),
          parametrosRiego: {
            fechaRiego: String(row.fecha_riego || ''),
            volumenRiego: String(row.volumen_riego || ''),
            tiempoRiego: String(row.tiempo_riego || ''),
            frecuencia: String(row.frecuencia || ''),
            tipoRiego: (row.tipo_riego as 'Goteo' | 'SFR') || 'Goteo',
            laminaRiego: String(row.lamina_riego || ''),
            ecAguaRiego: String(row.ec_agua_riego || ''),
            phAguaRiego: String(row.ph_agua_riego || ''),
          },
        });
      }
      stmt.free();

      res.json({ success: true, records });
    } catch (err) {
      console.error('Error querying SQLite records:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch records' });
    }
  });

  // POST /api/records - Add a record into SQLite database
  app.post('/api/records', (req, res) => {
    try {
      const rec = req.body;
      if (!rec || !rec.id) {
        return res.status(400).json({ success: false, error: 'Invalid record data' });
      }

      db.run(
        `
        INSERT OR REPLACE INTO registros (
          id, timestamp, created_at, fundo, lote, cultivo, fecha_riego,
          sfr_ph, sfr_ce, fibra_ph, fibra_ce, drenaje_ph, drenaje_ce,
          otros_drenaje_pct, otros_humedad_pct, temp_max, temp_min,
          radiacion_solar, precipitacion, volumen_riego, tiempo_riego,
          frecuencia, tipo_riego, lamina_riego, ec_agua_riego, ph_agua_riego,
          observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
        [
          rec.id,
          rec.timestamp || new Date().toLocaleString(),
          rec.createdAt || new Date().toISOString(),
          rec.fundo || 'FUNDO MONTE CARMELO',
          rec.lote || 'LOTE 1',
          rec.cultivo || 'Arándano',
          rec.parametrosRiego?.fechaRiego || rec.fechaRiego || '',
          rec.lecturasDia?.sfrPh || '',
          rec.lecturasDia?.sfrCe || '',
          rec.lecturasDia?.fibraPh || '',
          rec.lecturasDia?.fibraCe || '',
          rec.lecturasDia?.drenajePh || '',
          rec.lecturasDia?.drenajeCe || '',
          rec.lecturasDia?.otrosDrenajePct || '',
          rec.lecturasDia?.otrosHumedadPct || '',
          rec.condicionesClimaticas?.tempMax || '',
          rec.condicionesClimaticas?.tempMin || '',
          rec.condicionesClimaticas?.radiacionSolar || '',
          rec.condicionesClimaticas?.precipitacion || '',
          rec.parametrosRiego?.volumenRiego || '',
          rec.parametrosRiego?.tiempoRiego || '',
          rec.parametrosRiego?.frecuencia || '',
          rec.parametrosRiego?.tipoRiego || 'Goteo',
          rec.parametrosRiego?.laminaRiego || '',
          rec.parametrosRiego?.ecAguaRiego || '',
          rec.parametrosRiego?.phAguaRiego || '',
          rec.observaciones || '',
        ]
      );

      saveDatabase();
      res.json({ success: true, record: rec });
    } catch (err) {
      console.error('Error inserting record to SQLite:', err);
      res.status(500).json({ success: false, error: 'Failed to save record' });
    }
  });

  // DELETE /api/records/:id - Delete record by ID
  app.delete('/api/records/:id', (req, res) => {
    try {
      const { id } = req.params;
      db.run('DELETE FROM registros WHERE id = ?;', [id]);
      saveDatabase();
      res.json({ success: true });
    } catch (err) {
      console.error('Error deleting record from SQLite:', err);
      res.status(500).json({ success: false, error: 'Failed to delete record' });
    }
  });

  // DELETE /api/records - Clear all records
  app.delete('/api/records', (_req, res) => {
    try {
      db.run('DELETE FROM registros;');
      saveDatabase();
      res.json({ success: true });
    } catch (err) {
      console.error('Error clearing SQLite database:', err);
      res.status(500).json({ success: false, error: 'Failed to clear database' });
    }
  });

  // Vite Integration in Development / Production Static Server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.use('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server with SQLite database running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
