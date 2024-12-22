import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { LoginInteractor } from '../../service/application-core/auth/uses-cases/login.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';

import * as data from '../data/create-user.data.json';

describe('LoginInteractor', () => {
	let loginInteractor: LoginInteractor;
	let user: Model<UserDocument>;
	const jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc2VsdWlzY2FuZGlhLmZAZ21haWwuY29tIiwibmFtZSI6IiIsInVzZXJuYW1lIjoiIiwiaWF0IjoxNjE2MzY1MTgwLCJleHAiOjE2MTYzNjUyNDB9.rVmP8vWv-2Se4Ntyh7sxKJMOonf8X9binf_IGmWUjZQ';

	beforeEach(async () => {
		loginInteractor = new LoginInteractor(
			new UserGateway(user),
			new JwtService({
				secret: 'test_secret',
				signOptions: { expiresIn: '60s' },
			}),
		);
	});

	describe('execute', () => {
		it('should return an object with user data and session token', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => data.createUser);
			jest.spyOn(JwtService.prototype, 'sign').mockImplementation(() => jwtToken);
			const response = await loginInteractor.execute({
				email: 'noemail@gmail.com',
				password: '123123',
			});
			expect(response.error).toBe(undefined);
			expect(response.data.access_token).toBe(jwtToken);
		});

		it('should return an error when the user email exists but the password does not match', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => data.createUser);
			jest.spyOn(JwtService.prototype, 'sign').mockImplementation(() => jwtToken);
			const response = await loginInteractor.execute({
				email: 'noemail@gmail.com',
				password: 'test',
			});
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});

		it('should return an error when the user email does not exist in the database', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => undefined);
			const response = await loginInteractor.execute({
				email: 'noemail@gmail.com',
				password: 'test',
			});

			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
