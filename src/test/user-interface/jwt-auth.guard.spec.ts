import { JwtService } from '@nestjs/jwt';
import { ValidateTokenInteractor } from '../../service/application-core/auth/uses-cases/validate.interactor';
import { JwtAuthGuard } from '../../service/user-interface/guards/jwt-auth.guard';

describe('JwtAuthGuard', () => {
	let jwtAuthGuard: JwtAuthGuard;
	const jwt =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc2VsdWlzY2FuZGlhLmZAZ21haWwuY29tIiwibmFtZSI6IiIsInVzZXJuYW1lIjoiIiwiaWF0IjoxNjE2MzY1MTgwLCJleHAiOjE2MTYzNjUyNDB9.rVmP8vWv-2Se4Ntyh7sxKJMOonf8X9binf_IGmWUjZQ';
	beforeEach(() => {
		jwtAuthGuard = new JwtAuthGuard(
			new ValidateTokenInteractor(
				new JwtService({
					secret: 'test_secret',
					signOptions: { expiresIn: '60s' },
				}),
			),
		);
	});

	describe('canActivate', () => {
		const executionContext: any = {
			switchToHttp: jest.fn().mockReturnThis(),
			getRequest: jest.fn().mockReturnThis(),
		};
		it('should return true when the token is valid', async () => {
			(executionContext.switchToHttp().getRequest as jest.Mock<any, any>).mockReturnValueOnce({
				headers: { authorization: `bearer ${jwt}` },
			});
			jest.spyOn(ValidateTokenInteractor.prototype, 'execute').mockImplementation(async () => true);
			expect(await jwtAuthGuard.canActivate(executionContext)).toBe(true);
		});

		it('should return false when the token is not sent in the header or is not validated', async () => {
			(executionContext.switchToHttp().getRequest as jest.Mock<any, any>).mockReturnValueOnce({
				headers: { authorization: undefined },
			});
			expect(await jwtAuthGuard.canActivate(executionContext)).toBe(false);
		});
	});
});
