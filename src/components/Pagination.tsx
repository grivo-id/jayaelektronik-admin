interface PaginationProps {
    activePage: number;
    itemsCountPerPage: number;
    totalItemsCount: number;
    pageRangeDisplayed: number;
    onChange: (pageNumber: number) => void;
}

const Pagination = ({ activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed, onChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalItemsCount / itemsCountPerPage);
    const lastPage = totalPages;

    const getDisplayedPages = () => {
        const displayedPages = [];
        let startPage = Math.max(1, activePage - Math.floor(pageRangeDisplayed / 2));
        let endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

        if (endPage - startPage + 1 < pageRangeDisplayed) {
            startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            displayedPages.push(i);
        }

        return displayedPages;
    };

    const displayedPages = getDisplayedPages();

    return (
        <div className="flex items-center justify-center mt-10">
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => onChange(1)}
                    disabled={activePage === 1}
                >
                    First
                </button>
                <button
                    type="button"
                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => onChange(activePage - 1)}
                    disabled={activePage === 1}
                >
                    Prev
                </button>

                {displayedPages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`flex justify-center font-semibold px-3.5 py-2 rounded transition ${
                            page === activePage
                                ? 'bg-primary text-white dark:text-white-light dark:bg-primary'
                                : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                        }`}
                        onClick={() => onChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => onChange(activePage + 1)}
                    disabled={activePage === lastPage}
                >
                    Next
                </button>
                <button
                    type="button"
                    className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    onClick={() => onChange(lastPage)}
                    disabled={activePage === lastPage}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default Pagination;
