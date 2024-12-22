import { Module } from '@nestjs/common';
import { PersistenceProviders } from './providers/persistence.providers';


@Module({
	imports: [],
	providers: [...PersistenceProviders],
	exports: [...PersistenceProviders],
})
export class PersistenceModule {}
