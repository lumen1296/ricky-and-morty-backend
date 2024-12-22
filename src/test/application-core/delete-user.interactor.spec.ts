import { DeleteUserInteractor } from '../../service/application-core/character/character-cases/delete-user.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';
import { Model } from 'mongoose';

import * as data from '../data/create-user.data.json';

describe('DeleteUserInteractor', () => {
	const userId = '604e4b07f11dd9cfa6f8c41e';
	let deleteUserInteractor: DeleteUserInteractor;
	let userGateway: UserGateway;
	let user: Model<UserDocument>;
	beforeEach(async () => {
		userGateway = new UserGateway(user);
		deleteUserInteractor = new DeleteUserInteractor(userGateway);
	});

	describe('execute', () => {
		it('should return a deleted user successfully', async () => {
			jest.spyOn(UserGateway.prototype, 'delete').mockImplementation(async () => data.createUser);
			const response = await deleteUserInteractor.execute(userId);
			expect(response.data).toEqual(data.createUser);
		});

		it('should return error code when user could not be deleted', async () => {
			jest.spyOn(UserGateway.prototype, 'delete').mockImplementation(async () => undefined);
			const response = await deleteUserInteractor.execute(userId);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});

		it('should return error code when infrastructure throws exception', async () => {
			jest.spyOn(UserGateway.prototype, 'delete').mockRejectedValue(new Error('ERROR DB'));
			const response = await deleteUserInteractor.execute(userId);
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
