import { db } from "@/db/drizzle";
import { accounts, insertAccountsSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq } from 'drizzle-orm'
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2"

const app = new Hono() //Changing structure to support RPC and REST
    .get("/",
        clerkMiddleware(),//authernticated users
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({
                    error: "Unauthorized"
                }, 401);


                //other way to handle error. 
                /* throw new HTTPException(401, {
                    res: c.json({
                        error: "Unauthorized"
                    })
                }); */

            }
            const data = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId));//Accounts of this usser

            return c.json({
                data
            });
        })

    .post("/",
        clerkMiddleware(),
        zValidator("json", insertAccountsSchema.pick({
            name: true
        })),//Validating the request body. Es diferente al esquema, al crear la cuenta solo se necesita el nombre
        async (c) => {
            const auth = getAuth(c);

            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const [data] = await db.insert(accounts).values({
                id: createId(), //Cuid 
                userId: auth.userId,
                ...values
            }).returning();

            return c.json({
                data
            });
        })


export default app;