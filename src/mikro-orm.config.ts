import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
      },
    entities: [Post],
    dbName: 'redditmalc',
    type: 'postgresql',
    debug: !__prod__,
    // clientUrl: 'postgresql://postgres@127.0.0.1:5432'
} as Parameters<typeof MikroORM.init>[0];