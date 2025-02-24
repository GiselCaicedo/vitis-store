'use client'

import React from 'react'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Watch,
  Headphones,
  Gamepad,
  ShoppingBag,
  Music,
  Cpu,
  ChevronRight,
  Clock,
  AlertTriangle,
  Box,
  Bell,
  Plus
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-[10rem]">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <p className="text-gray-400">Monitorea las métricas de tu inventario y actividades recientes</p>
      </div>
      
      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Products */}
        <div className="bg-gray-900 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-yellow-400 font-medium mb-2">Total Productos <span className="text-green-400 text-sm ml-1">+12%</span></p>
            <h3 className="text-3xl font-bold">1,234</h3>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl">
            <Package className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        
        {/* Daily Sales */}
        <div className="bg-gray-900 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-blue-400 font-medium mb-2">Ventas del Día <span className="text-green-400 text-sm ml-1">+8%</span></p>
            <h3 className="text-3xl font-bold">85</h3>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl">
            <ShoppingCart className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        
        {/* Active Clients */}
        <div className="bg-gray-900 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-emerald-400 font-medium mb-2">Clientes Activos <span className="text-green-400 text-sm ml-1">+15%</span></p>
            <h3 className="text-3xl font-bold">642</h3>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        
        {/* Revenue */}
        <div className="bg-gray-900 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-yellow-400 font-medium mb-2">Ingresos <span className="text-green-400 text-sm ml-1">+24%</span></p>
            <h3 className="text-3xl font-bold">$12.5k</h3>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl">
            <TrendingUp className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>
      
      {/* Category and Activity sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Categorías de Productos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Category 1 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <Watch className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium">Relojes y Joyería</h3>
                  <p className="text-sm text-gray-400">245 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Category 2 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <Headphones className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Equipos de Audio</h3>
                  <p className="text-sm text-gray-400">182 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Category 3 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <Gamepad className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium">Accesorios Gaming</h3>
                  <p className="text-sm text-gray-400">156 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Category 4 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <ShoppingBag className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium">Ropa</h3>
                  <p className="text-sm text-gray-400">324 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Category 5 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <Music className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Equipos Musicales</h3>
                  <p className="text-sm text-gray-400">98 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Category 6 */}
            <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-xl mr-4">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium">Electrónicos</h3>
                  <p className="text-sm text-gray-400">45 items</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
          
          <div className="bg-gray-900 rounded-xl p-4 space-y-4">
            {/* Activity 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-800" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Actualización de Inventario</h3>
                  <p className="text-sm text-gray-400">hace 5 minutos</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Activity 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-800" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Nuevo Pedido Recibido</h3>
                  <p className="text-sm text-gray-400">hace 12 minutos</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Activity 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="bg-red-400 h-10 w-10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-800" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Alerta de Stock Bajo</h3>
                  <p className="text-sm text-gray-400">hace 25 minutos</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
            
            {/* Activity 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="bg-yellow-400 h-10 w-10 rounded-full flex items-center justify-center">
                    <Box className="h-5 w-5 text-yellow-800" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Producto Agregado</h3>
                  <p className="text-sm text-gray-400">hace 1 hora</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Add Button */}
      <button className="fixed bottom-6 right-6 h-12 w-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
        <Plus className="h-6 w-6 text-gray-900" />
      </button>
    </div>
  )
}