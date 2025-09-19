
import React from 'react';
import type { Dispatch } from 'react';
import type { SetStateAction } from 'react';
import { AuthView } from '../../types';

interface LoginScreenProps {
    setView: Dispatch<SetStateAction<AuthView>>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setView }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">Курьерская CRM</h1>
                <p className="text-gray-600 mb-8">Пожалуйста, выберите вашу роль для входа.</p>
                <div className="space-y-4">
                    <button
                        onClick={() => setView(AuthView.DISPATCHER)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        Вход для Диспетчера
                    </button>
                    <button
                        onClick={() => setView(AuthView.COURIER)}
                        className="w-full bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold py-4 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        Вход для Курьера
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;