
import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../context/DataContext';
import type { Order } from '../../../types';
import { OrderStatus } from '../../../types';
import Modal from '../../../components/Modal';
import OrderForm from '../components/OrderForm';

const Orders: React.FC = () => {
    const { orders, drivers, deleteOrder } = useDataContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = useMemo(() => {
        const sortedOrders = [...orders].sort((a, b) => b.created_date - a.created_date);
        if (filter === 'all') {
            return sortedOrders;
        }
        return sortedOrders.filter(order => order.status === filter);
    }, [orders, filter]);

    const handleNewOrder = () => {
        setEditingOrder(undefined);
        setIsModalOpen(true);
    };

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };
    
    const getDriverName = (driverId?: number) => {
        if (!driverId) return 'Н/Д';
        return drivers.find(d => d.id === driverId)?.full_name || 'Неизвестный водитель';
    };
    
    const getStatusInfo = (status: OrderStatus): { className: string, text: string } => {
        switch (status) {
            case OrderStatus.OPEN: return { className: 'bg-blue-100 text-blue-800', text: 'Открыт' };
            case OrderStatus.IN_PROGRESS: return { className: 'bg-yellow-100 text-yellow-800', text: 'В работе' };
            case OrderStatus.COMPLETED: return { className: 'bg-green-100 text-green-800', text: 'Завершен' };
        }
    };


    const filterButtons = [
        { label: 'Все', value: 'all' },
        { label: 'Открытые', value: OrderStatus.OPEN },
        { label: 'В работе', value: OrderStatus.IN_PROGRESS },
        { label: 'Завершенные', value: OrderStatus.COMPLETED },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm">
                   {filterButtons.map(btn => (
                        <button
                            key={btn.value}
                            onClick={() => setFilter(btn.value as OrderStatus | 'all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === btn.value ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {btn.label}
                        </button>
                   ))}
                </div>
                <button
                    onClick={handleNewOrder}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    + Новый заказ
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-5 py-3">Откуда / Куда</th>
                                <th className="px-5 py-3">Клиент</th>
                                <th className="px-5 py-3">Цена</th>
                                <th className="px-5 py-3">Курьер</th>
                                <th className="px-5 py-3">Статус</th>
                                <th className="px-5 py-3">Создан</th>
                                <th className="px-5 py-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => {
                                const statusInfo = getStatusInfo(order.status);
                                return (
                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-semibold">{order.address_from}</p>
                                        <p className="text-gray-600 whitespace-no-wrap">{order.address_to || 'Н/Д'}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{order.sender_phone}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-semibold">{order.price.toFixed(2)} ₽</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{getDriverName(order.assigned_driver_id)}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusInfo.className}`}>
                                            <span className="relative capitalize">{statusInfo.text}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{new Date(order.created_date).toLocaleString()}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {order.status !== OrderStatus.COMPLETED && (
                                            <button onClick={() => handleEditOrder(order)} className="text-blue-600 hover:text-blue-900 mr-3">Ред.</button>
                                        )}
                                        {order.status === OrderStatus.OPEN && (
                                            <button onClick={() => deleteOrder(order.id)} className="text-red-600 hover:text-red-900">Удал.</button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOrder ? 'Редактировать заказ' : 'Новый заказ'}>
                <OrderForm order={editingOrder} onFinished={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Orders;