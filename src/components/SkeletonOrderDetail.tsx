const SkeletonOrderDetail = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    <div>
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5">
                <div className="panel">
                    <div className="mb-5">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index}>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="mb-5">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index}>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div>
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="table-responsive">
                            <table className="table-striped table-hover w-full">
                                <thead>
                                    <tr>
                                        {[...Array(6)].map((_, index) => (
                                            <th key={index}>
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(3)].map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {[...Array(6)].map((_, colIndex) => (
                                                <td key={colIndex}>
                                                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                                                    {colIndex === 0 && <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-1" />}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse ml-auto" />
                                        </td>
                                        <td>
                                            <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonOrderDetail;
