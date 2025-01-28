import React from 'react';
import IconSearch from './Icon/IconSearch';
import IconUserPlus from './Icon/IconUserPlus';

interface MainHeaderProps {
    title: string;
    subtitle: string;
    addText?: string;
    onAdd?: () => void;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    search: string;
    hideAddButton?: boolean;
}

const MainHeader = ({ title, subtitle, addText, onAdd, onSearchChange, search, hideAddButton }: MainHeaderProps) => {
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
                    <div className="relative">
                        <input type="text" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" placeholder="Search..." value={search} onChange={onSearchChange} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
        </>
    );
};

export default MainHeader;
