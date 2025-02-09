import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import IconX from './Icon/IconX';

interface FilterOption {
    value: string;
    label: string;
}

interface CategoryOption extends FilterOption {
    children?: FilterOption[];
}

interface FilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
    primaryFilterOptions?: FilterOption[];
    secondaryFilterOptions?: CategoryOption[];
    tertiaryFilterOptions?: FilterOption[];
    onPrimaryFilterChange?: (selectedOption: FilterOption | null) => void;
    onSecondaryFilterChange?: (selectedOption: FilterOption | null) => void;
    onTertiaryFilterChange?: (selectedOption: FilterOption | null) => void;
    primaryFilterPlaceholder?: string;
    secondaryFilterPlaceholder?: string;
    tertiaryFilterPlaceholder?: string;
    selectedPrimaryFilter?: FilterOption | null;
    selectedSecondaryFilter?: FilterOption | null;
    selectedTertiaryFilter?: FilterOption | null;
    children?: React.ReactNode;
    onApply?: () => void;
    onReset?: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
    isOpen,
    onClose,
    primaryFilterOptions,
    secondaryFilterOptions,
    onPrimaryFilterChange,
    onSecondaryFilterChange,
    primaryFilterPlaceholder = 'Filter primary...',
    secondaryFilterPlaceholder = 'Filter secondary...',
    tertiaryFilterPlaceholder = 'Filter tertiary...',
    selectedPrimaryFilter,
    selectedSecondaryFilter,
    selectedTertiaryFilter,
    tertiaryFilterOptions,
    onTertiaryFilterChange,
    children,
    onApply,
    onReset,
}) => {
    const [activeCategory, setActiveCategory] = useState<CategoryOption | null>(null);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [subMenuPosition, setSubMenuPosition] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSubMenuOpen(false);
                setActiveCategory(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const CustomOption = ({ innerProps, label, data }: any) => {
        const optionRef = useRef<HTMLDivElement>(null);
        const hasChildren = data.children && data.children.length > 0;

        const handleMouseEnter = () => {
            if (hasChildren && optionRef.current) {
                setActiveCategory(data);
                setIsSubMenuOpen(true);
                setSubMenuPosition(74);
            }
        };

        const handleMouseLeave = () => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
                setIsSubMenuOpen(false);
                setActiveCategory(null);
            }
        };

        const handleClick = () => {
            if (!hasChildren) {
                onSecondaryFilterChange?.(data);
                setIsSubMenuOpen(false);
                setActiveCategory(null);
            }
        };

        return (
            <div
                {...innerProps}
                ref={optionRef}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <span className="flex items-center">
                    {hasChildren && <span className="text-gray-400 mr-2">‹</span>}
                    {label}
                </span>
            </div>
        );
    };

    return (
        <>
            <div className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-[black]/60 z-[51] px-4 transition-[display]`} onClick={onClose} />

            <div
                className={`${
                    isOpen ? 'ltr:!right-0 rtl:!left-0' : ''
                } bg-white fixed ltr:-right-[400px] rtl:-left-[400px] top-0 bottom-0 w-full max-w-[400px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 z-[51] dark:bg-black p-4`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-semibold dark:text-white">Filter</h4>
                    <button type="button" className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" onClick={onClose}>
                        <IconX className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {primaryFilterOptions && (
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">{primaryFilterPlaceholder}</label>
                            <Select
                                options={primaryFilterOptions}
                                onChange={onPrimaryFilterChange}
                                placeholder={primaryFilterPlaceholder}
                                className="basic-select"
                                classNamePrefix="select"
                                value={selectedPrimaryFilter}
                                isClearable
                            />
                        </div>
                    )}

                    {secondaryFilterOptions && (
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium mb-2 dark:text-white">{secondaryFilterPlaceholder}</label>
                            <Select
                                options={secondaryFilterOptions}
                                components={{ Option: CustomOption }}
                                value={selectedSecondaryFilter}
                                onChange={(selected) => {
                                    if (!selected) {
                                        onSecondaryFilterChange?.(null);
                                    }
                                }}
                                placeholder={secondaryFilterPlaceholder}
                                className="basic-select"
                                classNamePrefix="select"
                                isClearable
                            />
                            {isSubMenuOpen && activeCategory && (
                                <div
                                    className="absolute right-full top-0 mr-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1 w-48"
                                    style={{ top: `${subMenuPosition}px` }}
                                    onMouseEnter={() => setIsSubMenuOpen(true)}
                                    onMouseLeave={() => setIsSubMenuOpen(false)}
                                >
                                    {activeCategory.children?.map((child) => (
                                        <div
                                            key={child.value}
                                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                            onClick={() => {
                                                onSecondaryFilterChange?.(child);
                                                setIsSubMenuOpen(false);
                                                setActiveCategory(null);
                                            }}
                                        >
                                            {child.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {tertiaryFilterOptions && (
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">{tertiaryFilterPlaceholder}</label>
                            <Select
                                options={tertiaryFilterOptions}
                                onChange={onTertiaryFilterChange}
                                placeholder={tertiaryFilterPlaceholder}
                                className="basic-select"
                                classNamePrefix="select"
                                value={selectedTertiaryFilter}
                                isClearable
                            />
                        </div>
                    )}

                    {children}

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            className="btn btn-outline-danger ltr:mr-2 rtl:ml-2"
                            onClick={() => {
                                onPrimaryFilterChange?.(null);
                                onSecondaryFilterChange?.(null);
                                onTertiaryFilterChange?.(null);
                                onReset?.();
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                onApply?.();
                                onClose();
                            }}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterSheet;
