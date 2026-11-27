import * as migration_20261127_105341_initial from './20261127_105341_initial';

export const migrations = [
  {
    up: migration_20261127_105341_initial.up,
    down: migration_20261127_105341_initial.down,
    name: '20261127_105341_initial'
  },
];
