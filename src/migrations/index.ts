import * as migration_20260601_192924_initial_schema from './20260601_192924_initial_schema';
import * as migration_20260603_092111 from './20260603_092111';

export const migrations = [
  {
    up: migration_20260601_192924_initial_schema.up,
    down: migration_20260601_192924_initial_schema.down,
    name: '20260601_192924_initial_schema',
  },
  {
    up: migration_20260603_092111.up,
    down: migration_20260603_092111.down,
    name: '20260603_092111'
  },
];
