import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          {icon || <Inbox className="w-10 h-10 text-muted-foreground" />}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </Card>
  );
}
