
import React, { useMemo } from 'react';
import type { Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';
import { OrderStatus, TransactionType } from '../../../types';

interface OfflineScreenProps {
    driver: Driver;
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ driver }) => {
    const { updateDriver, transactions, orders } = useDataContext();
    
    const totalEarnings = useMemo(() => {
        const commissionTransactions = transactions.filter(t => t.driver_id === driver.id && t.type === TransactionType.ORDER_COMMISSION && t.order_id);
        
        let totalOrderPrice = 0;
        
        commissionTransactions.forEach(trans => {
            const order = orders.find(o => o.id === trans.order_id);
            if (order) {
                totalOrderPrice += order.price;
            }
        });
    
        const totalCommission = commissionTransactions.reduce((sum, t) => sum + t.amount, 0); // amount is negative
    
        return totalOrderPrice + totalCommission; // e.g. 500 + (-50) = 450
    }, [transactions, orders, driver.id]);
    
    const handleGoOnline = () => {
        updateDriver({ ...driver, is_online: true, last_activity: Date.now() });
    };

    return (
        <div className="max-w-md mx-auto text-center mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Добро пожаловать, {driver.full_name.split(' ')[0]}!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Текущий баланс</h3>
                    <p className={`text-3xl font-bold ${driver.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {driver.balance.toFixed(2)} ₽
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                     <h3 className="text-sm font-medium text-gray-500">Общий заработок</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {totalEarnings.toFixed(2)} ₽
                    </p>
                </div>
            </div>
            
            <button
                onClick={handleGoOnline}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 text-xl"
            >
                Выйти на линию
            </button>
        </div>
    );
};

export default OfflineScreen;