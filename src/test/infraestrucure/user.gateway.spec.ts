import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { PersistenceModule } from '../../service/infraestructure/persistence/persistence.module';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';

import * as apiUserData from '../data/user-gateway.data.json';

describe('UserGateway', () => {
	let userGateway: UserGateway;

	const mockRepository = {
		find() {
			return apiUserData.find;
		},
		save() {
			return apiUserData.findOne;
		},
		findOne() {
			return {
				...apiUserData.findOne,
				updateOne: jest.fn(),
				deleteOne: jest.fn(),
			};
		},
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [PersistenceModule],
		})
			.overrideProvider(getModelToken('User'))
			.useValue(mockRepository)
			.compile();

		userGateway = module.get<UserGateway>(UserGateway);
	});

	describe('findAll', () => {
		it('should return all users stored in the database ', async () => {
			const response = await userGateway.findAll();
			expect(response.length > 0).toBe(true);
		});
	});

	describe('findById', () => {
		it('should return a user stored in the database by id ', async () => {
			const response = await userGateway.findById('604e4b07f11dd9cfa6f8c41e');
			expect(response).not.toBe(null);
		});
	});

	describe('update', () => {
		it('should update and return a user stored in the database by id ', async () => {
			const response = await userGateway.update('604e4b07f11dd9cfa6f8c41e', apiUserData.findOne);
			expect(response).not.toBe(null);
		});
	});

	describe('update', () => {
		it('should update and return a user stored in the database by id ', async () => {
			const response = await userGateway.delete('604e4b07f11dd9cfa6f8c41e');
			expect(response).not.toBe(null);
		});
	});

	describe('getUserByEmail', () => {
		it('should delete and return user ', async () => {
			const response = await userGateway.getUserByEmail('Sincere@april.biz');
			expect(response.email).toBe('Sincere@april.biz');
		});
	});
});
