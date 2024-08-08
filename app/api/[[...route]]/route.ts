import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

//c is context
app
    .get('/hello',
        clerkMiddleware(), // Protect route
        (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({
                    message: 'You are not logged in.',
                })
            }

            return c.json({
                message: 'Hello Next.js!',
            })
        })
    .get(
        '/hello/:name',
        zValidator("param", z.object({
            name: z.string()
        })),
        (c) => {
            return c.json({
                message: `Hello ${c.req.valid("param")}!`,
            })
        })
    .post(
        '/',
        zValidator("json", z.object({
            name: z.string(),
            userId: z.number()
        })),
        (c) => {
            const { name, userId } = c.req.valid("json")

            return c.json({
                message: `Hello ${c.req.valid("json").name}!`,
            })
        })


export const GET = handle(app)
export const POST = handle(app)