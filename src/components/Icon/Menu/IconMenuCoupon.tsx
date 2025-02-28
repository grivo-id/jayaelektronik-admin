import { FC } from 'react';

interface IconMenuCouponProps {
    className?: string;
}

const IconMenuCoupon: FC<IconMenuCouponProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M2 8.58579C2 6.76579 2 5.85579 2.42543 5.14621C2.85086 4.43663 3.67164 4.06477 5.31321 3.32106L7.24389 2.46506C9.67292 1.41406 10.8874 0.888557 12.2 0.888557C13.5126 0.888557 14.7271 1.41406 17.1561 2.46506L19.0868 3.32106C20.7284 4.06477 21.5491 4.43663 21.9746 5.14621C22.4 5.85579 22.4 6.76579 22.4 8.58579V15.4142C22.4 17.2342 22.4 18.1442 21.9746 18.8538C21.5491 19.5634 20.7284 19.9352 19.0868 20.6789L17.1561 21.5349C14.7271 22.5859 13.5126 23.1114 12.2 23.1114C10.8874 23.1114 9.67292 22.5859 7.24389 21.5349L5.31321 20.6789C3.67164 19.9352 2.85086 19.5634 2.42543 18.8538C2 18.1442 2 17.2342 2 15.4142V8.58579Z"
                fill="currentColor"
            />
            <path d="M9 7C9 7.55228 8.55228 8 8 8C7.44772 8 7 7.55228 7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7Z" fill="currentColor" />
            <path d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z" fill="currentColor" />
            <path d="M9 17C9 17.5523 8.55228 18 8 18C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16C8.55228 16 9 16.4477 9 17Z" fill="currentColor" />
            <path d="M15 7L11 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export default IconMenuCoupon;
