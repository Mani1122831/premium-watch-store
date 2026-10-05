import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageContainer({
  children,
  className = '',
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${
        narrow ? 'max-w-4xl' : 'max-w-7xl'
      } ${className}`}
    >
      {children}
    </div>
  );
}
