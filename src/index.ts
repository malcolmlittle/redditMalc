import { MikroORM, RequestContext, /** RequiredEntityData  */} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import express from "express";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig); /** connect to the database */
    // run things in the `RequestContext` handler

    await RequestContext.createAsync(orm.em, async () => {
        await orm.getMigrator().up(); /** run migrations */
        
        const app = express();
        app.get("/", (_, res) => {
            res.send("hello")
        });
        app.listen(4000, () => {
            console.log('server started on localhost:4000')
        });
    });
};

main().catch(err => {
    console.error(err)
});