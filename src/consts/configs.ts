export const appConfigs = {
  port: process.env.PORT || 3001,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@mail.mock',
  jwtSecret: process.env.JWT_SECRET || 'jwt',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '3306',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    name: process.env.DATABASE_NAME || 'dreaminaction',
  },
}
