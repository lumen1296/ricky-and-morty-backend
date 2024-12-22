import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JsonplaceholderClient } from '../../service/infraestructure/microservice-clients/http/jsonplaceholder.client';

// import { AxiosResponse } from 'axios';
jest.mock('axios');

import * as apiUserData from '../data/api-user.data.json';
import { of } from 'rxjs';

describe('UsersRestClient', () => {
	let jsonplaceholderClient: JsonplaceholderClient;
	let configService: ConfigService;
	let httpService: HttpService;

	beforeEach(async () => {
		jest.clearAllMocks();
		const restClientModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [JsonplaceholderClient, ConfigService],
			exports: [JsonplaceholderClient],
		}).compile();

		jsonplaceholderClient = restClientModule.get<JsonplaceholderClient>(JsonplaceholderClient);
		configService = restClientModule.get<ConfigService>(ConfigService);
		httpService = restClientModule.get<HttpService>(HttpService);
	});

	it('should return logs obtained from API users', async () => {
		const axiosResponse: any = {
			data: apiUserData,
			status: 200,
			statusText: 'OK',
			headers: {},
			config: {},
		};

		jest
			.spyOn(configService, 'get')
			.mockImplementationOnce(() => 'https://jsonplaceholder.typicode.com/')
			.mockImplementationOnce(() => 'users');

		jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(axiosResponse));

		const result = await jsonplaceholderClient.getUsers();
		expect(result).toEqual(apiUserData);
	});

	it('should throw new Error', async () => {
		jest
			.spyOn(configService, 'get')
			.mockImplementationOnce(() => undefined)
			.mockImplementationOnce(() => 'users');

		await expect(jsonplaceholderClient.getUsers()).rejects.toThrow();
	});
});
