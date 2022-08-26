import "reflect-metadata";
import { MikroORM, RequestContext, /** RequiredEntityData  */} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import connectRedis from "connect-redis";
import * as redis from "redis";
import session from "express-session";
import { MyContext } from "./types";


const main = async () => {
    const orm = await MikroORM.init(mikroConfig); /** connect to the database */
    // run things in the `RequestContext` handler

    await RequestContext.createAsync(orm.em, async () => {
        await orm.getMigrator().up(); /** run migrations */
        
        const app = express();

        const RedisStore = connectRedis(session)
        const redisClient = redis.createClient({
            legacyMode: true
        })
        await redisClient.connect();

        app.use(
            session({
                name: "qid",
                store: new RedisStore({ client: redisClient as any, disableTouch: true}),
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                    httpOnly: true,
                    sameSite: "lax", // defense against cross-site request forgery (CSRF) attacks
                    secure: __prod__
                },
                saveUninitialized: false,
                secret: "happywednesday",
                resave: false,
            })
        )
        
        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [HelloResolver, PostResolver, UserResolver],
                validate: false
            }),
            context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
        });
        
        apolloServer.applyMiddleware({ app });

        app.listen(4000, () => {
            console.log('server started on localhost:4000')
        });
    });
};

main().catch(err => {
    console.error(err)
});