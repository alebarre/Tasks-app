import { useState, useEffect } from 'react';
import { Card, Button, Input } from './ui';

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    status: 'PENDING',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'LOW',
        status: task.status || 'PENDING',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
      });
    } else {
      setFormData({ title: '', description: '', priority: 'LOW', status: 'PENDING', dueDate: '' });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...formData };
    if (!data.dueDate) delete data.dueDate;
    else data.dueDate = new Date(data.dueDate).toISOString();
    
    onSave(data);
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-textMuted mb-1">Título</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-textMuted mb-1">Descrição</label>
            <textarea 
              className="w-full px-4 py-2 bg-surface border border-border rounded-md text-text focus:ring-2 focus:ring-primary focus:outline-none"
              rows={3}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-textMuted mb-1">Prioridade</label>
              <select className="w-full px-4 py-2 bg-surface border border-border rounded-md text-text focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-textMuted mb-1">Status</label>
              <select className="w-full px-4 py-2 bg-surface border border-border rounded-md text-text focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluído</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-textMuted mb-1">Data de Vencimento</label>
            <Input type="datetime-local" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
