import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return setError('Token inválido');
    if (password !== confirmPassword) return setError('As senhas não coincidem');
    
    try {
      setError('');
      setSuccess('');
      const res = await resetPassword(token, password);
      setSuccess(res.data?.message || 'Senha redefinida com sucesso.');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error[0].message);
      } else {
        setError(err.response?.data?.message || 'Falha ao redefinir a senha');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        {error && <div className="bg-danger/20 text-danger p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-success/20 text-success p-3 rounded mb-4 text-sm">{success}</div>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Nova Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Confirmar Nova Senha</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full">Salvar Senha</Button>
          </form>
        )}
        
        <p className="mt-4 text-center text-sm text-textMuted">
          Voltar para <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
