module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:uwu@uwu-postgres/postgres',
    logging: true,
    synchronize: true,
    entities: ['src/entity/*.ts'],
    migrations: ['src/migration/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
    },
};
