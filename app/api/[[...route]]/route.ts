import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { HTTPException } from 'hono/http-exception'
import accounts from './accounts'
import categories from './categories'

// Define the schema for the request body
export const runtime = 'edge'

//This route is the center for all the routes
const app = new Hono().basePath('/api')

//handling errorss server side
//Only forr HTTPException
/* app.onError((error, c) => {
    if (error instanceof HTTPException) {
        return error.getResponse();
    }
    return c.json({
        error: 'Internal Server Error'
    }, 500)
}) */

/* app.route('/accounts', accounts)  */// adding accounts route

const routes = app
    .route('/accounts', accounts)
    .route('/categories', categories)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

//Enabling RPC. 
export type AppType = typeof routes;