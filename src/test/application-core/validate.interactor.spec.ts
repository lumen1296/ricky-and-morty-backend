import { JwtService } from '@nestjs/jwt';
import { ValidateTokenInteractor } from '../../service/application-core/auth/uses-cases/validate.interactor';

describe('ValidateTokenInteractor', () => {
	let validateTokenInteractor: ValidateTokenInteractor;
	const jwt =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc2VsdWlzY2FuZGlhLmZAZ21haWwuY29tIiwibmFtZSI6IiIsInVzZXJuYW1lIjoiIiwiaWF0IjoxNjE2MzY1MTgwLCJleHAiOjE2MTYzNjUyNDB9.rVmP8vWv-2Se4Ntyh7sxKJMOonf8X9binf_IGmWUjZQ';
	beforeEach(() => {
		validateTokenInteractor = new ValidateTokenInteractor(
			new JwtService({
				secret: 'test_secret',
				signOptions: { expiresIn: '60s' },
			}),
		);
	});

	describe('execute', () => {
		it('should return the validation of the jwt token', async () => {
			jest.spyOn(JwtService.prototype, 'verify').mockImplementation(async () => true);
			expect(await validateTokenInteractor.execute(jwt)).toBe(true);
		});
	});
});
