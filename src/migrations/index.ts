import * as migration_20261017_065505_initial from './20261017_065505_initial';

export const migrations = [
  {
    up: migration_20261017_065505_initial.up,
    down: migration_20261017_065505_initial.down,
    name: '20261017_065505_initial'
  },
];
