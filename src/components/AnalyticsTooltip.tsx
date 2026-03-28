import React from 'react';
import IconInfoCircle from './Icon/IconInfoCircle';

interface AnalyticsTooltipProps {
    title: string;
    description: string;
}

const AnalyticsTooltip: React.FC<AnalyticsTooltipProps> = ({ title, description }) => {
    return (
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="group relative inline-block">
                <IconInfoCircle className="w-4 h-4 text-gray-400 hover:text-primary cursor-help transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 w-72">
                    <div className="bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg">
                        <p className="leading-relaxed">{description}</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTooltip;
