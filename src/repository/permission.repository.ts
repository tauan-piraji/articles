import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Permission } from 'src/modules/permissions/domain/entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {

  constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

}