import { FC } from 'react';

interface IconChevronDownProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconChevronDown: FC<IconChevronDownProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default IconChevronDown;
