import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { 
  LayoutDashboard, 
  Clock, 
  Utensils, 
  Users, 
  Settings, 
  LogOut,
  History,
  PlusCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    // Common / Employee
    { 
      title: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard size={20} />, 
      roles: [UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.ADMIN, UserRole.RESTAURANT] 
    },
    { 
      title: 'Minhas Horas', 
      path: '/minhas-horas', 
      icon: <Clock size={20} />, 
      roles: [UserRole.EMPLOYEE] 
    },
    { 
      title: 'Histórico de Consumo', 
      path: '/consumo', 
      icon: <History size={20} />, 
      roles: [UserRole.EMPLOYEE] 
    },
    
    // Restaurant
    { 
      title: 'PDV Restaurante', 
      path: '/restaurante/venda', 
      icon: <Utensils size={20} />, 
      roles: [UserRole.RESTAURANT, UserRole.ADMIN] 
    },
    
    // Manager / Admin
    { 
      title: 'Registrar Horas',
      path: '/gestao/registrar-horas',
      icon: <PlusCircle size={20} />,
      roles: [UserRole.MANAGER, UserRole.ADMIN]
    },
    { 
      title: 'Equipe', 
      path: '/gestao/equipe', 
      icon: <Users size={20} />, 
      roles: [UserRole.MANAGER, UserRole.ADMIN] 
    },
    { 
      title: 'Configurações', 
      path: '/admin/config', 
      icon: <Settings size={20} />, 
      roles: [UserRole.ADMIN] 
    },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>HE</div>
        <h2 style={styles.logoText}>Hora Extra</h2>
      </div>

      <nav style={styles.nav}>
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? '#eff6ff' : 'transparent',
              color: isActive ? '#2563eb' : '#64748b',
            })}
          >
            {item.icon}
            <span style={styles.linkText}>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{user?.email.split('@')[0]}</p>
          <p style={styles.userRole}>{user?.role}</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn} title="Sair">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  nav: {
    flex: 1,
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  linkText: {
    marginLeft: '0.75rem',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
};

export default Sidebar;
