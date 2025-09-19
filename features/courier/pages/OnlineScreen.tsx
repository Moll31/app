
import React, { useMemo } from 'react';
import type { Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';
import { OrderStatus } from '../../../types';

interface OnlineScreenProps {
    driver: Driver;
}

const OnlineScreen: React.FC<OnlineScreenProps> = ({ driver }) => {
    const { orders, settings, takeOrder } = useDataContext();

    const availableOrders = useMemo(() => {
        return orders.filter(o => o.status === OrderStatus.OPEN);
    }, [orders]);
    
    const calculateCommission = (price: number) => {
        return settings.commission_type === 'fixed'
            ? settings.commission_value
            : (price * settings.commission_value) / 100;
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Доступные заказы</h2>
            {availableOrders.length > 0 ? (
                <div className="space-y-4">
                    {availableOrders.map(order => {
                        const commission = calculateCommission(order.price);
                        const canTakeOrder = driver.balance >= commission;
                        return (
                            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                                <div className="flex flex-col md:flex-row justify-between md:items-center">
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <div className="text-sm text-gray-500">Откуда</div>
                                        <div className="font-semibold text-gray-800">{order.address_from}</div>
                                        <div className="text-sm text-gray-500 mt-2">Куда</div>
                                        <div className="font-semibold text-gray-800">{order.address_to || 'Не указано'}</div>
                                    </div>
                                    <div className="md:text-right md:w-1/4">
                                        <div className="text-sm text-gray-500">Цена</div>
                                        <div className="text-xl font-bold text-green-600">{order.price.toFixed(2)} ₽</div>
                                        <div className="text-xs text-red-500">Комиссия: {commission.toFixed(2)} ₽</div>
                                    </div>
                                </div>
                                {order.comment && <p className="text-sm text-gray-600 mt-3 pt-3 border-t">Комментарий: {order.comment}</p>}
                                <div className="text-right mt-4">
                                     { !canTakeOrder && <p className="text-xs text-red-500 mb-2 text-right">Недостаточно средств на балансе для оплаты комиссии</p> }
                                    <button
                                        onClick={() => takeOrder(order.id, driver.id)}
                                        disabled={!canTakeOrder}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        Взять заказ
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">На данный момент нет доступных заказов. Мы вас уведомим!</p>
                </div>
            )}
        </div>
    );
};

export default OnlineScreen;