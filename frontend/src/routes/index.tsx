import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/Login';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import RestaurantPDV from '../pages/RestaurantPDV';
import MyOvertimePage from '../pages/MyOvertime';
import RegisterOvertimePage from '../pages/RegisterOvertime';
import TeamViewPage from '../pages/TeamView';
import AdminProcessingPage from '../pages/AdminProcessing';
import ConsumptionHistoryPage from '../pages/ConsumptionHistory';

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/minhas-horas" element={<MyOvertimePage />} />
        <Route path="/consumo" element={<ConsumptionHistoryPage />} />
        <Route path="/restaurante/venda" element={<RestaurantPDV />} />
        <Route path="/gestao/registrar-horas" element={<RegisterOvertimePage />} />
        <Route path="/gestao/equipe" element={<TeamViewPage />} />
        <Route path="/admin/config" element={<div>Configurações do Sistema (Em breve)</div>} />
        <Route path="/admin/processar" element={<AdminProcessingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
