
import React, { useState, useMemo } from 'react';
import type { Dispatcher } from '../../types';
import Orders from './pages/Orders';
import Drivers from './pages/Drivers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import { useDataContext } from '../../context/DataContext';

// Icon components
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const DriversIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 14h13a3.5 3.5 0 0 1 3.5 3.5v.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-.5A3.5 3.5 0 0 1 5.5 14z"></path></svg>;
const ReportsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6V2h-6zM2.5 16v6h6v-6h-6zM15.5 2v6h6V2h-6zM15.5 16v6h6v-6h-6z"></path><path d="M8.5 2v20M15.5 2v20"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.02l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.02l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;


interface DispatcherDashboardProps {
    user: Dispatcher;
    onLogout: () => void;
}

type Page = 'orders' | 'drivers' | 'reports' | 'settings' | 'chat';

const DispatcherDashboard: React.FC<DispatcherDashboardProps> = ({ user, onLogout }) => {
    const [currentPage, setCurrentPage] = useState<Page>('orders');
    const { drivers, messages } = useDataContext();

    const onlineDrivers = useMemo(() => drivers.filter(d => d.is_online && !d.is_frozen), [drivers]);
    const hasUnreadMessages = useMemo(() => messages.some(msg => msg.receiverId === user.id && msg.senderType === 'courier' && !msg.isRead), [messages, user.id]);

    const pageTitles: { [key in Page]: string } = {
        orders: 'Заказы',
        drivers: 'Курьеры',
        reports: 'Отчеты',
        settings: 'Настройки',
        chat: 'Чат',
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'orders': return <Orders />;
            case 'drivers': return <Drivers />;
            case 'reports': return <Reports />;
            case 'settings': return <Settings user={user}/>;
            case 'chat': return <Chat user={user}/>;
            default: return <Orders />;
        }
    };

    const navItems = [
        { id: 'orders', label: 'Заказы', icon: <OrdersIcon /> },
        { id: 'drivers', label: 'Курьеры', icon: <DriversIcon /> },
        { id: 'chat', label: 'Чат', icon: <ChatIcon /> },
        { id: 'reports', label: 'Отчеты', icon: <ReportsIcon /> },
        { id: 'settings', label: 'Настройки', icon: <SettingsIcon /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Курьерская CRM</h1>
                    <p className="text-sm text-gray-500">Панель Диспетчера</p>
                </div>
                <nav className="flex-1 mt-4">
                    {navItems.map(item => (
                        <a
                            key={item.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(item.id as Page); }}
                            className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors duration-200 ${currentPage === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                            {item.id === 'chat' && hasUnreadMessages && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>}
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-200 rounded-lg">
                        <span className="mr-3"><LogoutIcon /></span>
                        Выйти
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-700 capitalize">{pageTitles[currentPage]}</h2>
                    <div className="text-gray-600">Добро пожаловать, <span className="font-semibold">{user.login}</span></div>
                </header>
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderPage()}
                </div>
            </main>
            
            {/* Online Drivers Panel */}
            <aside className="w-72 bg-white border-l p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                    Курьеры на линии ({onlineDrivers.length})
                </h3>
                <div className="space-y-4">
                    {onlineDrivers.length > 0 ? onlineDrivers.map(driver => (
                        <div key={driver.id} className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-800">{driver.full_name}</p>
                            <p className="text-sm text-gray-600">{driver.phone}</p>
                            <p className="text-sm text-gray-600">Авто: {driver.car_number}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center mt-8">Нет курьеров на линии.</p>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default DispatcherDashboard;