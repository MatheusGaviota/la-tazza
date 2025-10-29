'use client';

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
  helpText?: string;
  placeholder?: string;
  maxLength?: number;
  monospace?: boolean;
}

export default function TextareaField({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  rows = 3,
  helpText,
  placeholder,
  maxLength,
  monospace = false,
}: TextareaFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground/70"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-foreground/50">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 border-2 rounded-md
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          transition-all text-foreground bg-background
          resize-y min-h-[80px]
          ${monospace ? 'font-mono text-sm' : ''}
          ${error ? 'border-red-500' : 'border-accent/20'}
        `}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
      />

      {helpText && !error && (
        <p id={`${id}-help`} className="text-xs text-foreground/50 mt-1">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
