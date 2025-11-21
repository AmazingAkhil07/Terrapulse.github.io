import React from 'react';

const Layout = ({ children, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'rooms', label: 'Rooms', icon: '🏨' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="mb-8" style={{ marginBottom: '2rem' }}>
          <h1 className="text-xl" style={{ color: 'var(--color-primary-light)' }}>Hotel<span style={{ color: 'white' }}>Manager</span></h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item">
            <span>👤</span>
            <div className="flex flex-col" style={{ alignItems: 'flex-start' }}>
              <span className="text-sm">Admin User</span>
              <span className="text-sm text-muted" style={{ fontSize: '0.75rem' }}>Manager</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
