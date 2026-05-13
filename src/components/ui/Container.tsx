import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', ...rest }) => (
  <div
    className={`mx-auto px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40${className ? ` ${className}` : ''}`}
    {...rest}
  >
    {children}
  </div>
);
