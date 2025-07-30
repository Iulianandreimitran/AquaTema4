import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Permission } from './permissions/permission.entity';
import { UserRole } from './user-roles/user-role.entity';
import { Role } from './roles/role.entity';
import { RolePermission } from './role-permissions/role-permission.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'mini_sprint_4',
  synchronize: false,
  entities: [User, Permission, UserRole, Role, RolePermission],
  migrations: ['src/migrations/.ts'],
});
