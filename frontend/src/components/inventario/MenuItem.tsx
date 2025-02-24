'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  Package, 
  ArrowLeftRight,
  BarChart2,
  Bell,
  Plus,
  List,
  ArrowLeft,
  ArrowRight,
  FileInput,
  FileOutput,
  RotateCcw,
  History,
  AlertTriangle,
  Settings,
  X,
  LineChart,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ChevronRight,
  Home,
  Search
} from 'lucide-react';

const MenuItem = ({ icon: Icon, title, isActive, onClick, hasSubMenu, isExpanded, children, badge }) => (
  <div className="group space-y-1">
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'}`}
    >
      <div className={`p-2 rounded-lg transition-colors duration-200 
        ${isActive ? 'bg-blue-500/10' : 'bg-gray-800/50 group-hover:bg-gray-800'}`}>
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'group-hover:text-white'}`} />
      </div>
      <span className="flex-1 text-sm font-medium">{title}</span>
      {badge && (
        <span className={`px-2 py-0.5 text-xs rounded-full 
          ${isActive ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-800 text-gray-400'}`}>
          {badge}
        </span>
      )}
      {hasSubMenu && (
        <ChevronRight className={`h-4 w-4 transition-transform duration-300 
          ${isExpanded ? 'rotate-90' : ''} 
          ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
      )}
    </button>
    {isExpanded && children && (
      <div className="ml-12 space-y-1 pt-1">
        {children}
      </div>
    )}
  </div>
);

const SubMenuItem = ({ title, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200
      ${isActive 
        ? 'text-blue-500 bg-blue-500/10' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
  >
    <span>{title}</span>
    {badge && (
      <span className={`px-2 py-0.5 text-xs rounded-full 
        ${isActive ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-800 text-gray-400'}`}>
        {badge}
      </span>
    )}
  </button>
);


const Sidebar = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activePath, setActivePath] = useState('/dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Use the correct router for App Router
  const router = useRouter();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleNavigation = (path) => {
    setActivePath(path);
    
    // Navigate to the path
    router.push(path);
    
    // Close sidebar on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onClose();
    }
  };
  return (
    <>
      {/* Overlay con blur */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar con efecto de deslizamiento */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50
        transform transition-transform duration-300 ease-in-out z-50 shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header con búsqueda */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Menú Principal</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-4 w-4 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl
                text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                transition-all duration-300 text-sm"
              placeholder="Buscar en el menú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Menu Items con scroll suave */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar">
          {/* Dashboard */}
          <MenuItem
            icon={Home}
            title="Dashboard"
            isActive={activePath === '/dashboard'}
            onClick={() => handleNavigation('/dashboard')}
          />

          {/* Productos */}
          <MenuItem
            icon={Package}
            title="Gestión de Productos"
            isActive={activePath.startsWith('/productos')}
            hasSubMenu={true}
            isExpanded={expandedMenus.productos}
            onClick={() => toggleMenu('productos')}
            badge="23"
          >
            <SubMenuItem
              title="Registrar Producto"
              isActive={activePath === '/productos/new'}
              onClick={() => handleNavigation('/productos/new')}
            />
            <SubMenuItem
              title="Lista de Productos"
              isActive={activePath === '/productos/list'}
              onClick={() => handleNavigation('/productos/list')}
              badge="350"
            />
            <SubMenuItem
              title="Detalles de Productos"
              isActive={activePath === '/productos/details'}
              onClick={() => handleNavigation('/productos/details')}
            />
          </MenuItem>

          {/* Movimientos */}
          <MenuItem
            icon={ArrowLeftRight}
            title="Registro de Movimientos"
            isActive={activePath.startsWith('/movements')}
            hasSubMenu={true}
            isExpanded={expandedMenus.movements}
            onClick={() => toggleMenu('movements')}
            badge="5"
          >
            <SubMenuItem
              title="Entradas de Productos"
              isActive={activePath === '/movements/input'}
              onClick={() => handleNavigation('/movements/input')}
              badge="2"
            />
            <SubMenuItem
              title="Salidas de Productos"
              isActive={activePath === '/movements/output'}
              onClick={() => handleNavigation('/movements/output')}
              badge="3"
            />
            <SubMenuItem
              title="Devoluciones"
              isActive={activePath === '/movements/returns'}
              onClick={() => handleNavigation('/movements/returns')}
            />
            <SubMenuItem
              title="Historial de Movimientos"
              isActive={activePath === '/movements/history'}
              onClick={() => handleNavigation('/movements/history')}
            />
          </MenuItem>

          {/* Reportes */}
          <MenuItem
            icon={BarChart2}
            title="Reportes"
            isActive={activePath.startsWith('/reports')}
            hasSubMenu={true}
            isExpanded={expandedMenus.reports}
            onClick={() => toggleMenu('reports')}
          >
            <SubMenuItem
              title="Dashboard Principal"
              isActive={activePath === '/reports/dashboard'}
              onClick={() => handleNavigation('/reports/dashboard')}
            />
            <SubMenuItem
              title="Productos Bajo Stock"
              isActive={activePath === '/reports/low-stock'}
              onClick={() => handleNavigation('/reports/low-stock')}
              badge="8"
            />
            <SubMenuItem
              title="Tendencias de Compra"
              isActive={activePath === '/reports/trends'}
              onClick={() => handleNavigation('/reports/trends')}
            />
            <SubMenuItem
              title="Historial Semanal"
              isActive={activePath === '/reports/weekly'}
              onClick={() => handleNavigation('/reports/weekly')}
            />
            <SubMenuItem
              title="Resumen de Ventas"
              isActive={activePath === '/reports/sales'}
              onClick={() => handleNavigation('/reports/sales')}
            />
          </MenuItem>

          {/* Alertas */}
          <MenuItem
            icon={AlertTriangle}
            title="Alertas"
            isActive={activePath.startsWith('/alerts')}
            hasSubMenu={true}
            isExpanded={expandedMenus.alerts}
            onClick={() => toggleMenu('alerts')}
            badge="4"
          >
            <SubMenuItem
              title="Niveles Críticos"
              isActive={activePath === '/alerts/critical'}
              onClick={() => handleNavigation('/alerts/critical')}
              badge="2"
            />
            <SubMenuItem
              title="Configurar Umbrales"
              isActive={activePath === '/alerts/thresholds'}
              onClick={() => handleNavigation('/alerts/thresholds')}
            />
            <SubMenuItem
              title="Centro de Notificaciones"
              isActive={activePath === '/alerts/notifications'}
              onClick={() => handleNavigation('/alerts/notifications')}
              badge="2"
            />
          </MenuItem>
        </div>

        {/* Footer con información del usuario */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-500">JP</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">Juan Pérez</h3>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Estilos para el scrollbar personalizado
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(107, 114, 128, 0.3);
    border-radius: 9999px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.5);
  }
`;

// Agregar estilos al documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Sidebar;