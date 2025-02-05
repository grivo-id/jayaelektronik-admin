import React from 'react';

const SkeletonOverview: React.FC = () => {
    return (
        <div>
            <div className="pt-5">
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="panel h-full animate-pulse">
                        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-5"></div>
                        <div className="space-y-3">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="panel h-full animate-pulse">
                            <div className="flex justify-between mb-5">
                                <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                            <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonOverview;
