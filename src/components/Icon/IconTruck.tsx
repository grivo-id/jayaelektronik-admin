import { FC } from 'react';

interface IconTruckProps {
    className?: string;
}

const IconTruck: FC<IconTruckProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M2 8H14V14H2V8Z" fill="currentColor"/>
            <path d="M14 5H17L20 8V14H14V5Z" fill="currentColor"/>
            <path d="M2 14V17C2 17.5523 2.44772 18 3 18H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14V17C14 17.5523 14.4477 18 15 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="6" cy="18" r="2" fill="currentColor"/>
            <circle cx="17" cy="18" r="2" fill="currentColor"/>
            <path d="M3 5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
};

export default IconTruck;
