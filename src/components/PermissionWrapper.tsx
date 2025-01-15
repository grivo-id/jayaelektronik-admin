import React, { useEffect } from 'react';
import { Role, RolePermissions, Permission } from '../constants/permission';
import { useNavigate } from 'react-router-dom';

interface PermissionWrapperProps {
    role?: Role;
    requiredPermissions: Permission[];
    children: React.ReactNode;
}

const PermissionWrapper = ({ role, requiredPermissions, children }: PermissionWrapperProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!role) {
            navigate('/login');
        }
    }, [role, navigate]);

    if (!role) return null;

    const userPermissions = RolePermissions[role];
    const hasRequiredPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (hasRequiredPermissions) {
        return <>{children}</>;
    }

    return null;
};

export default PermissionWrapper;
