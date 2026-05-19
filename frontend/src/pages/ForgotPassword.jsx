import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { forgotPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const res = await forgotPassword(email);
      setSuccess(res.data?.message || 'Se houver uma conta com esse e-mail, enviamos um link de redefinição.');
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao enviar e-mail de recuperação');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>
        {error && <div className="bg-danger/20 text-danger p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-success/20 text-success p-3 rounded mb-4 text-sm">{success}</div>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-textMuted mb-4">
              Informe seu endereço de e-mail e enviaremos um link para redefinir sua senha.
            </p>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Enviar Link</Button>
          </form>
        )}
        
        <p className="mt-4 text-center text-sm text-textMuted">
          Voltar para <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}
