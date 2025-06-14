import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1749842311147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'Id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'Name',
            type: 'varchar',
          },
          {
            name: 'Email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'Password',
            type: 'varchar',
          },
          {
            name: 'RememberToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'CreatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'UpdatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
