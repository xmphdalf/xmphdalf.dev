import * as migration_20261017_065505_initial from './20261017_065505_initial';
import * as migration_20261017_072714_profile_years_languages from './20261017_072714_profile_years_languages';
import * as migration_20261017_073000_seed_profile from './20261017_073000_seed_profile';
import * as migration_20261017_080000_fill_profile_years_languages from './20261017_080000_fill_profile_years_languages';

export const migrations = [
  {
    up: migration_20261017_065505_initial.up,
    down: migration_20261017_065505_initial.down,
    name: '20261017_065505_initial',
  },
  {
    up: migration_20261017_072714_profile_years_languages.up,
    down: migration_20261017_072714_profile_years_languages.down,
    name: '20261017_072714_profile_years_languages',
  },
  {
    up: migration_20261017_073000_seed_profile.up,
    down: migration_20261017_073000_seed_profile.down,
    name: '20261017_073000_seed_profile',
  },
  {
    up: migration_20261017_080000_fill_profile_years_languages.up,
    down: migration_20261017_080000_fill_profile_years_languages.down,
    name: '20261017_080000_fill_profile_years_languages',
  },
];
