import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Button } from '../components/ui';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { LogOut, Plus, Archive, ArchiveRestore } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function fetchTasks() {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveTask(taskData) {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(taskId) {
    if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handleArchiveCompleted() {
    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

    if (completedCount === 0) {
      setFeedback({ type: 'info', message: 'Não há tarefas concluídas para arquivar.' });
      return;
    }

    const plural = completedCount === 1 ? 'tarefa concluída' : 'tarefas concluídas';
    if (!confirm(`Arquivar ${completedCount} ${plural}? Elas deixarão de aparecer nesta listagem, mas poderão ser reativadas na área "Arquivadas".`)) {
      return;
    }

    setIsArchiving(true);
    try {
      const res = await api.post('/tasks/archive-completed');
      const count = res.data.data.count;
      setFeedback({
        type: 'success',
        message: count === 0
          ? 'Não há tarefas concluídas para arquivar.'
          : `${count} ${count === 1 ? 'tarefa arquivada' : 'tarefas arquivadas'} com sucesso.`,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Não foi possível arquivar as tarefas. Tente novamente.' });
    } finally {
      setIsArchiving(false);
    }
  }

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  const filterLabels = {
    ALL: 'Todas',
    PENDING: 'Pendentes',
    IN_PROGRESS: 'Em Progresso',
    COMPLETED: 'Concluídas',
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  const feedbackColors = {
    info: 'bg-primary/10 text-primary border-primary/40',
    success: 'bg-success/10 text-success border-success/40',
    error: 'bg-danger/10 text-danger border-danger/40',
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 border-b border-border pb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">Painel de Tarefas</h1>
          <p className="text-textMuted text-sm sm:text-base truncate">Bem-vindo de volta, {user?.name}</p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto shrink-0">
          <Link to="/archived">
            <Button variant="secondary" className="flex items-center gap-2">
              <ArchiveRestore size={18} /> Arquivadas
            </Button>
          </Link>
          <Button variant="secondary" onClick={logout} className="flex items-center gap-2">
            <LogOut size={18} /> Sair
          </Button>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-primary' },
          { label: 'Pendentes', value: stats.pending, color: 'text-textMuted' },
          { label: 'Em Progresso', value: stats.inProgress, color: 'text-warning' },
          { label: 'Concluídas', value: stats.completed, color: 'text-success' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border p-4 rounded-lg flex flex-col items-center">
            <span className="text-sm text-textMuted">{s.label}</span>
            <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {feedback && (
        <div role="status" className={`mb-6 px-4 py-3 rounded-md border text-sm ${feedbackColors[feedback.type]}`}>
          {feedback.message}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface text-textMuted hover:text-text'}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={handleArchiveCompleted}
            disabled={isArchiving}
            className="flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-60"
          >
            <Archive size={18} /> {isArchiving ? 'Arquivando...' : 'Arquivar concluídas'}
          </Button>
          <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus size={18} /> Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-12 text-textMuted bg-surface/50 rounded-lg border border-border border-dashed">
            Nenhuma tarefa encontrada.
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
