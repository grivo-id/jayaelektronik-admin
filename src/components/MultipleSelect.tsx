import { Controller } from 'react-hook-form';
import Select from 'react-select';

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
                    <Select
                        isMulti
                        options={options}
                        value={options.filter((option) => value?.includes(option.value))}
                        onChange={(selectedOptions) => onChange(selectedOptions?.map((option) => option.value))}
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
