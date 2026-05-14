import { FC } from 'react';

interface IconMenuLogsProps {
    className?: string;
}

const IconMenuLogs: FC<IconMenuLogsProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path opacity="0.5" d="M4 19.5C4 18.6716 4.67157 18 5.5 18H16.5C17.3284 18 18 18.6716 18 19.5V20.5C18 21.3284 17.3284 22 16.5 22H5.5C4.67157 22 4 21.3284 4 20.5V19.5Z" fill="currentColor"/>
            <path opacity="0.5" d="M4 12.5C4 11.6716 4.67157 11 5.5 11H16.5C17.3284 11 18 11.6716 18 12.5V13.5C18 14.3284 17.3284 15 16.5 15H5.5C4.67157 15 4 14.3284 4 13.5V12.5Z" fill="currentColor"/>
            <path opacity="0.5" d="M4 5.5C4 4.67157 4.67157 4 5.5 4H16.5C17.3284 4 18 4.67157 18 5.5V6.5C18 7.32843 17.3284 8 16.5 8H5.5C4.67157 8 4 7.32843 4 6.5V5.5Z" fill="currentColor"/>
            <path d="M20 6H21C21.5523 6 22 6.44772 22 7V7C22 7.55228 21.5523 8 21 8H20C19.4477 8 19 7.55228 19 7V7C19 6.44772 19.4477 6 20 6Z" fill="currentColor"/>
            <path d="M20 13H21C21.5523 13 22 13.4477 22 14V14C22 14.5523 21.5523 15 21 15H20C19.4477 15 19 14.5523 19 14V14C19 13.4477 19.4477 13 20 13Z" fill="currentColor"/>
            <path d="M20 20H21C21.5523 20 22 20.4477 22 21V21C22 21.5523 21.5523 22 21 22H20C19.4477 22 19 21.5523 19 21V21C19 20.4477 19.4477 20 20 20Z" fill="currentColor"/>
        </svg>
    );
};

export default IconMenuLogs;
