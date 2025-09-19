import React, { useState, useEffect } from 'react';
import { useDataContext } from '../../../context/DataContext';
import type { Driver } from '../../../types';

interface DriverFormProps {
    driver?: Driver | null;
    onFinished: () => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ driver, onFinished }) => {
    const { addDriver, updateDriver } = useDataContext();
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        license_number: '',
        car_number: '',
    });

    useEffect(() => {
        if (driver) {
            setFormData({
                full_name: driver.full_name,
                phone: driver.phone,
                license_number: driver.license_number,
                car_number: driver.car_number,
            });
        } else {
             setFormData({
                full_name: '',
                phone: '',
                license_number: '',
                car_number: '',
            });
        }
    }, [driver]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (driver) {
            updateDriver({ ...driver, ...formData });
        } else {
            addDriver(formData);
        }
        onFinished();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">ФИО*</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Номер телефона*</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Номер В/У*</label>
                <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Номер машины*</label>
                <input type="text" name="car_number" value={formData.car_number} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    {driver ? 'Сохранить изменения' : 'Добавить курьера'}
                </button>
            </div>
        </form>
    );
};

export default DriverForm;