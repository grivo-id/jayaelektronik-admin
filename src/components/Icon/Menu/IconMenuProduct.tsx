import { FC } from 'react';

interface IconMenuProductProps {
    className?: string;
}

const IconMenuProduct: FC<IconMenuProductProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M2 8.5C2 5.73858 2 4.35786 2.87868 3.47918C3.75736 2.6005 5.13807 2.6005 7.89949 2.6005H16.1005C18.8619 2.6005 20.2426 2.6005 21.1213 3.47918C22 4.35786 22 5.73858 22 8.5C22 11.2614 22 12.6421 21.1213 13.5208C20.2426 14.3995 18.8619 14.3995 16.1005 14.3995H7.89949C5.13807 14.3995 3.75736 14.3995 2.87868 13.5208C2 12.6421 2 11.2614 2 8.5Z"
                fill="currentColor"
            />
            <path
                d="M3.5 16.8995C3.5 16.4853 3.83579 16.1495 4.25 16.1495H19.75C20.1642 16.1495 20.5 16.4853 20.5 16.8995C20.5 17.3137 20.1642 17.6495 19.75 17.6495H4.25C3.83579 17.6495 3.5 17.3137 3.5 16.8995Z"
                fill="currentColor"
            />
            <path
                d="M5.5 20.8995C5.5 20.4853 5.83579 20.1495 6.25 20.1495H17.75C18.1642 20.1495 18.5 20.4853 18.5 20.8995C18.5 21.3137 18.1642 21.6495 17.75 21.6495H6.25C5.83579 21.6495 5.5 21.3137 5.5 20.8995Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconMenuProduct;
