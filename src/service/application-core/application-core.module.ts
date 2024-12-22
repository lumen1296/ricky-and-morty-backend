import { Module } from '@nestjs/common';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';
import { GetCharacterInteractor } from './character';
import { charactersProviders } from './character/providers/character.providers';
import { RedisService } from '../infraestructure/persistence/gateways/redis.gateway';


@Module({
	imports: [
		InfraestructureModule,
	],
	providers: [GetCharacterInteractor, charactersProviders, RedisService],
	exports: [GetCharacterInteractor, charactersProviders, RedisService],
})
export class ApplicationCoreModule {}
