import { ApiProperty } from '@nestjs/swagger';

class UserBaseDTO {
	id: string;
	name: string;
	password: string;
	username: string;
	email: string;
	phone: string;
	website: string;
}
/* Request DTOs */
export class CreateUserRequestDTO {
	@ApiProperty()
	name: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	website: string;
}

export type UpdateUserRequestDTO = Partial<UserBaseDTO>;

export type UpdateUserResponseDTO = Partial<UserBaseDTO>;

/* Response DTOs */
export type GetUserResponseDTO = Partial<UserBaseDTO>;
