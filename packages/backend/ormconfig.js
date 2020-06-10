const isProd = process.env.NODE_ENV === 'production';

console.log({ isProd });

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:uwu@uwu-postgres/postgres',
    logging: true /* !isProd */,
    synchronize: !isProd,
    entities: [isProd ? 'lib/entity/*.js' : 'src/entity/*.ts'],
    migrations: [isProd ? 'lib/migration/*.js' : 'src/migration/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
    },
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
};
