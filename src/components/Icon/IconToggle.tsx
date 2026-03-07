import { FC } from 'react';

interface IconToggleProps {
    className?: string;
}

const IconToggle: FC<IconToggleProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12" fill="currentColor"/>
            <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17V7Z" fill="currentColor"/>
            <rect x="3" y="7" width="18" height="10" rx="5" stroke="currentColor" strokeWidth="2"/>
        </svg>
    );
};

export default IconToggle;
