import dataSource from './data-source';

export const typeOrmConfig = {
  ...dataSource.options,
  migrationsRun: true,
};
