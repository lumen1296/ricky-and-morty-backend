import { GetUserInteractor } from '../../service/application-core/character/character-cases/get-character.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';
import { Model } from 'mongoose';

import * as data from '../data/user-gateway.data.json';

describe('GetUserInteractor', () => {
	const userId = '604e4b07f11dd9cfa6f8c41e';
	let getUserInteractor: GetUserInteractor;
	let userGateway: UserGateway;
	let user: Model<UserDocument>;
	beforeEach(async () => {
		userGateway = new UserGateway(user);
		getUserInteractor = new GetUserInteractor(userGateway);
	});

	describe('execute', () => {
		it('should return the users stored in the database when no ID is sent', async () => {
			jest.spyOn(UserGateway.prototype, 'findAll').mockImplementation(async () => data.find as any);
			const response = await getUserInteractor.execute(null);
			expect(response.data).toEqual(data.find);
		});

		it('should return a user by ID stored in the database', async () => {
			jest.spyOn(UserGateway.prototype, 'findById').mockImplementation(async () => data.findOne);
			const response = await getUserInteractor.execute(userId);
			expect(response.data).toEqual([data.findOne]);
		});

		it('should return error code when findAll infrastructure throws exception', async () => {
			jest.spyOn(UserGateway.prototype, 'findAll').mockRejectedValue(new Error('ERROR DB'));
			const response = await getUserInteractor.execute(null);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});

		it('should return error code when findById infrastructure throws exception', async () => {
			jest.spyOn(UserGateway.prototype, 'findById').mockRejectedValue(new Error('ERROR DB'));
			const response = await getUserInteractor.execute(userId);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
