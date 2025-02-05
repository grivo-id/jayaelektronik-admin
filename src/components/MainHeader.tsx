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
}

const MainHeader = ({ title, subtitle, addText, onAdd, onSearchChange, search, hideAddButton, selectedCount = 0, onBulkDelete, onFilterClick }: MainHeaderProps) => {
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
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                        {addText}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                className="form-input ltr:pl-9 rtl:pr-9 ltr:sm:pr-4 rtl:sm:pl-4 ltr:pr-9 rtl:pl-9 peer sm:w-[200px]"
                                placeholder="Search..."
                                value={search}
                                onChange={onSearchChange}
                            />
                            <button type="button" className="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch className="mx-auto" />
                            </button>
                        </div>
                        {onFilterClick && (
                            <button type="button" className="btn btn-outline-primary p-2" onClick={onFilterClick}>
                                <IconFilter className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
        </>
    );
};

export default MainHeader;
