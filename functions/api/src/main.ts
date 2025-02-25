import { Hono } from 'hono';
import { cors } from 'hono/cors';

import {
  requestFromContext,
  responseForContext,
  throwIfMissing,
} from './lib/utils.js';
import { Home } from './pages/home.js';
import { KeepWarm } from './pages/keepWarm.js';
import { Context } from './types/types.js';

const cache = 1440; //24 hours in seconds

const app = new Hono();

app.use('*', cors());

// Error Handling
app.onError((err, c) => {
  return c.json(err, 500);
});

// Post requests
KeepWarm(app);

// API Routes
Home(app, cache);

export default async (context: Context) => {
  throwIfMissing(process.env, [
    'API_KEY',
    'DATABASE_ID',
    'REQUEST_COLLECTION_ID',
    'USER_COLLECTION_ID',
    'PROJECT_COLLECTION_ID',
  ]);

  const request = requestFromContext(context);
  const response = await app.request(request);

  return await responseForContext(context, response);
};
