export interface PermissionChecker {

    isPermitted(
        role: string,
        module: string,
        action: 'read' | 'create' | 'edit' | 'delete'
    ): Promise<boolean>;
}
