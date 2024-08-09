import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import accounts from './accounts'

// Define the schema for the request body
export const runtime = 'edge'

//This route is the center for all the routes
const app = new Hono().basePath('/api')


/* app.route('/accounts', accounts)  */// adding accounts route

const routes = app
    .route('/accounts', accounts)

export const GET = handle(app)
export const POST = handle(app)

//Enabling RPC. 
export type AppType = typeof routes;