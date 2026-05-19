import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { verifyEmail } = useAuth();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Nenhum token de verificação foi fornecido.');
      return;
    }

    async function doVerify() {
      try {
        const res = await verifyEmail(token);
        setStatus('success');
        setMessage(res.data?.message || 'E-mail verificado com sucesso.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Falha na verificação');
      }
    }

    doVerify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        {status === 'verifying' && (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-medium">Verificando seu e-mail...</h2>
          </div>
        )}
        
        {status === 'success' && (
          <div className="py-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">E-mail Verificado!</h2>
            <p className="text-textMuted mb-6">{message}</p>
            <Link to="/login" className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primaryHover transition-colors">
              Ir para o Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <XCircle className="h-16 w-16 text-danger mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Falha na Verificação</h2>
            <p className="text-textMuted mb-6">{message}</p>
            <Link to="/login" className="text-primary hover:underline">
              Voltar para o Login
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
