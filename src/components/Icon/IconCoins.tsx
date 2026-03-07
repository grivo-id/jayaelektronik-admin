import { FC } from 'react';

interface IconCoinsProps {
    className?: string;
}

const IconCoins: FC<IconCoinsProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
            <path d="M12 6C10.3431 6 9 6.89543 9 8C9 9.10457 10.3431 10 12 10C13.6569 10 15 9.10457 15 8C15 6.89543 13.6569 6 12 6Z" fill="white"/>
            <path d="M12 14C10.3431 14 9 14.8954 9 16C9 17.1046 10.3431 18 12 18C13.6569 18 15 17.1046 15 16C15 14.8954 13.6569 14 12 14Z" fill="white"/>
            <path d="M9 12C9 13.1046 10.3431 14 12 14C13.6569 14 15 13.1046 15 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 8C9 9.10457 10.3431 10 12 10C13.6569 10 15 9.10457 15 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
};

export default IconCoins;
