import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MicroserviceResponse } from '@skyairline/lib-microservice-core';
import { Model } from 'mongoose';
import { GetApiUserInteractor } from '../../service/application-core/fetch-user';
import {
	CreateUserInteractor,
	DeleteUserInteractor,
	GetUserInteractor,
} from '../../service/application-core/character';
import { JsonplaceholderClient } from '../../service/infraestructure/microservice-clients/http/jsonplaceholder.client';

import { UserGateway } from '../../service/infraestructure/persistence/gateways/user.gateway';
import { UserDocument } from '../../service/infraestructure/persistence/schemas/user.schema';
import { UserController } from '../../service/user-interface/resolvers/character.resolver';

import * as data from '../data/user-gateway.data.json';
import * as api from '../data/api-user.data.json';
import * as create from '../data/create-user.data.json';

describe('UserController', () => {
	let userController: UserController;
	let user: Model<UserDocument>;
	beforeEach(() => {
		userController = new UserController(
			new GetUserInteractor(new UserGateway(user)),
			new CreateUserInteractor(new UserGateway(user)),
			new DeleteUserInteractor(new UserGateway(user)),
			new GetApiUserInteractor(new JsonplaceholderClient(new ConfigService(), new HttpService())),
		);
	});

	describe('getUsers', () => {
		it('should return object "data" with the users stored in the database', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				data: data.find,
			};
			jest.spyOn(GetUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			expect(await userController.getUsers()).toEqual(microserviceResponse);
		});
	});

	describe('getUserById', () => {
		it('should return object "data" with the users stored in the database', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				data: data.findOne,
			};
			jest.spyOn(GetUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			expect(await userController.getUserById(data.findOne._id)).toEqual(microserviceResponse);
		});
	});

	describe('getApiUsers', () => {
		it('should return object "data" with the users generated in the API of jsonplaceholder', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				data: api,
			};
			jest.spyOn(GetApiUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			expect(await userController.getApiUsers()).toEqual(microserviceResponse);
		});
	});

	describe('getApiUsers', () => {
		it('should return InternalServerErrorException given an error in the api interactor', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};
			jest.spyOn(GetApiUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			try {
				await userController.getApiUsers();
			} catch (error) {
				expect(error.message).toBe('error_message');
				expect(error).toBeInstanceOf(InternalServerErrorException);
			}
		});
	});

	describe('createUser', () => {
		it('should return the new user created', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				data: create.createUser,
			};
			jest.spyOn(CreateUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			expect(
				await userController.createUser({
					email: create.createUser.email,
					name: create.createUser.name,
					password: create.createUser.password,
					phone: create.createUser.phone,
					username: create.createUser.username,
					website: create.createUser.website,
				}),
			).toEqual(microserviceResponse);
		});
	});

	describe('createUser', () => {
		it('should return InternalServerErrorException given an error in the create interactor', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};
			jest.spyOn(CreateUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			try {
				await userController.createUser({
					email: create.createUser.email,
					name: create.createUser.name,
					password: create.createUser.password,
					phone: create.createUser.phone,
					username: create.createUser.username,
					website: create.createUser.website,
				});
			} catch (error) {
				expect(error.message).toBe('error_message');
				expect(error).toBeInstanceOf(InternalServerErrorException);
			}
		});
	});

	describe('deleteUser', () => {
		it('should return the user deleted', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				data: create.createUser,
			};
			jest.spyOn(DeleteUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			expect(await userController.deleteUser('98732198371298378912')).toEqual(microserviceResponse);
		});
	});

	describe('deleteUser', () => {
		it('should return InternalServerErrorException given an error in the delete interactor', async () => {
			const microserviceResponse: MicroserviceResponse<any> = {
				error: {
					code: 'ERRORCODE',
					message: 'error_message',
				},
			};
			jest.spyOn(DeleteUserInteractor.prototype, 'execute').mockImplementation(async () => microserviceResponse);
			try {
				await userController.deleteUser('98732198371298378912');
			} catch (error) {
				expect(error.message).toBe('error_message');
				expect(error).toBeInstanceOf(InternalServerErrorException);
			}
		});
	});
});
