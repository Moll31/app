
import React, { useState, useCallback } from 'react';
import { DataProvider, useDataContext } from './context/DataContext';
import LoginScreen from './features/auth/LoginScreen';
import DispatcherLoginForm from './features/auth/DispatcherLoginForm';
import CourierLoginForm from './features/auth/CourierLoginForm';
import DispatcherDashboard from './features/dispatcher/DispatcherDashboard';
import CourierDashboard from './features/courier/CourierDashboard';
import type { User, Driver } from './types';
import { AuthView } from './types';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authView, setAuthView] = useState<AuthView>(AuthView.MAIN);
    const { drivers, dispatchers } = useDataContext();

    const handleDispatcherLogin = useCallback((login: string, pass: string): boolean => {
        const dispatcher = dispatchers.find(d => d.login === login && d.password_hash === pass); // NOTE: In a real app, this would be a hashed password check
        if (dispatcher) {
            setUser({ type: 'dispatcher', data: dispatcher });
            return true;
        }
        return false;
    }, [dispatchers]);

    const handleCourierLogin = useCallback((phone: string, license: string): boolean => {
        const driver = drivers.find(d => d.phone === phone && d.license_number === license);
        if (driver) {
            setUser({ type: 'courier', data: driver });
            return true;
        }
        return false;
    }, [drivers]);

    const handleLogout = () => {
        setUser(null);
        setAuthView(AuthView.MAIN);
    };

    if (!user) {
        switch (authView) {
            case AuthView.DISPATCHER:
                return <DispatcherLoginForm onLogin={handleDispatcherLogin} onBack={() => setAuthView(AuthView.MAIN)} />;
            case AuthView.COURIER:
                return <CourierLoginForm onLogin={handleCourierLogin} onBack={() => setAuthView(AuthView.MAIN)} />;
            default:
                return <LoginScreen setView={setAuthView} />;
        }
    }

    if (user.type === 'dispatcher') {
        return <DispatcherDashboard user={user.data} onLogout={handleLogout} />;
    }

    if (user.type === 'courier') {
        return <CourierDashboard user={user.data as Driver} onLogout={handleLogout} />;
    }

    return null;
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <AppContent />
        </DataProvider>
    );
};

export default App;
