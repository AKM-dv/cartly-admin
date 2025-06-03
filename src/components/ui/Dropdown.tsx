import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className,
  error
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-[#35383f] mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-2 text-left bg-white border rounded-md flex items-center justify-between',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-[#004cbf]/20',
          error ? 'border-red-300' : 'border-[#004cbf]/20',
          'hover:border-[#004cbf]/40',
          className
        )}
      >
        <span className={cn(
          'block truncate',
          !selectedOption && 'text-gray-500'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown menu */}
      <div className={cn(
        'absolute z-50 w-full mt-1 bg-white border border-[#004cbf]/20 rounded-md shadow-lg',
        'transition-all duration-200 ease-in-out',
        isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none',
        'max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-[#004cbf]/10 scrollbar-track-transparent'
      )}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
            className={cn(
              'w-full px-4 py-2 text-left',
              'transition-colors duration-150',
              'hover:bg-[#e6f0ff]',
              option.value === value && 'bg-[#e6f0ff] text-[#004cbf]'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 