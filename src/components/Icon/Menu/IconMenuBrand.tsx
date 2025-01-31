import { FC } from 'react';

interface IconMenuBrandProps {
    className?: string;
}

const IconMenuBrand: FC<IconMenuBrandProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                opacity="0.5"
                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                fill="currentColor"
            />
            <path
                d="M11.2506 7.75C11.2506 7.33579 11.5864 7 12.0006 7C12.4148 7 12.7506 7.33579 12.7506 7.75V8.25C12.7506 8.66421 12.4148 9 12.0006 9C11.5864 9 11.2506 8.66421 11.2506 8.25V7.75Z"
                fill="currentColor"
            />
            <path
                d="M12.0006 11C11.5864 11 11.2506 11.3358 11.2506 11.75V16.25C11.2506 16.6642 11.5864 17 12.0006 17C12.4148 17 12.7506 16.6642 12.7506 16.25V11.75C12.7506 11.3358 12.4148 11 12.0006 11Z"
                fill="currentColor"
            />
            <path
                d="M7 12.0006C7 11.5864 7.33579 11.2506 7.75 11.2506H16.25C16.6642 11.2506 17 11.5864 17 12.0006C17 12.4148 16.6642 12.7506 16.25 12.7506H7.75C7.33579 12.7506 7 12.4148 7 12.0006Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default IconMenuBrand;
