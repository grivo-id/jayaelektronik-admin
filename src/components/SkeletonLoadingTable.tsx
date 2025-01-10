interface SkeletonLoadingProps {
    rows: number;
    columns: number;
}

const SkeletonLoadingTable = ({ rows, columns }: SkeletonLoadingProps) => {
    return (
        <tbody>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                    {Array.from({ length: columns - 1 }).map((_, index) => (
                        <td key={index} className="py-4 px-4 ">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                    ))}
                    <td className="py-4 px-4 ">
                        <div className="flex gap-4 items-center justify-center">
                            <div className="bg-gray-200 h-6 rounded w-16"></div>
                            <div className="bg-gray-200 h-6 rounded w-16"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default SkeletonLoadingTable;
