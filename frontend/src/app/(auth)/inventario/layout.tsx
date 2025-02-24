'use client'
import React, { useState } from 'react';
import {
  Package,
  Search,
  Bell,
  Menu,
  User,
  ShoppingBag,
  Watch,
  Headphones,
  Gamepad,
  Shirt,
  Radio,
  Plus,
  ChevronRight,
  Users,
  TrendingUp
} from 'lucide-react';
import Navbar from '@src/components/inventario/Navbar';

const StatsCard = ({ icon: Icon, title, value, variant, trend }) => {
  if (!Icon) return null;

  const borderColors = {
    yellow: 'border-yellow-400/20',
    blue: 'border-blue-500/20',
    red: 'border-red-500/20',
    green: 'border-emerald-500/20'
  };

  const glowColors = {
    yellow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.15)]',
    blue: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]',
    red: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]',
    green: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
  };

  const textColors = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-emerald-500'
  };

  return (
    <div className={`group relative overflow-hidden bg-gray-900/90 p-6 rounded-2xl border ${borderColors[variant]} 
      backdrop-blur-sm transition-all duration-300 ${glowColors[variant]} hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className={`${textColors[variant]} text-sm font-medium`}>{title}</p>
            {trend && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                +{trend}%
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl bg-gray-800/80 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-6 w-6 ${textColors[variant]}`} />
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-10 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ color: variant === 'yellow' ? '#facc15' : variant === 'blue' ? '#3b82f6' : variant === 'red' ? '#ef4444' : '#10b981' }} />
    </div>
  );
};

const CategoryCard = ({ icon: Icon, name, items, variant }) => {
  if (!Icon) return null;

  const borderColors = {
    yellow: 'border-yellow-400/20',
    blue: 'border-blue-500/20',
    red: 'border-red-500/20',
    green: 'border-emerald-500/20'
  };

  const glowColors = {
    yellow: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.15)]',
    blue: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]',
    red: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]',
    green: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
  };

  const textColors = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-emerald-500'
  };

  return (
    <div className={`group cursor-pointer bg-gray-900/90 p-5 rounded-xl border ${borderColors[variant]} 
      backdrop-blur-sm transition-all duration-300 ${glowColors[variant]} hover:-translate-y-1`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gray-800/80 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-5 w-5 ${textColors[variant]}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-200">{name}</h3>
          <p className="text-xs text-gray-400">{items} items</p>
        </div>
        <ChevronRight className={`h-4 w-4 ${textColors[variant]} 
          group-hover:translate-x-1.5 transition-transform duration-300`} />
      </div>
    </div>
  );
};

const ActivityItem = ({ action, time, type }) => {
  const colors = {
    update: 'bg-blue-500',
    alert: 'bg-red-500',
    success: 'bg-emerald-500',
    warning: 'bg-yellow-400'
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors rounded-lg">
      <div className={`h-2 w-2 rounded-full ${colors[type]} ring-4 ring-opacity-20 ${colors[type].replace('bg-', 'ring-')}`} />
      <div className="flex-1">
        <p className="text-sm text-gray-200">{action}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

const InventoryDashboard = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fondo con gradiente mejorado */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(66,153,225,0.07),rgba(236,201,75,0.07),rgba(245,101,101,0.07))]" />

      {/* Barra de Navegación */}
      {/* <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="relative">
                <h1 className="text-xl font-bold">
                  <span className="text-yellow-400">Viti's</span>
                  <span className="text-blue-500"> Store</span>
                </h1>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-400" />
              </div>
              
              <div className={`relative transition-all duration-500 ease-in-out ${
                searchFocused ? 'w-96' : 'w-64'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl
                    text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                    transition-all duration-300"
                  placeholder="Buscar en inventario..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <User className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav> */}
     
      {/* Contenido Principal */}
      <main className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Encabezado */}
        <div>
          <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-400">Monitorea las métricas de tu inventario y actividades recientes</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Package}
            title="Total Productos"
            value="1,234"
            variant="yellow"
            trend="12"
          />
          <StatsCard
            icon={ShoppingBag}
            title="Ventas del Día"
            value="85"
            variant="blue"
            trend="8"
          />
          <StatsCard
            icon={Users}
            title="Clientes Activos"
            value="642"
            variant="green"
            trend="15"
          />
          <StatsCard
            icon={TrendingUp}
            title="Ingresos"
            value="$12.5k"
            variant="yellow"
            trend="24"
          />
        </div>

        {/* Categorías y Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categorías */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-white">Categorías de Productos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CategoryCard icon={Watch} name="Relojes y Joyería" items={245} variant="yellow" />
              <CategoryCard icon={Headphones} name="Equipos de Audio" items={182} variant="blue" />
              <CategoryCard icon={Gamepad} name="Accesorios Gaming" items={156} variant="green" />
              <CategoryCard icon={Shirt} name="Ropa" items={324} variant="yellow" />
              <CategoryCard icon={Radio} name="Equipos Musicales" items={98} variant="blue" />
              <CategoryCard icon={Package} name="Electrónicos" items={45} variant="green" />
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 space-y-2">
              <ActivityItem
                action="Actualización de Inventario"
                time="hace 5 minutos"
                type="update"
              />
              <ActivityItem
                action="Nuevo Pedido Recibido"
                time="hace 12 minutos"
                type="success"
              />
              <ActivityItem
                action="Alerta de Stock Bajo"
                time="hace 25 minutos"
                type="alert"
              />
              <ActivityItem
                action="Producto Agregado"
                time="hace 1 hora"
                type="warning"
              />
            </div>
          </div>
        </div>

        {/* Botón Agregar */}
        <button className="fixed bottom-8 right-8 p-4 bg-gray-900/90 border border-yellow-400/20
          hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] rounded-full transition-all duration-300
          hover:-translate-y-1 backdrop-blur-sm">
          <Plus className="h-6 w-6 text-yellow-400" />
        </button>
      </main>
    </div>
  );
};

export default InventoryDashboard;