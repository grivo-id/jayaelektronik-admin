import React, { useState, useEffect, useRef } from 'react';
import IconSearch from './Icon/IconSearch';
import IconUserPlus from './Icon/IconUserPlus';
import Select from 'react-select';

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
    primaryFilterOptions?: FilterOption[];
    secondaryFilterOptions?: CategoryOption[];
    onPrimaryFilterChange?: (selectedOption: FilterOption | null) => void;
    onSecondaryFilterChange?: (selectedOption: FilterOption | null) => void;
    primaryFilterPlaceholder?: string;
    secondaryFilterPlaceholder?: string;
}

const MainHeader = ({
    title,
    subtitle,
    addText,
    onAdd,
    onSearchChange,
    search,
    hideAddButton,
    primaryFilterOptions,
    secondaryFilterOptions,
    onPrimaryFilterChange,
    onSecondaryFilterChange,
    primaryFilterPlaceholder = 'Filter primary...',
    secondaryFilterPlaceholder = 'Filter secondary...',
}: MainHeaderProps) => {
    const [activeCategory, setActiveCategory] = useState<CategoryOption | null>(null);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [subMenuPosition, setSubMenuPosition] = useState(40);
    const [isParentOpen, setIsParentOpen] = useState(false);
    const [selectedChild, setSelectedChild] = useState<FilterOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSubMenuOpen(false);
                setActiveCategory(null);
                setIsParentOpen(false);
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
            if (hasChildren) {
                setActiveCategory(data);
                setIsSubMenuOpen(true);
                setSubMenuPosition(45);
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
                setIsParentOpen(false);
                setIsSubMenuOpen(false);
                setActiveCategory(null);
                setSelectedChild(data);
            }
        };

        return (
            <div
                {...innerProps}
                ref={optionRef}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                <span>{label}</span>
                {hasChildren && <span className="text-gray-400">›</span>}
            </div>
        );
    };

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
                                <button type="button" className="btn btn-primary" onClick={onAdd}>
                                    <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                    {addText}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {secondaryFilterOptions && (
                                <div className="relative w-full sm:w-44" ref={dropdownRef}>
                                    <div className="w-full">
                                        <Select
                                            options={secondaryFilterOptions}
                                            components={{ Option: CustomOption }}
                                            onChange={(selected) => {
                                                if (!selected) {
                                                    onSecondaryFilterChange?.(null);
                                                    setSelectedChild(null);
                                                }
                                            }}
                                            placeholder={secondaryFilterPlaceholder}
                                            className="basic-select"
                                            classNamePrefix="select"
                                            value={selectedChild}
                                            menuIsOpen={isParentOpen}
                                            onMenuOpen={() => setIsParentOpen(true)}
                                            onMenuClose={() => {
                                                if (!isSubMenuOpen) {
                                                    setIsParentOpen(false);
                                                }
                                            }}
                                            isClearable
                                        />
                                    </div>
                                    {isSubMenuOpen && activeCategory && (
                                        <div
                                            className="absolute left-0 sm:left-full mt-2 sm:mt-0 ml-0 sm:ml-2 z-50 w-full sm:w-48"
                                            style={{ top: window.innerWidth >= 640 ? subMenuPosition : 'auto' }}
                                            onMouseEnter={() => setIsSubMenuOpen(true)}
                                            onMouseLeave={() => setIsSubMenuOpen(false)}
                                        >
                                            <div className="w-full bg-white border rounded-lg shadow-lg py-1">
                                                {activeCategory.children?.map((child) => (
                                                    <div
                                                        key={child.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            onSecondaryFilterChange?.(child);
                                                            setIsSubMenuOpen(false);
                                                            setActiveCategory(null);
                                                            setIsParentOpen(false);
                                                            setSelectedChild(child);
                                                        }}
                                                    >
                                                        {child.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {primaryFilterOptions && (
                                <div className="w-full sm:w-44">
                                    <Select
                                        options={primaryFilterOptions}
                                        onChange={(selected) => onPrimaryFilterChange?.(selected as FilterOption | null)}
                                        placeholder={primaryFilterPlaceholder}
                                        className="basic-select"
                                        classNamePrefix="select"
                                        isClearable
                                    />
                                </div>
                            )}
                            <div className="relative w-full sm:w-auto">
                                <input type="text" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer w-full" placeholder="Search..." value={search} onChange={onSearchChange} />
                                <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                    <IconSearch className="mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
        </>
    );
};

export default MainHeader;
