import React from 'react';

/**
 * Clean, restrained tag for categories, regions, and statuses.
 */
export default function Tag({ children, variant = 'default', size = 'md' }) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs sm:text-sm px-3 py-1',
  };

  const variantStyles = {
    default: 'bg-polar-100/60 text-polar-800 border border-polar-200/80',
    ice: 'bg-ice-100/70 text-ice-700 border border-ice-200',
    aurora: 'bg-aurora-50 text-aurora-700 border border-aurora-200',
    dark: 'bg-polar-800 text-polar-100 border border-polar-700',
    outline: 'bg-transparent text-polar-700 border border-polar-300',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide transition-colors ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.default}`}
    >
      {children}
    </span>
  );
}
