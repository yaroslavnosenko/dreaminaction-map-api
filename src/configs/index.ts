export const appConfigs = {
  port: process.env.PORT || 3000,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@mock.com',
  jwtSecret: process.env.JWT_SECRET || 'jwt',
  placesLimit: 100,
  database: {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    name: process.env.DATABASE_NAME || 'dreaminaction',
  },
}
