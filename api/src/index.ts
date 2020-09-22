/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { UserResolver } from './resolvers/user';
import { GoalResolver } from './resolvers/goal';
import { HelloResolver } from './resolvers/hello';

dotenv.config();

const main = async () => {
  // Build Schema - Why does this need to be 'any' to work
  const schema: any = await buildSchema({
    resolvers: [UserResolver, GoalResolver, HelloResolver],
    emitSchemaFile: true,
    validate: false,
  });

  // MongoDB Connections
  const mongoose = await connect('mongodb://localhost:27017/improveMe', {
    dbName: 'improveMe',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  await mongoose.connection;

  // Redis
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  // GraphQL Server - Define Server
  const server = new GraphQLServer({
    schema,
    context: (req) => ({
      ...req,
      redisClient,
      // Anything I add here gets added to the context on the req obj
    }),
  });

  // Server Options
  const opts = {
    port: 4000,
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'], // Frontend url
    },
  };

  // Express Session Middleware
  server.express.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      secret: process.env.REDIS_SECRET as string,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24, // 1day
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      },
    })
  );

  // Start Server
  server.start(opts, () =>
    console.log(`Server is running on localhost:${opts.port}`)
  );
};

// eslint-disable-next-line prettier/prettier
main().catch((err) => {
  console.error(`Error: ${err}`);
});
