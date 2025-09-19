
import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types';
import { useDataContext } from '../../../context/DataContext';
import { OrderStatus } from '../../../types';

interface OrderFormProps {
    order?: Order;
    onFinished: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onFinished }) => {
    const { addOrder, updateOrder, drivers, dropOrder } = useDataContext();
    const [formData, setFormData] = useState({
        sender_phone: '',
        receiver_phone: '',
        price: 0,
        comment: '',
        address_from: '',
        address_to: '',
        assigned_driver_id: 'none',
    });

    useEffect(() => {
        if (order) {
            setFormData({
                sender_phone: order.sender_phone,
                receiver_phone: order.receiver_phone || '',
                price: order.price,
                comment: order.comment || '',
                address_from: order.address_from,
                address_to: order.address_to || '',
                assigned_driver_id: order.assigned_driver_id?.toString() || 'none',
            });
        }
    }, [order]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const driverId = formData.assigned_driver_id === 'none' ? undefined : Number(formData.assigned_driver_id);
        const orderData = {
            sender_phone: formData.sender_phone,
            receiver_phone: formData.receiver_phone,
            price: Number(formData.price),
            comment: formData.comment,
            address_from: formData.address_from,
            address_to: formData.address_to,
            assigned_driver_id: driverId,
        };

        if (order) {
            const status = driverId ? OrderStatus.IN_PROGRESS : OrderStatus.OPEN;
            updateOrder({ ...order, ...orderData, status });
        } else {
            addOrder(orderData);
        }
        onFinished();
    };

    const handleUnassignDriver = () => {
        if (order) {
            dropOrder(order.id);
            onFinished();
        }
    };

    const availableDrivers = drivers.filter(d => !d.is_frozen);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Телефон отправителя*</label>
                <input type="tel" name="sender_phone" value={formData.sender_phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Телефон получателя</label>
                <input type="tel" name="receiver_phone" value={formData.receiver_phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Адрес Откуда*</label>
                <input type="text" name="address_from" value={formData.address_from} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Адрес Куда</label>
                <input type="text" name="address_to" value={formData.address_to} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Цена</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Комментарий</label>
                <textarea name="comment" value={formData.comment} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Назначить курьера</label>
                <select name="assigned_driver_id" value={formData.assigned_driver_id} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
                    <option value="none">Не назначен</option>
                    {availableDrivers.map(driver => <option key={driver.id} value={driver.id}>{driver.full_name}</option>)}
                </select>
            </div>
            <div className="flex justify-between pt-4">
                {order && order.status === OrderStatus.IN_PROGRESS && (
                     <button type="button" onClick={handleUnassignDriver} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">
                        Снять курьера
                    </button>
                )}
                <div className="flex-grow"></div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    {order ? 'Сохранить' : 'Опубликовать'}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;