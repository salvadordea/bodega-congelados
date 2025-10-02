import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Grid3x3, Users, Calendar, FileText, Snowflake } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/spaces', icon: Grid3x3, label: 'Espacios' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/reservations', icon: Calendar, label: 'Reservaciones' },
    { path: '/tickets', icon: FileText, label: 'Tickets' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ice-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-ice-600 p-2 rounded-lg">
                <Snowflake className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">FreezeStore</h1>
                <p className="text-sm text-gray-500">Sistema de Gestión de Bodega</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-ice-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-ice-50 hover:text-ice-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
