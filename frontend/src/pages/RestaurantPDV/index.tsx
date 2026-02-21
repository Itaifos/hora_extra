import React, { useState } from 'react';
import api from '../../api';
import { Search, User, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const RestaurantPDV: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [employee, setEmployee] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmployee(null);
    setBalance(null);
    setMessage({ type: '', text: '' });

    try {
      const empRes = await api.get(`/employees/search/${matricula}`);
      setEmployee(empRes.data);
      
      const balRes = await api.get(`/balance/${empRes.data.id}`);
      setBalance(balRes.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Funcionário não encontrado ou erro na busca.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDebit = async () => {
    if (!employee || !amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      await api.post('/balance/debit', {
        employee_id: employee.id,
        amount: Number(amount),
        description: 'Consumo Restaurante Interno',
      });

      setMessage({ type: 'success', text: `Débito de R$ ${amount} realizado com sucesso!` });
      
      // Update balance
      const balRes = await api.get(`/balance/${employee.id}`);
      setBalance(balRes.data);
      setAmount('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao realizar débito.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>PDV Restaurante</h1>
        <p style={styles.subtitle}>Realize cobranças utilizando o saldo de benefício</p>
      </header>

      <div style={styles.grid}>
        {/* Busca */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Buscar Funcionário</h2>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite a matrícula..."
              style={styles.input}
              required
            />
            <button type="submit" disabled={loading} style={styles.searchButton}>
              <Search size={20} />
            </button>
          </form>

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

        {/* Detalhes e Débito */}
        {employee && (
          <div style={styles.card}>
            <div style={styles.employeeHeader}>
              <div style={styles.avatar}>
                <User size={32} color="#2563eb" />
              </div>
              <div>
                <h3 style={styles.employeeName}>{employee.name}</h3>
                <p style={styles.employeeSub}>{employee.sector} • Matrícula: {employee.matricula}</p>
              </div>
            </div>

            <div style={styles.balanceSection}>
              <span style={styles.balanceLabel}>Saldo Disponível</span>
              <span style={styles.balanceValue}>R$ {balance?.toFixed(2)}</span>
            </div>

            <hr style={styles.divider} />

            <div style={styles.debitForm}>
              <label style={styles.label}>Valor do Consumo (R$)</label>
              <div style={styles.amountInputGroup}>
                <span style={styles.currencyPrefix}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  style={styles.amountInput}
                />
              </div>
              <button 
                onClick={handleDebit} 
                disabled={loading || !amount || Number(amount) > (balance || 0)} 
                style={{
                  ...styles.debitButton,
                  opacity: (loading || !amount || Number(amount) > (balance || 0)) ? 0.6 : 1
                }}
              >
                <CreditCard size={20} />
                Confirmar Pagamento
              </button>
              {amount && Number(amount) > (balance || 0) && (
                <p style={styles.errorText}>Saldo insuficiente para este valor</p>
              )}
            </div>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#334155',
  },
  searchForm: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    outline: 'none',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '0 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.875rem',
  },
  employeeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    backgroundColor: '#eff6ff',
    padding: '0.75rem',
    borderRadius: '12px',
  },
  employeeName: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  employeeSub: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  balanceSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    gap: '0.25rem',
  },
  balanceLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#22c55e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f1f5f9',
  },
  debitForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
  },
  amountInputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencyPrefix: {
    position: 'absolute',
    left: '1rem',
    color: '#94a3b8',
    fontWeight: '600',
  },
  amountInput: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 3rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    outline: 'none',
  },
  debitButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    textAlign: 'center',
    fontWeight: '500',
  }
};

export default RestaurantPDV;
