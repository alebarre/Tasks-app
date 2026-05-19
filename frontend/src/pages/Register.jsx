import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('As senhas não coincidem');
    }
    try {
      setError('');
      setSuccess('');
      const res = await register(name, email, password, confirmPassword);
      setSuccess(res.data?.message || 'Registro realizado com sucesso.');
      // Wait for user to read message, then optional redirect, but letting them read is better
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      if (err.response?.data?.error) {
        // Handle zod error
        setError(err.response.data.error[0].message);
      } else {
        setError(err.response?.data?.message || 'Falha ao registrar');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        {error && <div className="bg-danger/20 text-danger p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-success/20 text-success p-3 rounded mb-4 text-sm">{success}</div>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Nome</label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Confirmar Senha</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full">Cadastrar-se</Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-textMuted">
          Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </Card>
    </div>
  );
}
