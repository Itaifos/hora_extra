import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Clock, Check, Loader } from 'lucide-react';

interface OvertimeRecord {
  id: string;
  date: string;
  hours: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED';
}

const statusStyles = {
  PENDING: {
    label: 'Pendente',
    icon: <Loader size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />,
    color: '#f97316',
    backgroundColor: '#fff7ed',
  },
  APPROVED: {
    label: 'Aprovado',
    icon: <Check size={16} />,
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  PROCESSED: {
    label: 'Processado',
    icon: <Check size={16} />,
    color: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
};

const MyOvertimePage: React.FC = () => {
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<OvertimeRecord[]>('/overtime/my')
      .then(response => {
        setRecords(response.data);
      })
      .catch(err => console.error("Erro ao buscar horas extras", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Meus Registros de Horas</h1>
        <p style={styles.subtitle}>Acompanhe o histórico e status das suas horas extras</p>
      </header>
      
      <div style={styles.card}>
        {loading ? (
          <p style={styles.centered}>Carregando registros...</p>
        ) : records.length === 0 ? (
          <p style={styles.centered}>Nenhum registro de hora extra encontrado.</p>
        ) : (
          <div style={styles.list}>
            {records.map(record => (
              <div key={record.id} style={styles.listItem}>
                <div style={styles.dateSection}>
                  <div style={styles.dateIcon}><Clock size={24} color="#64748b" /></div>
                  <div>
                    <div style={styles.dateText}>{new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div style={{
                      ...styles.statusBadge,
                      color: statusStyles[record.status].color,
                      backgroundColor: statusStyles[record.status].backgroundColor,
                    }}>
                      {statusStyles[record.status].icon}
                      {statusStyles[record.status].label}
                    </div>
                  </div>
                </div>
                <div style={styles.hoursText}>
                  {Number(record.hours).toFixed(1)}h
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    marginTop: '0.25rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '2rem',
  },
  centered: {
    textAlign: 'center',
    color: '#64748b',
    padding: '2rem 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '1px solid #f1f5f9',
  },
  dateSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dateIcon: {
    backgroundColor: '#f1f5f9',
    padding: '0.75rem',
    borderRadius: '12px',
  },

  dateText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  hoursText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#3b82f6',
  },
};

export default MyOvertimePage;
