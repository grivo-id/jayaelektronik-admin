import { FC } from 'react';

interface IconMenuLoyaltyProps {
    className?: string;
}

const IconMenuLoyalty: FC<IconMenuLoyaltyProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M17 10H7C6.46957 10 5.96086 10.2107 5.58579 10.5858C5.21071 10.9609 5 11.4696 5 12V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V12C19 11.4696 18.7893 10.9609 18.4142 10.5858C18.0391 10.2107 17.5304 10 17 10Z" fill="currentColor"/>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
    );
};

export default IconMenuLoyalty;
