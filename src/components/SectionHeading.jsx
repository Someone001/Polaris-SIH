import React from 'react';

/**
 * Standard section heading with distinctive serif typography and plain-language subtitle.
 */
export default function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  theme = 'light',
  className = '',
}) {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={`space-y-3 ${isCenter ? 'text-center mx-auto' : 'text-left'} ${className}`}>
      {kicker && (
        <p
          className={`text-xs uppercase tracking-widest font-semibold ${
            isDark ? 'text-aurora-300' : 'text-aurora-600'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.2] ${
          isDark ? 'text-glacier-50' : 'text-polar-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
            isCenter ? 'mx-auto' : ''
          } ${isDark ? 'text-polar-200' : 'text-polar-700'}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
