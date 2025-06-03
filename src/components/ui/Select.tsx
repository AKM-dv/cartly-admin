import React from 'react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export function Select({
  className,
  label,
  options,
  error,
  helperText,
  onChange,
  ...props
}: SelectProps) {
  const id = props.id || props.name;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#004CBF] focus:outline-none focus:ring-[#004CBF] sm:text-sm',
          error && 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500',
          className
        )}
        onChange={handleChange}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500" id={`${id}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Select;