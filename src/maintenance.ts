/**
 * Temporary incident mode: intentionally has no D1 binding and no scheduled
 * handler. Deploy with wrangler.maintenance.toml to stop all database reads
 * until the normal Worker can be migrated and restored.
 */
export default {
  fetch(): Response {
    return new Response('Servicio temporalmente en mantenimiento. Intente nuevamente más tarde.', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Cache-Control': 'no-store',
        'Retry-After': '3600',
      },
    });
  },
};
