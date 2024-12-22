import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CharacterResolver } from './resolvers/character.resolver';

@Module({
	imports: [ ApplicationCoreModule],
	providers: [CharacterResolver]
})
export class UserInterfaceModule {}
