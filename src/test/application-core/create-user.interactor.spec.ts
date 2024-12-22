import { CreateUserInteractor } from '../../service/application-core/character/character-cases/create-user.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { User, UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';
import { Model } from 'mongoose';

import * as data from '../data/create-user.data.json';

describe('CreateUserInteractor', () => {
	let createUserInteractor: CreateUserInteractor;
	let userGateway: UserGateway;
	let user: Model<UserDocument>;
	beforeEach(async () => {
		userGateway = new UserGateway(user);
		createUserInteractor = new CreateUserInteractor(userGateway);
	});

	describe('execute', () => {
		const user: User = data.createUser;
		it('should return a new user created successfully', async () => {
			jest.spyOn(UserGateway.prototype, 'create').mockImplementation(async () => user);
			const response = await createUserInteractor.execute(user);
			expect(response.data).toEqual(user);
		});

		it('should return error code when user could not be created', async () => {
			jest.spyOn(UserGateway.prototype, 'create').mockImplementation(async () => undefined);
			const response = await createUserInteractor.execute(user);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});

		it('should return error code when infrastructure throws exception', async () => {
			jest.spyOn(UserGateway.prototype, 'create').mockRejectedValue(new Error('ERROR DB'));
			const response = await createUserInteractor.execute(user);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
