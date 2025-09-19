
import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../context/DataContext';
import { OrderStatus, TransactionType } from '../../../types';
import type { Order, Transaction, Driver } from '../../../types';

interface ReportData {
    totalOrders: number;
    totalDriverEarnings: number;
    totalTopUps: number;
    driverDetails: {
        driver: Driver;
        completedOrders: number;
        earnings: number;
    }[];
}

const Reports: React.FC = () => {
    const { orders, transactions, drivers, settings } = useDataContext();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [startDate, setStartDate] = useState<Date>(today);
    const [endDate, setEndDate] = useState<Date>(new Date());
    
    const reportData = useMemo<ReportData | null>(() => {
        if (!startDate || !endDate) return null;

        const startTimestamp = startDate.getTime();
        const endTimestamp = endDate.getTime() + (24*60*60*1000-1); // Include full end day

        const relevantOrders = orders.filter(o => o.status === OrderStatus.COMPLETED && o.completed_date && o.completed_date >= startTimestamp && o.completed_date <= endTimestamp);
        const relevantTopUps = transactions.filter(t => t.type === TransactionType.BALANCE_TOPUP && t.date >= startTimestamp && t.date <= endTimestamp);

        const calculateCommission = (price: number) => settings.commission_type === 'fixed'
            ? settings.commission_value
            : (price * settings.commission_value) / 100;

        const totalOrders = relevantOrders.length;
        const totalTopUps = relevantTopUps.reduce((sum, t) => sum + t.amount, 0);
        
        const totalDriverEarnings = relevantOrders.reduce((sum, o) => sum + (o.price - calculateCommission(o.price)), 0);

        const driverDetails = drivers.map(driver => {
            const completedOrdersByDriver = relevantOrders.filter(o => o.assigned_driver_id === driver.id);
            const earnings = completedOrdersByDriver.reduce((sum, o) => sum + (o.price - calculateCommission(o.price)), 0);
            return {
                driver,
                completedOrders: completedOrdersByDriver.length,
                earnings,
            };
        }).filter(d => d.completedOrders > 0);

        return { totalOrders, totalDriverEarnings, totalTopUps, driverDetails };
    }, [startDate, endDate, orders, transactions, drivers, settings]);

    const setPeriod = (period: 'today' | 'custom' | Date) => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        
        if (period === 'today') {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            setStartDate(start);
            setEndDate(end);
        } else if (period instanceof Date) {
             const start = new Date(period);
             start.setHours(0,0,0,0);
             const customEnd = new Date(period);
             customEnd.setHours(23,59,59,999);
             setStartDate(start);
             setEndDate(customEnd);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Сформировать отчет</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
                        <input type="date" value={startDate.toISOString().split('T')[0]} onChange={e => setStartDate(new Date(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                        <input type="date" value={endDate.toISOString().split('T')[0]} onChange={e => setEndDate(new Date(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => setPeriod('today')} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">За сегодня</button>
                    </div>
                </div>
            </div>

            {reportData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-500">Всего заказов</h3>
                            <p className="text-4xl font-bold text-blue-600">{reportData.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-500">Общий заработок курьеров</h3>
                            <p className="text-4xl font-bold text-green-600">{reportData.totalDriverEarnings.toFixed(2)} ₽</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-semibold text-gray-500">Всего пополнений баланса</h3>
                            <p className="text-4xl font-bold text-yellow-600">{reportData.totalTopUps.toFixed(2)} ₽</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <h3 className="text-xl font-semibold text-gray-800 p-4 border-b">Детализация по курьерам</h3>
                        <div className="overflow-x-auto">
                           <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <th className="px-5 py-3">Имя курьера</th>
                                        <th className="px-5 py-3">Выполнено заказов</th>
                                        <th className="px-5 py-3">Общий заработок</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.driverDetails.map(({ driver, completedOrders, earnings }) => (
                                        <tr key={driver.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-5 py-4 text-sm font-semibold">{driver.full_name}</td>
                                            <td className="px-5 py-4 text-sm">{completedOrders}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-green-700">{earnings.toFixed(2)} ₽</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;