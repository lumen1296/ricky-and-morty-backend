import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Character } from '../entity/character.entity';
import { Op } from 'sequelize';
import { RedisService } from 'src/service/infraestructure/persistence/gateways/redis.gateway';

@Injectable()
export class GetCharacterInteractor {
	constructor(
		@Inject('CHARACTER_REPOSITORY')
		private characterRepository: typeof Character
	) { }

	async execute(filters: Partial<{ name: string; status: string; species: string; gender: string; origin: string }>): Promise<Character[]> {
		try {
			const where: any = {};

			const filterMappings: { [key: string]: string } = {
				name: filters.name,
				status: filters.status,
				species: filters.species,
				gender: filters.gender
			};


			Object.keys(filterMappings).forEach(key => {
				if (filterMappings[key]) {
					where[key] = filterMappings[key];
				}
			})
			if (filters.origin) {
				where.origin = {
					[Op.contains]: { name: filters.origin },
				};
			}
			const characters = await this.characterRepository.findAll({ where });
			return characters;


		} catch (e) {
			throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
