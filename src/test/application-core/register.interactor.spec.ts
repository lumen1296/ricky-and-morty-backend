import { JwtService } from '@nestjs/jwt';
import { MicroserviceResponse } from '@skyairline/lib-microservice-core';
import { Model } from 'mongoose';
import { LoginInteractor } from '../../service/application-core/auth/uses-cases/login.interactor';
import { RegisterInteractor } from '../../service/application-core/auth/uses-cases/register.interactor';
import { CreateUserInteractor } from '../../service/application-core/character/character-cases/create-user.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';

import * as data from '../data/create-user.data.json';
import * as loginData from '../data/login.data.json';

describe('RegisterInteractor', () => {
	let registerInteractor: RegisterInteractor;
	let loginInteractor: LoginInteractor;
	let user: Model<UserDocument>;
	beforeEach(() => {
		loginInteractor = new LoginInteractor(
			new UserGateway(user),
			new JwtService({
				secret: 'test_secret',
				signOptions: { expiresIn: '60s' },
			}),
		);
		registerInteractor = new RegisterInteractor(
			new UserGateway(user),
			new CreateUserInteractor(new UserGateway(user)),
			loginInteractor,
		);
	});

	describe('execute', () => {
		it('should return the data of a new user and an access token', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => undefined);
			const createUserInteractorResponse: MicroserviceResponse<any> = {
				data: data.createUser,
			};
			jest
				.spyOn(CreateUserInteractor.prototype, 'execute')
				.mockImplementation(async () => createUserInteractorResponse);

			jest.spyOn(LoginInteractor.prototype, 'execute').mockImplementation(async () => loginData);
			const response = await registerInteractor.execute({
				email: 'existemail@gmail.com',
				password: '123123',
			});
			expect(response.error).toBe(undefined);
			expect(response.data.access_token).toBe(loginData.data.access_token);
		});
		it('should return an error when the user already exists in the database', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => data.createUser);
			const response = await registerInteractor.execute({
				email: 'existemail@gmail.com',
				password: '123123',
			});
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
		it('should return an error when the user could not be created', async () => {
			jest.spyOn(UserGateway.prototype, 'getUserByEmail').mockImplementation(async () => undefined);

			const createUserInteractorResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};

			jest
				.spyOn(CreateUserInteractor.prototype, 'execute')
				.mockImplementation(async () => createUserInteractorResponse);
			const response = await registerInteractor.execute({
				email: 'existemail@gmail.com',
				password: '123123',
			});
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
