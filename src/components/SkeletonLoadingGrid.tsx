const SkeletonLoadingGrid = () => {
    return (
        <>
            {[...Array(9)].map((_, index) => (
                <div key={index} className="panel h-full">
                    <div className="flex flex-col h-full">
                        <div className="relative w-full h-48 mb-4">
                            <div className="w-full h-full bg-gray-300 animate-pulse rounded-t-md"></div>
                        </div>
                        <div className="flex flex-col flex-1 pt-0">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-6 w-3/4 bg-gray-300 animate-pulse rounded"></div>
                                    <div className="h-6 w-1/4 bg-gray-300 animate-pulse rounded-full"></div>
                                </div>
                                <div className="mb-4">
                                    <div className="h-4 w-full bg-gray-300 animate-pulse rounded mb-2"></div>
                                    <div className="h-4 w-full bg-gray-300 animate-pulse rounded mb-2"></div>
                                    <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded"></div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="h-6 w-1/4 bg-gray-300 animate-pulse rounded-full mr-2"></div>
                                    <div className="h-6 w-1/3 bg-gray-300 animate-pulse rounded-full"></div>
                                </div>
                                <div className="text-sm flex items-center justify-between mb-4">
                                    <div className="h-5 w-2/4 bg-gray-300 animate-pulse rounded"></div>
                                    <div className="h-4 w-1/3 bg-gray-300 animate-pulse rounded"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-auto pt-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
                                <div className="h-8 w-10 bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-8 w-10 bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-8 w-10 bg-gray-300 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default SkeletonLoadingGrid;
