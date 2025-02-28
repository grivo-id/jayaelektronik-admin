import React from 'react';
import IconSearch from './Icon/IconSearch';
import IconUserPlus from './Icon/IconUserPlus';
import IconFilter from './Icon/IconFilter';

interface FilterOption {
    value: string;
    label: string;
}

interface CategoryOption extends FilterOption {
    children?: FilterOption[];
}

interface MainHeaderProps {
    title: string;
    subtitle: string;
    addText?: string;
    onAdd?: () => void;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    search: string;
    hideAddButton?: boolean;
    selectedCount?: number;
    onBulkDelete?: () => void;
    onFilterClick?: () => void;
    icon?: React.ReactNode;
    onClearSearch?: () => void;
}

const MainHeader = ({
    title,
    subtitle,
    addText,
    onAdd,
    onSearchChange,
    search,
    hideAddButton,
    selectedCount = 0,
    onBulkDelete,
    onFilterClick,
    icon = <IconUserPlus className="ltr:mr-2 rtl:ml-2" />,
    onClearSearch,
}: MainHeaderProps) => {
    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    {!hideAddButton && (
                        <div className="flex gap-3">
                            <div>
                                {selectedCount > 0 ? (
                                    <button type="button" className="btn btn-danger" onClick={onBulkDelete}>
                                        Delete ({selectedCount})
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" onClick={onAdd}>
                                        {icon}
                                        {addText}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {onFilterClick && (
                        <button type="button" className="btn btn-outline-primary" onClick={onFilterClick}>
                            <IconFilter className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Filter
                        </button>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                className="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-8 rtl:sm:pl-8 ltr:pr-8 rtl:pl-8 peer sm:w-[200px]"
                                placeholder="Search..."
                                value={search}
                                onChange={onSearchChange}
                            />
                            <button type="button" className="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch className="mx-auto" />
                            </button>
                            {search && onClearSearch && (
                                <button type="button" className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={onClearSearch}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
        </>
    );
};

export default MainHeader;
