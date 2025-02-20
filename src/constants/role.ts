export const roleOptions = [
    { value: 1, label: 'Member' },
    { value: 2, label: 'Admin' },
];

export const getRoleIdByName = (roleName: string): number => {
    const role = roleOptions.find((option) => option.label === roleName);
    return role ? role.value : 0;
};

export const roleCodeOpt = [
    { value: 'lvl_perms_member', label: 'Member' },
    { value: 'lvl_perms_admin', label: 'Admin' },
    { value: 'lvl_perms_manager', label: 'Manager' },
];
