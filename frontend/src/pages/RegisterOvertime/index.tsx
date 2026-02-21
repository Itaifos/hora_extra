import React, { useEffect, useState } from 'react';
import api from '../../api';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  matricula: string;
}

const RegisterOvertimePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/employees').then(response => {
      setEmployees(response.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/overtime', {
        employee_id: selectedEmployee,
        date,
        hours: Number(hours),
      });
      setMessage({ type: 'success', text: `Horas extras registradas com sucesso para o funcionário selecionado.` });
      // Clear form
      setSelectedEmployee('');
      setHours('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao registrar horas extras.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Registrar Horas Extras</h1>
        <p style={styles.subtitle}>Selecione o funcionário e insira os detalhes do registro.</p>
      </header>

      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.formGrid}>
          {/* Employee Select */}
          <div style={styles.inputGroup}>
            <label htmlFor="employee" style={styles.label}>Funcionário</label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>Selecione um funcionário...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} (Matrícula: {emp.matricula})
                </option>
              ))}
            </select>
          </div>

          {/* Date Input */}
          <div style={styles.inputGroup}>
            <label htmlFor="date" style={styles.label}>Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Hours Input */}
          <div style={styles.inputGroup}>
            <label htmlFor="hours" style={styles.label}>Horas</label>
            <input
              id="hours"
              type="number"
              step="0.1"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              placeholder="Ex: 2.5"
              style={styles.input}
            />
          </div>
        </div>

        {message.text && (
            <div style={{ 
              ...styles.alert, 
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              borderColor: message.type === 'success' ? '#bbf7d0' : '#fecaca',
              marginTop: '1.5rem',
            }}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

        <button type="submit" disabled={loading} style={styles.button}>
          <PlusCircle size={20} />
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
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
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
    },
    input: {
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#fff',
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
    button: {
      marginTop: '2rem',
      width: '100%',
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
      opacity: 1,
    }
  };

export default RegisterOvertimePage;
