import { FC } from 'react';

interface IconTrophyProps {
    className?: string;
}

const IconTrophy: FC<IconTrophyProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M17 3H7C5.34315 3 4 4.34315 4 6V8C4 9.65685 5.34315 11 7 11H7.5C8.22616 11.3075 8.81819 11.8235 9.16506 12.5C8.81819 13.1765 8.22616 13.6925 7.5 14H7C5.34315 14 4 15.3431 4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17C20 15.3431 18.6569 14 17 14H16.5C15.7738 13.6925 15.1818 13.1765 14.8349 12.5C15.1818 11.8235 15.7738 11.3075 16.5 11H17C18.6569 11 20 9.65685 20 8V6C20 4.34315 18.6569 3 17 3Z" fill="currentColor"/>
            <path d="M12 2L14 6H10L12 2Z" fill="currentColor"/>
            <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 7H7.5C8.32843 7 9 7.67157 9 8.5V11H7V7Z" fill="white"/>
            <path d="M17 7H16.5C15.6716 7 15 7.67157 15 8.5V11H17V7Z" fill="white"/>
        </svg>
    );
};

export default IconTrophy;
