import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MicroserviceResponse } from '@skyairline/lib-microservice-core';
import { Model } from 'mongoose';
import { LoginRequestDTO, RegisterRequestDTO } from '../../service/application-core/auth/dto/auth.dto';
import { LoginInteractor } from '../../service/application-core/auth/uses-cases/login.interactor';
import { RegisterInteractor } from '../../service/application-core/auth/uses-cases/register.interactor';
import { CreateUserInteractor } from '../../service/application-core/character/character-cases/create-user.interactor';
import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';
import { AuthController } from '../../service/user-interface/resolvers/auth.controller';

import * as data from '../data/login.data.json';

describe('AuthController', () => {
	let authController: AuthController;
	let loginInteractor: LoginInteractor;
	let registerInteractor: RegisterInteractor;
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

		authController = new AuthController(loginInteractor, registerInteractor);
	});

	describe('login', () => {
		const loginRequestDTO: LoginRequestDTO = {
			email: 'testemail@gmail.com',
			password: '123123',
		};

		it('should return user data and an access token ', async () => {
			jest.spyOn(LoginInteractor.prototype, 'execute').mockImplementation(async () => data);
			expect(await authController.login(loginRequestDTO)).toEqual(data);
		});

		it('should return BadRequestException for invalid credentials', async () => {
			const errorResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};
			jest.spyOn(LoginInteractor.prototype, 'execute').mockImplementation(async () => errorResponse);
			try {
				await authController.login(loginRequestDTO);
			} catch (error) {
				expect(error.message).toBe('error_message');
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});
	});

	describe('register', () => {
		const registerRequestDTO: RegisterRequestDTO = {
			email: 'testemail@gmail.com',
			password: '123123',
		};

		it('should return user data and an access token ', async () => {
			jest.spyOn(RegisterInteractor.prototype, 'execute').mockImplementation(async () => data);
			expect(await authController.register(registerRequestDTO)).toEqual(data);
		});

		it('should return BadRequestException for invalid credentials', async () => {
			const errorResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};
			jest.spyOn(RegisterInteractor.prototype, 'execute').mockImplementation(async () => errorResponse);
			try {
				await authController.register(registerRequestDTO);
			} catch (error) {
				expect(error.message).toBe('error_message');
				expect(error).toBeInstanceOf(InternalServerErrorException);
			}
		});
	});
});
