import { Controller } from 'react-hook-form';
import Select from 'react-select';

interface Option {
    value: string;
    label: string;
}

interface SingleSelectProps {
    name: string;
    control: any;
    options: Option[];
    label: string;
    placeholder?: string;
    error?: string;
    isFetching?: boolean;
}

const SingleSelect = ({ name, control, options, label, placeholder, error, isFetching }: SingleSelectProps) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Select
                        options={options}
                        value={options.find((option) => option.value === value)}
                        onChange={(selectedOption) => onChange(selectedOption?.value)}
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

export default SingleSelect;
