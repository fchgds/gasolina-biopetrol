import { D1Database } from '@cloudflare/workers-types';
import { FuelReading } from './types';

/** Persists a historical reading once and a compact current-state record. */
export async function saveResultsToDatabase(results: FuelReading[], env: { DB: D1Database }): Promise<void> {
  if (results.length === 0) return;

  const statements = results.flatMap((result) => [
    env.DB.prepare('INSERT OR IGNORE INTO biopetrol (estacion, litros, timestamp) VALUES (?, ?, ?)')
      .bind(result.estacion, result.litros, result.timestamp),
    env.DB.prepare(
      `INSERT INTO current_biopetrol (estacion, litros, timestamp, address)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(estacion) DO UPDATE SET litros = excluded.litros,
         timestamp = excluded.timestamp, address = excluded.address`,
    ).bind(result.estacion, result.litros, result.timestamp, result.address),
  ]);

  await env.DB.batch(statements);
}
