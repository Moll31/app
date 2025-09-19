import React, { useState } from 'react';
import type { Order, Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';

interface MyOrderScreenProps {
    order: Order;
    driver: Driver;
}

const MyOrderScreen: React.FC<MyOrderScreenProps> = ({ order, driver }) => {
    const { dropOrder, completeOrder } = useDataContext();
    const [cargoReceived, setCargoReceived] = useState(false);

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Ваш текущий заказ</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-bold text-blue-600">Маршрут</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">ОТКУДА</p>
                        <p className="text-lg font-medium text-gray-900">{order.address_from}</p>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">КУДА</p>
                        <p className="text-lg font-medium text-gray-900">{order.address_to || 'Не указано'}</p>
                    </div>
                </div>

                <div className="border-b pb-4 mb-4">
                     <h3 className="text-lg font-bold text-blue-600">Контакты</h3>
                     <p className="text-sm text-gray-500 mt-2">Телефон отправителя: <span className="font-medium text-gray-800">{order.sender_phone}</span></p>
                     {order.receiver_phone && <p className="text-sm text-gray-500">Телефон получателя: <span className="font-medium text-gray-800">{order.receiver_phone}</span></p>}
                </div>

                {order.comment && (
                    <div className="border-b pb-4 mb-4">
                        <h3 className="text-lg font-bold text-blue-600">Комментарий</h3>
                        <p className="text-gray-700 italic mt-2">"{order.comment}"</p>
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-blue-600">Оплата</h3>
                    <p className="text-2xl font-bold text-green-600">{order.price.toFixed(2)} ₽</p>
                </div>
                
                <div className="space-y-3">
                    {!cargoReceived && (
                        <button onClick={() => setCargoReceived(true)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg text-lg">
                            Груз получен
                        </button>
                    )}
                    <button 
                        onClick={() => completeOrder(order.id, driver.id)}
                        disabled={!cargoReceived}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Доставлено
                    </button>
                    <button 
                        onClick={() => dropOrder(order.id)}
                        disabled={cargoReceived}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Сбросить заказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyOrderScreen;