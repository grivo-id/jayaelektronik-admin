const Tooltip = ({ children, text, position = 'bottom' }) => {
    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    };

    const arrowClasses = {
        top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45',
        bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
        left: 'top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 rotate-45',
        right: 'top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 rotate-45',
    };

    return (
        <div className="relative inline-block group">
            {children}

            <div
                className={`absolute z-10 invisible opacity-0 bg-gray-800 text-white text-sm px-2 py-1 rounded transition-opacity duration-200 group-hover:visible group-hover:opacity-100 ${positionClasses[position]} w-fit whitespace-nowrap left-1/2 transform -translate-x-1/2`}
            >
                {text}
                <div className={`absolute w-2 h-2 bg-gray-800 ${arrowClasses[position]}`}></div>
            </div>
        </div>
    );
};

export default Tooltip;
