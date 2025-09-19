import React, { useState } from 'react';
import { useDataContext } from '../../../context/DataContext';
import type { Driver } from '../../../types';
import Modal from '../../../components/Modal';
import DriverForm from '../components/DriverForm';
import TopUpForm from '../components/TopUpForm';

const Drivers: React.FC = () => {
    const { drivers, updateDriver, deleteDriver } = useDataContext();
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

    const handleToggleFreeze = (driver: Driver) => {
        updateDriver({ ...driver, is_frozen: !driver.is_frozen });
    };
    
    const handleDeleteDriver = (driver: Driver) => {
        if (window.confirm(`Вы уверены, что хотите удалить курьера "${driver.full_name}"? Это действие необратимо.`)) {
            deleteDriver(driver.id);
        }
    };

    const openTopUpModal = (driver: Driver) => {
        setSelectedDriver(driver);
        setIsTopUpModalOpen(true);
    };

    const handleAddDriver = () => {
        setEditingDriver(null);
        setIsDriverModalOpen(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setIsDriverModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-end items-center mb-6">
                <button
                    onClick={handleAddDriver}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    + Добавить курьера
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-5 py-3">ФИО</th>
                                <th className="px-5 py-3">Контакты</th>
                                <th className="px-5 py-3">Транспорт</th>
                                <th className="px-5 py-3">Баланс</th>
                                <th className="px-5 py-3">Статус</th>
                                <th className="px-5 py-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map(driver => (
                                <tr key={driver.id} className={`border-b border-gray-200 ${driver.is_frozen ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-semibold">{driver.full_name}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{driver.phone}</p>
                                        <p className="text-gray-600 whitespace-no-wrap">В/У: {driver.license_number}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{driver.car_number}</p>
                                    </td>
                                     <td className="px-5 py-4 text-sm">
                                        <p className={`whitespace-no-wrap font-semibold ${driver.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {driver.balance.toFixed(2)} ₽
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${driver.is_frozen ? 'bg-red-100 text-red-800' : (driver.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}`}>
                                            <span className="relative">{driver.is_frozen ? 'Заморожен' : (driver.is_online ? 'На линии' : 'Оффлайн')}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handleEditDriver(driver)} className="text-blue-600 hover:text-blue-900 font-medium">Ред.</button>
                                            <button onClick={() => openTopUpModal(driver)} className="text-green-600 hover:text-green-900 font-medium">Пополнить</button>
                                            <label htmlFor={`freeze-${driver.id}`} className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                    <input type="checkbox" id={`freeze-${driver.id}`} className="sr-only" checked={driver.is_frozen} onChange={() => handleToggleFreeze(driver)} />
                                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${driver.is_frozen ? 'transform translate-x-full bg-red-400' : 'bg-green-400'}`}></div>
                                                </div>
                                                <div className="ml-3 text-gray-700 text-xs font-medium">{driver.is_frozen ? 'Разморозить' : 'Заморозить'}</div>
                                            </label>
                                            <button onClick={() => handleDeleteDriver(driver)} className="text-red-600 hover:text-red-900 font-medium">Удалить</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isDriverModalOpen} onClose={() => setIsDriverModalOpen(false)} title={editingDriver ? 'Редактировать курьера' : 'Добавить нового курьера'}>
                <DriverForm driver={editingDriver} onFinished={() => setIsDriverModalOpen(false)} />
            </Modal>
            
            {selectedDriver && (
                 <Modal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} title={`Пополнить баланс: ${selectedDriver.full_name}`}>
                    <TopUpForm driver={selectedDriver} onFinished={() => setIsTopUpModalOpen(false)} />
                </Modal>
            )}

        </div>
    );
};

export default Drivers;