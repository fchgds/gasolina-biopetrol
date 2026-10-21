// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { beforeEach, describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	beforeEach(async () => {
		await env.DB.prepare(
			'CREATE TABLE IF NOT EXISTS current_biopetrol (estacion TEXT PRIMARY KEY, litros TEXT NOT NULL, timestamp TEXT NOT NULL, address TEXT NOT NULL)',
		).run();
		await env.DB.prepare('DELETE FROM current_biopetrol').run();
	});

	it('rejects non-root paths without querying D1', async () => {
		const request = new IncomingRequest('http://example.com/favicon.ico');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(404);
	});

	it('renders the public page from stored data', async () => {
		const response = await worker.fetch(new IncomingRequest('https://example.com/'), env, createExecutionContext());
		expect(response.status).toBe(200);
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=300');
		expect(await response.text()).toContain('Aún no hay una medición disponible');
	});
});
