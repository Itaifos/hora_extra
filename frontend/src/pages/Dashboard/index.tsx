import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardStats {
  balance: number;
  recentOvertime: any[];
  recentMovements: any[];
  employee: any;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, balanceRes, overtimeRes, historyRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/balance/my'),
          api.get('/overtime/my'),
          api.get('/balance/history/my'),
        ]);

        setStats({
          employee: meRes.data,
          balance: balanceRes.data,
          recentOvertime: overtimeRes.data.slice(0, 5),
          recentMovements: historyRes.data.slice(0, 5),
        });
      } catch (err) {
        console.error('Erro ao carregar dashboard', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <div>Carregando dashboard...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.welcome}>Olá, {stats?.employee?.name || 'Funcionário'}</h1>
        <p style={styles.subtitle}>Acompanhe seu saldo e horas extras</p>
      </header>

      <div style={styles.grid}>
        {/* Card de Saldo */}
        <div style={{ ...styles.card, borderLeft: '4px solid #22c55e' }}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Saldo Disponível</span>
            <Wallet color="#22c55e" size={20} />
          </div>
          <div style={styles.cardValue}>R$ {stats?.balance.toFixed(2)}</div>
          <div style={styles.cardInfo}>Exclusivo para uso no restaurante</div>
        </div>

        {/* Card de Horas (Exemplo do mês) */}
        <div style={{ ...styles.card, borderLeft: '4px solid #3b82f6' }}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Horas Registradas (Total)</span>
            <Clock color="#3b82f6" size={20} />
          </div>
          <div style={styles.cardValue}>
            {stats?.recentOvertime.reduce((acc, curr) => acc + Number(curr.hours), 0).toFixed(1)}h
          </div>
          <div style={styles.cardInfo}>Baseado nos últimos registros</div>
        </div>
      </div>

      <div style={styles.sections}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Últimos Registros de Horas</h2>
          <div style={styles.table}>
            {stats?.recentOvertime.map((item) => (
              <div key={item.id} style={styles.tableRow}>
                <div>
                  <div style={styles.rowMain}>{new Date(item.date).toLocaleDateString()}</div>
                  <div style={styles.rowSub}>{item.status}</div>
                </div>
                <div style={styles.rowValue}>{item.hours}h</div>
              </div>
            ))}
            {stats?.recentOvertime.length === 0 && <p style={styles.empty}>Nenhum registro encontrado</p>}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Atividade Recente</h2>
          <div style={styles.table}>
            {stats?.recentMovements.map((item) => (
              <div key={item.id} style={styles.tableRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.type === 'CREDIT' ? 
                    <ArrowUpRight color="#22c55e" size={20} /> : 
                    <ArrowDownRight color="#ef4444" size={20} />
                  }
                  <div>
                    <div style={styles.rowMain}>{item.description}</div>
                    <div style={styles.rowSub}>{new Date(item.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ 
                  ...styles.rowValue, 
                  color: item.type === 'CREDIT' ? '#22c55e' : '#ef4444' 
                }}>
                  {item.type === 'CREDIT' ? '+' : '-'} R$ {Number(item.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {stats?.recentMovements.length === 0 && <p style={styles.empty}>Nenhuma movimentação encontrada</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    marginBottom: '0.5rem',
  },
  welcome: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#64748b',
  },
  cardValue: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0.5rem 0',
  },
  cardInfo: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  sections: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
  },
  section: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  rowMain: {
    fontSize: '0.9375rem',
    fontWeight: '600',
    color: '#334155',
  },
  rowSub: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  rowValue: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '1rem',
  }
};

export default Dashboard;
