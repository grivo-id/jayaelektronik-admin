import { FC } from 'react';

interface IconMenuToastProps {
    className?: string;
}

const IconMenuToast: FC<IconMenuToastProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M19 6.5H5C3.89543 6.5 3 7.39543 3 8.5V17.5C3 18.6046 3.89543 19.5 5 19.5H19C20.1046 19.5 21 18.6046 21 17.5V8.5C21 7.39543 20.1046 6.5 19 6.5Z"
                fill="currentColor"
            />
            <path d="M4 5.5C4 4.94772 4.44772 4.5 5 4.5H19C19.5523 4.5 20 4.94772 20 5.5V6.5H4V5.5Z" fill="currentColor" />
            <path d="M7 11.5C7 11.2239 7.22386 11 7.5 11H16.5C16.7761 11 17 11.2239 17 11.5C17 11.7761 16.7761 12 16.5 12H7.5C7.22386 12 7 11.7761 7 11.5Z" fill="currentColor" />
            <path d="M7.5 14C7.22386 14 7 14.2239 7 14.5C7 14.7761 7.22386 15 7.5 15H12.5C12.7761 15 13 14.7761 13 14.5C13 14.2239 12.7761 14 12.5 14H7.5Z" fill="currentColor" />
        </svg>
    );
};

export default IconMenuToast;
