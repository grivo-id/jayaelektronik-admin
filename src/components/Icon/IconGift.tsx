import { FC } from 'react';

interface IconGiftProps {
    className?: string;
}

const IconGift: FC<IconGiftProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V12H20Z" fill="currentColor"/>
            <path d="M20 8H4V10H20V8Z" fill="currentColor"/>
            <path d="M12 8V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 8C4 8 5 5 8 5C11 5 12 8 12 8C12 8 13 5 16 5C19 5 20 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
};

export default IconGift;
