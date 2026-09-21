import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui';
import TaskCard from '../components/TaskCard';
import { ArrowLeft } from 'lucide-react';

export default function Archived() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchArchived();
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  async function fetchArchived() {
    try {
      const res = await api.get('/tasks/archived');
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Não foi possível carregar as tarefas arquivadas.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(taskId) {
    try {
      await api.patch(`/tasks/${taskId}/unarchive`);
      setFeedback({ type: 'success', message: 'Tarefa reativada. Ela voltou para o painel principal.' });
      fetchArchived();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Não foi possível reativar a tarefa. Tente novamente.' });
    }
  }

  async function handleDeleteForever(taskId) {
    if (!confirm('Excluir definitivamente esta tarefa? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setFeedback({ type: 'success', message: 'Tarefa excluída definitivamente.' });
      fetchArchived();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Não foi possível excluir a tarefa. Tente novamente.' });
    }
  }

  const feedbackColors = {
    success: 'bg-success/10 text-success border-success/40',
    error: 'bg-danger/10 text-danger border-danger/40',
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 border-b border-border pb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">Tarefas Arquivadas</h1>
          <p className="text-textMuted text-sm sm:text-base">
            {loading
              ? 'Carregando...'
              : tasks.length === 0
                ? 'Nenhuma tarefa arquivada.'
                : `${tasks.length} ${tasks.length === 1 ? 'tarefa arquivada' : 'tarefas arquivadas'}`}
          </p>
        </div>
        <Link to="/" className="self-end sm:self-auto shrink-0">
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowLeft size={18} /> Voltar ao painel
          </Button>
        </Link>
      </header>

      {feedback && (
        <div role="status" className={`mb-6 px-4 py-3 rounded-md border text-sm ${feedbackColors[feedback.type]}`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onRestore={handleRestore}
            onDelete={handleDeleteForever}
          />
        ))}
        {!loading && tasks.length === 0 && (
          <div className="col-span-full text-center py-12 text-textMuted bg-surface/50 rounded-lg border border-border border-dashed">
            Nenhuma tarefa arquivada. Use o botão "Arquivar concluídas" no painel para arquivar tarefas concluídas.
          </div>
        )}
      </div>
    </div>
  );
}
