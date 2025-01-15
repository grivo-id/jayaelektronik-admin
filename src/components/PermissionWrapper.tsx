import React from 'react';
import { Role, RolePermissions, Permission } from '../constants/permission';

interface PermissionWrapperProps {
    role: Role;
    requiredPermissions: Permission[];
    children: React.ReactNode;
}

const PermissionWrapper = ({ role, requiredPermissions, children }: PermissionWrapperProps) => {
    const userPermissions = RolePermissions[role];

    const hasRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (hasRequiredPermissions) {
        return <>{children}</>;
    }

    return null;
};

export default PermissionWrapper;
