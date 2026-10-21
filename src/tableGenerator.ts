import { D1Database } from "@cloudflare/workers-types";
import { FuelReading } from './types';

export async function tableGenerator(env: { DB: D1Database }): Promise<string> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT estacion, litros, timestamp, address FROM current_biopetrol ORDER BY estacion',
    ).all<FuelReading>();

    if (results.length === 0) return '<p>Aún no hay una medición disponible. La actualización se ejecuta automáticamente.</p>';

    let table = '<table><tr><th>Estación</th><th>Litros</th><th>Medición</th><th>Dirección</th></tr>';
    results.forEach(result => {
      table += `<tr><td>${escapeHtml(result.estacion)}</td><td>${escapeHtml(result.litros)}</td><td>${escapeHtml(result.timestamp)}</td><td>${escapeHtml(result.address)}</td></tr>`;
    });
    table += '</table>';
    
    // Return the HTML string
    return table;
  } catch (error) {
    console.error('Error fetching the URL:', error);
    // Return an error message as an HTML string
    return '<p>Error executing scraper</p>';
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}
