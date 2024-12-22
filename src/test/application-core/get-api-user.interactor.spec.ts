import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GetApiUserInteractor } from '../../service/application-core/fetch-user/uses-cases/get-api-user.interactor';
import { JsonplaceholderClient } from '../../service/infraestructure/microservice-clients/http/jsonplaceholder.client';

import * as data from '../data/api-user.data.json';

describe('GetApiUserInteractor', () => {
	let getApiUserInteractor: GetApiUserInteractor;
	let jsonplaceholderClient: JsonplaceholderClient;
	beforeEach(() => {
		jsonplaceholderClient = new JsonplaceholderClient(new ConfigService(), new HttpService());
		getApiUserInteractor = new GetApiUserInteractor(jsonplaceholderClient);
	});

	describe('execute', () => {
		it('should return a collection of users from the API successfully', async () => {
			jest.spyOn(JsonplaceholderClient.prototype, 'getUsers').mockImplementation(async () => data);
			const response = await getApiUserInteractor.execute();
			expect(response.data).toEqual(data);
		});

		it('should return a undefined for collection of users from the API successfully', async () => {
			jest.spyOn(JsonplaceholderClient.prototype, 'getUsers').mockImplementation(async () => undefined);
			const response = await getApiUserInteractor.execute();
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});

		it('should return error code when infrastructure throws exception', async () => {
			jest.spyOn(JsonplaceholderClient.prototype, 'getUsers').mockRejectedValue(new Error('ERROR DB'));
			const response = await getApiUserInteractor.execute();
			expect(response.data).toBe(undefined);
			expect(response.error.code).toBe('ERRORCODE');
		});
	});
});
