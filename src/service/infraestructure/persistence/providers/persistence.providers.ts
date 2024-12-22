import { Sequelize } from 'sequelize-typescript';
import { persistenceConfig } from '../../configuration/persistence.configuration';
import { Character } from 'src/service/application-core/character/entity/character.entity';

export const PersistenceProviders = [{
    provide: 'SEQUELIZE',
    useFactory: async () => {
        const config = persistenceConfig;
        const sequelize = new Sequelize(config);
        sequelize.addModels([Character]);
        await sequelize.sync();
        return sequelize;
    },
}];