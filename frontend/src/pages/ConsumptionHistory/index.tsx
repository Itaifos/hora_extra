import React, { useEffect, useState } from 'react';
import api from '../../api';
import { ShoppingCart } from 'lucide-react';

interface MovementRecord {
  id: string;
  created_at: string;
  amount: number;
  description: string;
  type: 'CREDIT' | 'DEBIT';
}

const ConsumptionHistoryPage: React.FC = () => {
  const [records, setRecords] = useState<MovementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MovementRecord[]>('/balance/history/my')
      .then(response => {
        // Filter only for consumption/debit records
        const debitRecords = response.data.filter(rec => rec.type === 'DEBIT');
        setRecords(debitRecords);
      })
      .catch(err => console.error("Erro ao buscar histórico de consumo", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Histórico de Consumo</h1>
        <p style={styles.subtitle}>Acompanhe todos os seus gastos no restaurante interno</p>
      </header>
      
      <div style={styles.card}>
        {loading ? (
          <p style={styles.centered}>Carregando histórico...</p>
        ) : records.length === 0 ? (
          <p style={styles.centered}>Nenhum consumo registrado até o momento.</p>
        ) : (
          <div style={styles.list}>
            {records.map(record => (
              <div key={record.id} style={styles.listItem}>
                <div style={styles.itemDetails}>
                  <div style={styles.itemIcon}><ShoppingCart size={24} color="#64748b" /></div>
                  <div>
                    <div style={styles.itemDescription}>{record.description}</div>
                    <div style={styles.itemDate}>
                      {new Date(record.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={styles.itemAmount}>
                  - R$ {Number(record.amount).toFixed(2)}
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
    container: { maxWidth: '900px', margin: '0 auto' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.875rem', fontWeight: '700', color: '#1e293b' },
    subtitle: { color: '#64748b', marginTop: '0.25rem' },
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
    itemDetails: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    itemIcon: {
      backgroundColor: '#f1f5f9',
      padding: '0.75rem',
      borderRadius: '12px',
    },
    itemDescription: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    itemDate: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginTop: '0.25rem',
    },
    itemAmount: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#ef4444', // Red for debit
    },
};

export default ConsumptionHistoryPage;
