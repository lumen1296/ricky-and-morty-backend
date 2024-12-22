import { Args, Query, Resolver } from '@nestjs/graphql';
import { ApiTags } from '@nestjs/swagger';
import { Character } from 'src/service/application-core/character/entity/character.entity';
import { GetCharacterInteractor } from 'src/service/application-core/character/character-cases/get-character.interactor';
import { UseInterceptors } from '@nestjs/common';
import { RedisInterceptor } from 'src/service/infraestructure/interceptors/redis.interceptor';

@Resolver(() => Character)
@ApiTags('Character')
export class CharacterResolver {
	constructor(
		private readonly getCharacterInteractor: GetCharacterInteractor
	) { }

	@Query(() => [Character])
	@UseInterceptors(RedisInterceptor)
	async characters(@Args('name', { type: () => String, nullable: true }) name?: string,
		@Args('status', { type: () => String, nullable: true }) status?: string,
		@Args('species', { type: () => String, nullable: true }) species?: string,
		@Args('gender', { type: () => String, nullable: true }) gender?: string,
		@Args('origin', { type: () => String, nullable: true }) origin?: string,): Promise<Character[]> {
		const filters = { name, status, species, gender, origin };
		const response = await this.getCharacterInteractor.execute(filters);
		return response;
	}
}
