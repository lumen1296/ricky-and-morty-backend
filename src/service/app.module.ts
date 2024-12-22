import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphqlMiddleware } from './infraestructure/middleware/graphql.middleware';

@Module({
  imports: [UserInterfaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/service/application-core/character/schema/character.gql')
    }),],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GraphqlMiddleware)
      .forRoutes('graphql');
  }
}