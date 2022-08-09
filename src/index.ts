import { MikroORM, RequestContext, RequiredEntityData } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig); /** connect to the database */
    // run things in the `RequestContext` handler

    await RequestContext.createAsync(orm.em, async () => {
        await orm.getMigrator().up(); /** run migrations */
        // inside this handler the `orm.em` will actually use the contextual fork, created via `RequestContext.createAsync()`
        const post = orm.em.create(Post, {title: 'my first post'} as RequiredEntityData<Post>);
        await orm.em.persistAndFlush(post); /** run sql */
        // console.log("----------sql 2----------");
        // await orm.em.nativeInsert(Post, { title: 'my first post 2'});     
    });
};

main().catch(err => {
    console.error(err)
});
