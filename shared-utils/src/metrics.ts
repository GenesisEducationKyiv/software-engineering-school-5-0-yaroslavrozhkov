import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000],
});

export const messageProcessedCounter = new client.Counter({
  name: 'message_processed_total',
  help: 'Total number of processed messages',
});

export async function getMetrics(): Promise<string> {
  return await client.register.metrics();
}