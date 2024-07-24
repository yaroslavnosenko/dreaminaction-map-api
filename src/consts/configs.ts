export const appConfigs = {
  port: process.env.PORT || 8080,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@mail.mock',
  jwtSecret: process.env.JWT_SECRET || 'jwt',
  placesLimit: 100,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    name: process.env.DATABASE_NAME || 'dreaminaction',
  },
}
