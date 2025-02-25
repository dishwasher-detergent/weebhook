import { Hono } from 'hono';
import { Permission, Role } from 'node-appwrite';

import {
  database_service,
  PROJECT_COLLECTION_ID,
  REQUEST_COLLECTION_ID,
} from '../lib/appwrite.js';

export function Home(app: Hono, cacheDuration: number = 1440) {
  app.post('/projects/:project_id', async (c) => {
    const projectId = c.req.param('project_id');

    if (!projectId) {
      return c.json('Project ID is required', 400);
    }

    const headersToRemove = [
      'authorization',
      'cdn-loop',
      'cf-connecting-ip',
      'cf-ipcountry',
      'cf-ray',
      'cf-visitor',
    ];

    const headers = Object.fromEntries(
      Object.entries(c.req.header()).filter(
        ([key]) => !headersToRemove.includes(key.toLowerCase())
      )
    );

    let res = {};

    try {
      res = await c.req.json();
    } catch (err) {
      res = {};
      console.error(err);
    }

    try {
      await database_service.get(PROJECT_COLLECTION_ID, projectId);
    } catch {
      return c.json(`Project ID '${projectId}' was not found.`, 404);
    }

    try {
      const data = await database_service.create(
        REQUEST_COLLECTION_ID,
        {
          projectId: projectId,
          headers: JSON.stringify(headers),
          body: JSON.stringify(res),
          type: 'POST'.toLowerCase(),
        },
        [
          Permission.read(Role.team(projectId)),
          Permission.write(Role.team(projectId)),
        ]
      );

      return c.json(data, 200);
    } catch {
      return c.json('Failed to create request', 500);
    }
  });
}
