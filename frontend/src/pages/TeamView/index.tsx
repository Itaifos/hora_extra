import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Users, Clock } from 'lucide-react';

interface TeamOvertimeRecord {
  id: string;
  date: string;
  hours: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED';
  employee: {
    name: string;
  };
}

const TeamViewPage: React.FC = () => {
  const [records, setRecords] = useState<TeamOvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<TeamOvertimeRecord[]>('/team/overtime')
      .then(response => {
        setRecords(response.data);
      })
      .catch(err => console.error("Erro ao buscar horas da equipe", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Visão da Equipe</h1>
        <p style={styles.subtitle}>Acompanhe os registros de horas extras do seu setor</p>
      </header>

      <div style={styles.card}>
      {loading ? (
          <p style={styles.centered}>Carregando registros...</p>
        ) : records.length === 0 ? (
          <p style={styles.centered}>Nenhum registro encontrado para a sua equipe.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Funcionário</th>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Horas</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} style={styles.tr}>
                  <td style={styles.td}>{record.employee.name}</td>
                  <td style={styles.td}>{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                  <td style={styles.td}>{Number(record.hours).toFixed(1)}h</td>
                  <td style={styles.td}>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#1e293b' },
    subtitle: { color: '#64748b', marginTop: '0.25rem' },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      padding: '2rem',
      overflowX: 'auto',
    },
    centered: {
      textAlign: 'center',
      color: '#64748b',
      padding: '2rem 0',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem 1rem',
      borderBottom: '2px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      color: '#64748b',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tr: {
      borderBottom: '1px solid #f1f5f9',
    },
    td: {
      padding: '1rem',
      fontSize: '0.9375rem',
      color: '#334155',
    },
};

export default TeamViewPage;
