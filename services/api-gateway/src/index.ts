import express, { RequestHandler } from 'express';
import proxy from 'express-http-proxy';

const app = express();

const PORT = process.env.APP_PORT || 3000;

const userProxy: RequestHandler = proxy('http://user-service:3000');
const weatherProxy: RequestHandler = proxy('http://weather-service:3000');
const emailProxy: RequestHandler = proxy('http://email-service:3000');

app.use('/users', userProxy);
app.use('/weather', weatherProxy);
app.use('/email', emailProxy);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
