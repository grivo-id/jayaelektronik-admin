import React from 'react';
import IconSearch from './Icon/IconSearch';
import IconUserPlus from './Icon/IconUserPlus';
import { roleCodeOpt } from '../constants/role';
import IconChevronDown from './Icon/IconChevronDown';

interface MainHeaderProps {
    title: string;
    subtitle: string;
    addText: string;
    onAdd: () => void;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    search: string;
    roleCode: string;
    onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MainUserHeader = ({ title, subtitle, addText, onAdd, onSearchChange, search, roleCode, onRoleChange }: MainHeaderProps) => {
    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div>
                        <button type="button" className="btn btn-primary" onClick={onAdd}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                            {addText}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select className="form-select pr-10" value={roleCode} onChange={onRoleChange}>
                                {roleCodeOpt.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute top-1/2 transform -translate-y-1/2 right-3">
                                <IconChevronDown className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="relative">
                            <input type="text" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" placeholder="Search..." value={search} onChange={onSearchChange} />
                            <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                                <IconSearch className="mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-[#e0e6ed] dark:bg-[#1b2e4b] mb-5"></div>
        </>
    );
};

export default MainUserHeader;
