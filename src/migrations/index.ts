import * as migration_20261127_102402_initial from './20261127_102402_initial';

export const migrations = [
  {
    up: migration_20261127_102402_initial.up,
    down: migration_20261127_102402_initial.down,
    name: '20261127_102402_initial'
  },
];
