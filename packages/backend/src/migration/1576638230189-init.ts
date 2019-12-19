import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class init1576638230189 implements MigrationInterface {
    async up(queryRunner: QueryRunner) {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: 'twitchID',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: 'token',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        default: 'uuid_generate_v4()',
                        isPrimary: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'reason',
                        type: 'varchar',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'token',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
            }),
        );
    }

    async down(queryRunner: QueryRunner) {
        const table = await queryRunner.getTable("token");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes("userId"));
            foreignKey && await queryRunner.dropForeignKey("token", foreignKey);
        }
        queryRunner.dropTable('token');
        queryRunner.dropTable('user');
    }
}
