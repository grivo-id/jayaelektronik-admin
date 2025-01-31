import { FC } from 'react';

interface IconMenuBannerProps {
    className?: string;
}

const IconMenuBanner: FC<IconMenuBannerProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
                fill="currentColor"
            />
            <path d="M10 6H6V10H10V6Z" fill="currentColor" />
            <path d="M10 14H6V18H10V14Z" fill="currentColor" />
            <path d="M18 6H14V10H18V6Z" fill="currentColor" />
            <path d="M18 14H14V18H18V14Z" fill="currentColor" />
        </svg>
    );
};

export default IconMenuBanner;
