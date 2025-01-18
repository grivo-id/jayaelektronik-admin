import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

interface Option {
    value: string;
    label: string;
}

interface MultipleSelectProps {
    name: string;
    control: any;
    options: Option[];
    label: string;
    placeholder?: string;
    error?: string;
    isFetching?: boolean;
}

const MultipleSelect = ({ name, control, options, label, placeholder, error, isFetching }: MultipleSelectProps) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <CreatableSelect
                        isMulti
                        options={options}
                        value={value?.map((val: string) => ({ value: val, label: val }))}
                        onChange={(selectedOptions) => {
                            const values = selectedOptions?.map((option) => option.value) || [];
                            onChange(values);
                        }}
                        onCreateOption={(inputValue) => {
                            onChange([...(value || []), inputValue]);
                        }}
                        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                        noOptionsMessage={({ inputValue }) => `"${inputValue}" not found`}
                        placeholder={placeholder}
                        className="react-select"
                        classNamePrefix="select"
                        isDisabled={isFetching}
                    />
                )}
            />
            {error && <span className="text-danger">{error}</span>}
        </div>
    );
};

export default MultipleSelect;
