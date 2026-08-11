import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

import { io } from 'socket.io-client';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await apiClient('/orders');
      setOrders(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar pedidos. Verifique la conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Setup Socket.io connection
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('orderCreated', (newOrder) => {
      setOrders(prev => [...prev, newOrder]);
    });

    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      });
      // Optimistic update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error al actualizar pedido');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  const renderOrderCard = (order) => {
    const timeString = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <div key={order.id} className="order-card">
        <div className="order-header">
          <div className="order-id">#{order.id} - {order.user.name.split(' ')[0]}</div>
          <div className="order-time">{timeString}</div>
        </div>
        
        <div className="order-items">
          {order.items.map((item, idx) => (
            <div key={idx} className="item-row">
              <div>
                <span className="item-qty">{item.quantity}x</span>
                {item.product.name}
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-actions">
          {order.status === 'PENDING' && (
            <button className="btn btn-primary" onClick={() => updateOrderStatus(order.id, 'PREPARING')}>
              Empezar
            </button>
          )}
          {order.status === 'PREPARING' && (
            <>
              <button className="btn btn-secondary" onClick={() => updateOrderStatus(order.id, 'PENDING')}>
                Deshacer
              </button>
              <button className="btn btn-primary" onClick={() => updateOrderStatus(order.id, 'READY')}>
                Listo
              </button>
            </>
          )}
          {order.status === 'READY' && (
            <button className="btn btn-secondary" onClick={() => updateOrderStatus(order.id, 'COMPLETED')}>
              Entregado (Quitar)
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🦖</span>
          <h1>RaptorEats<br/>Cocina</h1>
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Usuario: <strong>Cocina</strong>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2>Tablero de Pedidos</h2>
          {error && <div className="error-message" style={{ marginBottom: 0, padding: '0.5rem 1rem' }}>{error}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-indicator ${loading ? 'PENDING' : 'READY'}`}></span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {loading ? 'Actualizando...' : 'Conectado'}
            </span>
          </div>
        </header>
        
        <div className="kanban-board">
          {/* Pendientes */}
          <div className="kanban-column">
            <div className="column-header">
              <h2>Pendientes <span className="status-indicator PENDING"></span></h2>
              <span className="badge-count">{pendingOrders.length}</span>
            </div>
            <div className="column-body">
              {pendingOrders.map(renderOrderCard)}
              {pendingOrders.length === 0 && (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                  No hay pedidos nuevos
                </div>
              )}
            </div>
          </div>
          
          {/* Preparando */}
          <div className="kanban-column">
            <div className="column-header">
              <h2>Preparando <span className="status-indicator PREPARING"></span></h2>
              <span className="badge-count">{preparingOrders.length}</span>
            </div>
            <div className="column-body">
              {preparingOrders.map(renderOrderCard)}
            </div>
          </div>
          
          {/* Listos */}
          <div className="kanban-column">
            <div className="column-header">
              <h2>Listos para entregar <span className="status-indicator READY"></span></h2>
              <span className="badge-count">{readyOrders.length}</span>
            </div>
            <div className="column-body">
              {readyOrders.map(renderOrderCard)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
