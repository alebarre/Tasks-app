import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-primary hover:bg-primaryHover text-white border-transparent',
    secondary: 'bg-surface hover:bg-border text-text border-border border',
    danger: 'bg-danger hover:bg-red-600 text-white border-transparent',
  };

  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 bg-surface border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary placeholder-textMuted transition-colors',
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('bg-surface border border-border rounded-lg shadow-lg p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
