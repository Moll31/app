
import React, { useState } from 'react';

interface CourierLoginFormProps {
    onLogin: (phone: string, license: string) => boolean;
    onBack: () => void;
}

const CourierLoginForm: React.FC<CourierLoginFormProps> = ({ onLogin, onBack }) => {
    const [phone, setPhone] = useState('');
    const [license, setLicense] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onLogin(phone, license)) {
            setError('Неверный номер телефона или В/У.');
        } else {
            setError('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
                <button onClick={onBack} className="text-blue-500 hover:underline mb-4">&larr; Назад</button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Вход для Курьера</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Номер телефона
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="license">
                            Номер В/У
                        </label>
                        <input
                            id="license"
                            type="text"
                            value={license}
                            onChange={(e) => setLicense(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourierLoginForm;