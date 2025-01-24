import { FC } from 'react';

interface AvatarProps {
    src?: string;
    size?: number;
    className?: string;
}

const Avatar: FC<AvatarProps> = ({ src, size = 100, className }) => {
    return (
        <div className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${className}`} style={{ width: size, height: size }}>
            {src ? (
                <img src={src} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-700"
                    width={size * 0.6}
                    height={size * 0.6}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )}
        </div>
    );
};

export default Avatar;
