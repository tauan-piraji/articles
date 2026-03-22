import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "src/repository/permission.repository";
import { Permission } from "src/modules/permissions/domain/entities/permission.entity";
import { PermissionChecker } from "./permission-checker";
import { Repository } from "typeorm";

@Injectable()
export class DataPermissionChecker implements PermissionChecker {

    constructor(
        private readonly permissionRepo: Repository<Permission>,
    ) { }

    async isPermitted(
        role: string,
        module: string,
        action: 'read' | 'create' | 'edit' | 'delete',
    ): Promise<boolean> {

        const permission = await this.permissionRepo.findOne({
            where: { rule: role, module },
        });

        if (!permission) return false;

        switch (action) {
            case 'read': return permission.canRead;
            case 'create': return permission.canCreate;
            case 'edit': return permission.canEdit;
            case 'delete': return permission.canDelete;
            default: return false;
        }
    }
}