import React, { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'primary' }) => {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
    };

    return <span className={`text-xs px-2 py-1 rounded ${colorClasses[color]}`}>{children}</span>;
};
