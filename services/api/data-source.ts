import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'cleanaus',
  password: process.env.DB_PASSWORD || 'cleanaus_dev_password',
  database: process.env.DB_NAME || 'cleanaus_dev',
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  ssl: process.env.DB_SSL === 'true',
});
