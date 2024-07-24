import users from './0-create-users-table'
import features from './1-create-features-table'
import places from './2-create-places-table'
import featuresPlaces from './3-create-places-features-table'

export const migrations = [users, features, places, featuresPlaces]
