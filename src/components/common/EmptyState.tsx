import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto">
      {icon && (
        <div className="w-16 h-16 bg-charcoal-50 border border-charcoal-100 flex items-center justify-center mb-6 text-charcoal-400">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-2xl text-charcoal-950 mb-2.5">{title}</h3>
      {description && (
        <p className="text-charcoal-500 text-sm leading-relaxed mb-8">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
