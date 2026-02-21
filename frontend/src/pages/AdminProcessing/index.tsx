import React, { useState } from 'react';
import api from '../../api';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';

const AdminProcessingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProcess = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/overtime/process-day');
      const count = response.data.processed_count || 0;
      setMessage({ type: 'success', text: `${count} registro(s) de horas extras foram processados com sucesso!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao processar registros.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Processamento Diário</h1>
        <p style={styles.subtitle}>Execute o script para converter horas extras pendentes em saldo de benefício.</p>
      </header>

      <div style={styles.card}>
        <p style={styles.description}>
          Ao clicar no botão abaixo, o sistema irá buscar todos os registros de horas extras com status "Pendente" (ou "Aprovado"),
          calculará o valor do benefício de acordo com as regras de negócio e adicionará o crédito ao saldo do respectivo funcionário.
          Os registros processados terão seu status alterado para "Processado".
        </p>

        <button onClick={handleProcess} disabled={loading} style={styles.button}>
          <Play size={20} />
          {loading ? 'Processando...' : 'Iniciar Processamento'}
        </button>

        {message.text && (
          <div style={{
            ...styles.alert,
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            borderColor: message.type === 'success' ? '#bbf7d0' : '#fecaca',
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#1e293b' },
    subtitle: { color: '#64748b', marginTop: '0.25rem' },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignItems: 'center',
      textAlign: 'center',
    },
    description: {
      lineHeight: 1.6,
      color: '#475569',
      maxWidth: '600px',
    },
    button: {
      backgroundColor: '#16a34a',
      color: '#fff',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      opacity: 1,
      minWidth: '250px',
    },
    alert: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid',
      fontSize: '0.875rem',
      marginTop: '1rem',
    },
};

export default AdminProcessingPage;
