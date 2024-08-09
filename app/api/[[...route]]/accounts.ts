import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono() //Changing structure to support RPC and REST
    .get("/", async (c) => {
        const data = await db
            .select({
                id: accounts.id,
                name: accounts.name,
            })
            .from(accounts)

        return c.json({
            data
        });
    });


export default app;