import express, { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

const app = express();

const PORT = process.env.APP_PORT || 3000;

const userProxy: RequestHandler = proxy('http://localhost:3003');
const weatherProxy: RequestHandler = proxy('http://localhost:3002');
const emailProxy: RequestHandler = proxy('http://localhost:3001');

app.use('/users', userProxy);
app.use('/weather', weatherProxy);
app.use('/email', emailProxy);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
