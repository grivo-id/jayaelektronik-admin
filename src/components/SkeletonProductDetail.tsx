const SkeletonProductDetail = () => {
    return (
        <div className="pt-5">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="panel">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5" />
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5" />
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <div className="w-full aspect-square bg-gray-200 rounded animate-pulse" />
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5" />
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(2)].map((_, index) => (
                                <div key={index}>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(2)].map((_, index) => (
                                <div key={index}>
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="panel">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-5" />
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index}>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 justify-end">
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonProductDetail;
