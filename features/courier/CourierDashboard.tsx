
import React, { useMemo, useState } from 'react';
import type { Driver } from '../../types';
import { useDataContext } from '../../context/DataContext';
import { OrderStatus } from '../../types';
import OfflineScreen from './pages/OfflineScreen';
import OnlineScreen from './pages/OnlineScreen';
import MyOrderScreen from './pages/MyOrderScreen';
import ChatModal from './components/ChatModal';

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

interface CourierDashboardProps {
    user: Driver;
    onLogout: () => void;
}

const CourierDashboard: React.FC<CourierDashboardProps> = ({ user, onLogout }) => {
    const { orders, drivers, updateDriver, messages } = useDataContext();
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // Find the specific driver from the context to get the most up-to-date data
    const currentDriver = drivers.find(d => d.id === user.id);

    const activeOrder = useMemo(() => {
        if (!currentDriver || !currentDriver.is_online) return null;
        return orders.find(o => o.assigned_driver_id === currentDriver.id && o.status === OrderStatus.IN_PROGRESS);
    }, [orders, currentDriver]);

    const hasUnreadMessages = useMemo(() => {
        if (!currentDriver) return false;
        return messages.some(msg => msg.receiverId === currentDriver.id && msg.senderType === 'dispatcher' && !msg.isRead)
    }, [messages, currentDriver]);

    if (!currentDriver) {
        return <div className="p-4">Ошибка: Данные курьера не найдены.</div>;
    }
    
    if (currentDriver.is_frozen) {
        return (
            <div className="min-h-screen bg-red-50 flex flex-col justify-center items-center p-4 text-center">
                <h1 className="text-3xl font-bold text-red-700 mb-4">Аккаунт заморожен</h1>
                <p className="text-red-600 max-w-md mb-8">Ваш аккаунт был заморожен диспетчером. Пожалуйста, свяжитесь с поддержкой для получения дополнительной информации.</p>
                <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg">
                    Выйти
                </button>
            </div>
        );
    }
    
    const renderContent = () => {
        if (!currentDriver.is_online) {
            return <OfflineScreen driver={currentDriver} />;
        }
        if (activeOrder) {
            return <MyOrderScreen order={activeOrder} driver={currentDriver}/>;
        }
        return <OnlineScreen driver={currentDriver} />;
    };

    const handleGoOffline = () => {
        updateDriver({ ...currentDriver, is_online: false });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">Панель курьера</h1>
                    <div className="flex items-center space-x-4">
                       <button onClick={() => setIsChatOpen(true)} className="relative text-gray-600 hover:text-blue-600" aria-label="Open Chat">
                            <ChatIcon />
                            {hasUnreadMessages && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>}
                        </button>
                       <span className={`px-3 py-1 text-sm font-semibold rounded-full ${currentDriver.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                            {currentDriver.is_online ? 'На линии' : 'Оффлайн'}
                        </span>
                        {currentDriver.is_online && !activeOrder && (
                            <button onClick={handleGoOffline} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-sm">
                                Уйти с линии
                            </button>
                        )}
                        <button onClick={onLogout} className="text-blue-500 hover:underline text-sm">Выйти</button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-6">
                {renderContent()}
            </main>
            {currentDriver && <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} driver={currentDriver} />}
        </div>
    );
};

export default CourierDashboard;