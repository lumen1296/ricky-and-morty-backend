import { BadRequestException } from '@nestjs/common';
import { HomeController } from '../../service/user-interface/resolvers/home.controller';

describe('HomeController', () => {
	const homeController = new HomeController();
	describe('get', () => {
		it('should return BadRequestException', async () => {
			try {
				await homeController.get();
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});
	});

	describe('getWithBody', () => {
		it('should return an object with the request body', () => {
			const request: any = {
				body: {
					test: 'test',
				},
			};

			const response = homeController.getWithBody(request);
			expect(response).toEqual({ test: 'test' });
		});
	});
});
