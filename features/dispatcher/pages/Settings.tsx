
import React, { useState } from 'react';
import { useDataContext } from '../../../context/DataContext';
import type { Dispatcher } from '../../../types';

interface SettingsProps {
    user: Dispatcher;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
    const { settings, updateSettings, updateDispatcher } = useDataContext();
    const [commissionValue, setCommissionValue] = useState(settings.commission_value);
    const [commissionType, setCommissionType] = useState(settings.commission_type);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSaveSettings = () => {
        if (commissionType === 'percentage' && (commissionValue < 0 || commissionValue > 100)) {
            setMessage({ type: 'error', text: 'Процент комиссии должен быть от 0 до 100.' });
            return;
        }
        if (commissionValue < 0) {
            setMessage({ type: 'error', text: 'Сумма комиссии не может быть отрицательной.' });
            return;
        }
        updateSettings({ ...settings, commission_value: commissionValue, commission_type: commissionType });
        setMessage({ type: 'success', text: 'Настройки комиссии успешно обновлены!' });
        setTimeout(() => setMessage(null), 3000);
    };
    
    const handleChangePassword = () => {
        if(password.length < 4){
             setMessage({ type: 'error', text: 'Пароль должен быть не менее 4 символов.' });
             return;
        }
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Пароли не совпадают.' });
            return;
        }
        updateDispatcher({ ...user, password_hash: password }); // NOTE: In a real app, this would be hashed before sending to a server
        setMessage({ type: 'success', text: 'Пароль успешно изменен!' });
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Общие настройки</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Тип комиссии</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="commissionType" value="fixed" checked={commissionType === 'fixed'} onChange={() => setCommissionType('fixed')} className="form-radio h-4 w-4 text-blue-600" />
                                <span className="ml-2 text-gray-700">Фиксированная</span>
                            </label>
                             <label className="flex items-center">
                                <input type="radio" name="commissionType" value="percentage" checked={commissionType === 'percentage'} onChange={() => setCommissionType('percentage')} className="form-radio h-4 w-4 text-blue-600" />
                                <span className="ml-2 text-gray-700">Процент</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
                            {commissionType === 'fixed' ? 'Сумма комиссии (₽)' : 'Процент комиссии (%)'}
                        </label>
                        <input
                            type="number"
                            id="commission"
                            value={commissionValue}
                            onChange={(e) => setCommissionValue(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="text-right">
                        <button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                            Сохранить настройки
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Сменить пароль</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="new-password"className="block text-sm font-medium text-gray-700">Новый пароль</label>
                        <input
                            type="password"
                            id="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div className="text-right">
                        <button onClick={handleChangePassword} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                            Сменить пароль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;