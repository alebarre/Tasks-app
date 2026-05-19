import { formatDistanceToNow, isPast } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from './ui';
import { cn } from './ui';

const priorityColors = {
  LOW: 'bg-surface text-textMuted border-border',
  MEDIUM: 'bg-warning/20 text-warning border-warning/50',
  HIGH: 'bg-danger/20 text-danger border-danger/50'
};

const statusColors = {
  PENDING: 'bg-surface text-textMuted',
  IN_PROGRESS: 'bg-primary/20 text-primary',
  COMPLETED: 'bg-success/20 text-success'
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED';

  return (
    <Card className="flex flex-col gap-3 p-4 group">
      <div className="flex justify-between items-start">
        <h3 className={cn("font-semibold text-lg", task.status === 'COMPLETED' && "line-through text-textMuted")}>
          {task.title}
        </h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="text-textMuted hover:text-primary"><Pencil size={18} /></button>
          <button onClick={() => onDelete(task.id)} className="text-textMuted hover:text-danger"><Trash2 size={18} /></button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-textMuted line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        <span className={cn("text-xs px-2 py-1 rounded-full border", priorityColors[task.priority])}>
          {task.priority === 'LOW' ? 'BAIXA' : task.priority === 'MEDIUM' ? 'MÉDIA' : 'ALTA'}
        </span>
        <span className={cn("text-xs px-2 py-1 rounded-full", statusColors[task.status])}>
          {task.status === 'PENDING' ? 'PENDENTE' : task.status === 'IN_PROGRESS' ? 'EM PROGRESSO' : 'CONCLUÍDO'}
        </span>
      </div>

      <div className="text-xs text-textMuted flex justify-between mt-2 pt-2 border-t border-border">
        <span>Criada: {new Date(task.createdAt).toLocaleDateString()}</span>
        {task.dueDate && (
          <span className={cn(isOverdue && "text-danger font-semibold")}>
            Vence {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
        )}
      </div>
    </Card>
  );
}
