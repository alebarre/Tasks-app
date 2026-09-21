import { formatDistanceToNowStrict, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
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

/**
 * Monta o texto do prazo da tarefa:
 * - vencida (fora do prazo e não concluída): "Vencida há X dias"
 * - concluída após o prazo: "Venceu há X dias"
 * - dentro do prazo: "Vence em X dias"
 */
function dueDateLabel(task, isOverdue) {
  const dueDate = new Date(task.dueDate);
  const distance = formatDistanceToNowStrict(dueDate, { locale: ptBR });

  if (isOverdue) return `Vencida há ${distance}`;
  if (isPast(dueDate)) return `Venceu há ${distance}`;
  return `Vence em ${distance}`;
}

export default function TaskCard({ task, onEdit, onDelete, onRestore }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED';

  return (
    <Card className="flex flex-col gap-3 p-4 group">
      <div className="flex justify-between items-start">
        <h3 className={cn("font-semibold text-lg", task.status === 'COMPLETED' && "line-through text-textMuted")}>
          {task.title}
        </h3>
        <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          {onRestore && (
            <button onClick={() => onRestore(task.id)} className="text-textMuted hover:text-success" title="Reativar tarefa" aria-label="Reativar tarefa"><RotateCcw size={18} /></button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(task)} className="text-textMuted hover:text-primary" title="Editar tarefa" aria-label="Editar tarefa"><Pencil size={18} /></button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(task.id)} className="text-textMuted hover:text-danger" title={onRestore ? 'Excluir definitivamente' : 'Excluir tarefa'} aria-label={onRestore ? 'Excluir definitivamente' : 'Excluir tarefa'}><Trash2 size={18} /></button>
          )}
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
        {task.archived && (
          <span className="text-xs px-2 py-1 rounded-full bg-surface text-textMuted border border-border">
            ARQUIVADA
          </span>
        )}
      </div>

      <div className="text-xs text-textMuted flex justify-between gap-2 mt-2 pt-2 border-t border-border">
        {task.archived && task.archivedAt ? (
          <span>Arquivada: {new Date(task.archivedAt).toLocaleDateString('pt-BR')}</span>
        ) : (
          <span>Criada: {new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
        )}
        {task.dueDate && (
          <span className={cn(isOverdue && "text-danger font-semibold")}>
            {dueDateLabel(task, isOverdue)}
          </span>
        )}
      </div>
    </Card>
  );
}
