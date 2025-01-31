import { FC } from 'react';

interface IconMenuBlogProps {
    className?: string;
}

const IconMenuBlog: FC<IconMenuBlogProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
                fill="currentColor"
            />
            <path d="M7 14.5L10.6586 12.1707C11.4388 11.6131 12.5612 11.6131 13.3414 12.1707L17 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 15V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 15V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default IconMenuBlog;
