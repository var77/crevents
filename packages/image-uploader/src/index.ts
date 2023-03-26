import { Context, Hono } from 'hono';
import { sha256 } from 'hono/utils/crypto';
import { basicAuth } from 'hono/basic-auth';
import { cors } from 'hono/cors';
import {
  fromRpcSig,
  ecrecover,
  pubToAddress,
  bufferToHex,
  hashPersonalMessage,
} from '@ethereumjs/util';
import { detectType } from './utils';

interface Env {
  BUCKET: R2Bucket;
  RECAPTCHA_SECRET: string;
  USER: string;
  PASS: string;
  HOST: string;
}

interface Data {
  body: string;
  recaptchaToken: string;
}

const maxAge = 60 * 60 * 24 * 30;

const verifyRecaptcha = async (env: Env, token: string) => {
  // for dev
  if (!env.RECAPTCHA_SECRET) return true;

  if (!token) return false;

  // Verify token
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${env.RECAPTCHA_SECRET}&response=${token}`,
    }
  );
  const recaptchaBody = await recaptchaResponse.json();

  // Handle failure
  return recaptchaBody.success && recaptchaBody.score > 0.3;
};

const app = new Hono<Env>();
app.use(
  '*',
  cors({
    origin: ['http://localhost:4200', 'https://cryvents.xyz', 'https://crevents.pages.dev'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    maxAge: 600,
  })
);
app.options('*', (c) => {
  return c.text('', 204);
});
app.put('/upload', async (c, next) => {
  const auth = basicAuth({ username: c.env.USER, password: c.env.PASS });
  await auth(c, next);
});

app.put('/upload', async (c) => {
  const data = await c.req.json<Data>();
  const base64 = data.body;
  if (!base64) return c.text('Image is required', 400);

  if (!data.recaptchaToken) return c.text('Signature is required', 400);

  const status = await verifyRecaptcha(c.env, data.recaptchaToken);
  if (!status) return c.text('Invalid recaptcha', 429);

  const type = detectType(base64);
  if (!type) return c.text('Invalid type', 400);

  const body = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const sizeInMB = body.length / 1_048_576;
  if (sizeInMB >= 5) return c.text('Size can not be bigger than 5MB', 400);

  const key = (await sha256(body)) + '.' + type?.suffix;
  const object = await c.env.BUCKET.head(key);
  if (!object) {
    await c.env.BUCKET.put(key, body, {
      httpMetadata: { contentType: type.mimeType },
    });
  }

  return c.text(`${c.env.HOST}/${key}`);
});

app.get('/:key', async (c) => {
  const key = c.req.param('key');

  const object = await c.env.BUCKET.get(key);
  if (!object) return c.notFound();
  const data = await object.arrayBuffer();
  const contentType = object.httpMetadata.contentType || '';

  return c.body(data, 200, {
    'Cache-Control': `public, max-age=${maxAge}`,
    'Content-Type': contentType,
  });
});

export default app;
