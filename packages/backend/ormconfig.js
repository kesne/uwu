// const isProd = process.env.NODE_ENV === 'production';
const isProd = true;

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:uwu@uwu-postgres/postgres',
    logging: !isProd,
    synchronize: !isProd,
    entities: [isProd ? 'lib/entity/*.js' : 'src/entity/*.ts'],
    migrations: [isProd ? 'lib/migration/*.js' : 'src/migration/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
    },
};
