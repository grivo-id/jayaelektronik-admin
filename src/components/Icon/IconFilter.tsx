import { FC } from 'react';

interface IconFilterProps {
    className?: string;
}

const IconFilter: FC<IconFilterProps> = ({ className }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
        </svg>
    );
};

export default IconFilter;
