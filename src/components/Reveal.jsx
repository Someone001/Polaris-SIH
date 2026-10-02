import React from 'react';

/**
 * Reveal Component
 * Declarative wrapper to animate any component or section on scroll.
 * 
 * Props:
 * - direction: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade' (default: 'up')
 * - delay: transition delay in ms (e.g. 100, 200, 300)
 * - duration: transition duration in ms (default: 700)
 * - as: element type to render (default: 'div')
 */
export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 700,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      data-reveal
      data-reveal-direction={direction}
      data-reveal-delay={delay}
      data-reveal-duration={duration}
      className={`reveal-on-scroll ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
