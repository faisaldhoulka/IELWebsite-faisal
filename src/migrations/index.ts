import * as migration_20261127_105341_initial from './20261127_105341_initial';
import * as migration_20261127_133718_popups_ratings_footer_notices from './20261127_133718_popups_ratings_footer_notices';

export const migrations = [
  {
    up: migration_20261127_105341_initial.up,
    down: migration_20261127_105341_initial.down,
    name: '20261127_105341_initial',
  },
  {
    up: migration_20261127_133718_popups_ratings_footer_notices.up,
    down: migration_20261127_133718_popups_ratings_footer_notices.down,
    name: '20261127_133718_popups_ratings_footer_notices'
  },
];
