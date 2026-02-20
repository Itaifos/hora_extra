import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/Login';
import Layout from '../components/Layout';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      
      {/* Private Routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<div>Dashboard: Bem-vindo, {user?.role}!</div>} />
        <Route path="/minhas-horas" element={<div>Minhas Horas (Em breve)</div>} />
        <Route path="/consumo" element={<div>Histórico de Consumo (Em breve)</div>} />
        <Route path="/restaurante/venda" element={<div>PDV Restaurante (Em breve)</div>} />
        <Route path="/gestao/equipe" element={<div>Gestão de Equipe (Em breve)</div>} />
        <Route path="/admin/config" element={<div>Configurações do Sistema (Em breve)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
