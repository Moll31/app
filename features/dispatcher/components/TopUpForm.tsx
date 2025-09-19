
import React, { useState } from 'react';
import type { Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';

interface TopUpFormProps {
    driver: Driver;
    onFinished: () => void;
}

const TopUpForm: React.FC<TopUpFormProps> = ({ driver, onFinished }) => {
    const { topUpDriverBalance } = useDataContext();
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            setError('Сумма должна быть положительной.');
            return;
        }
        setError('');
        topUpDriverBalance(driver.id, amount);
        onFinished();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">Текущий баланс: <span className="font-semibold">{driver.balance.toFixed(2)} ₽</span></p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-gray-700">Сумма пополнения</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                    min="0.01"
                    step="0.01"
                />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                    Подтвердить пополнение
                </button>
            </div>
        </form>
    );
};

export default TopUpForm;