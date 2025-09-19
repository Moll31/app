
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Order, Driver, Transaction, Settings, Dispatcher, Message } from '../types';
import { OrderStatus, TransactionType } from '../types';
import { INITIAL_ORDERS, INITIAL_DRIVERS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS, INITIAL_DISPATCHERS, INITIAL_MESSAGES } from '../constants';

interface DataContextType {
    orders: Order[];
    drivers: Driver[];
    transactions: Transaction[];
    settings: Settings;
    dispatchers: Dispatcher[];
    messages: Message[];
    addOrder: (orderData: Omit<Order, 'id' | 'created_date' | 'status'>) => void;
    updateOrder: (order: Order) => void;
    deleteOrder: (orderId: number) => void;
    addDriver: (driverData: Omit<Driver, 'id' | 'is_frozen' | 'balance' | 'is_online' | 'last_activity'>) => void;
    updateDriver: (driver: Driver) => void;
    deleteDriver: (driverId: number) => void;
    topUpDriverBalance: (driverId: number, amount: number) => void;
    updateSettings: (newSettings: Settings) => void;
    updateDispatcher: (dispatcher: Dispatcher) => void;
    takeOrder: (orderId: number, driverId: number) => void;
    dropOrder: (orderId: number) => void;
    completeOrder: (orderId: number, driverId: number) => void;
    sendMessage: (messageData: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
    markMessagesAsRead: (chatPartnerId: number, currentUserId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [dispatchers, setDispatchers] = useState<Dispatcher[]>(INITIAL_DISPATCHERS);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

    // Data cleanup on mount
    useEffect(() => {
        const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);
        setOrders(prev => prev.filter(o => o.created_date > sixMonthsAgo));
        setTransactions(prev => prev.filter(t => t.date > sixMonthsAgo));
    }, []);

    // Auto-logout check
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            setDrivers(prevDrivers => {
                let changed = false;
                const updatedDrivers = prevDrivers.map(driver => {
                    if (driver.is_online && (now - driver.last_activity > oneHour)) {
                        changed = true;
                        return { ...driver, is_online: false };
                    }
                    return driver;
                });
                return changed ? updatedDrivers : prevDrivers;
            });
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const addOrder = useCallback((orderData: Omit<Order, 'id' | 'created_date' | 'status'>) => {
        setOrders(prev => [
            ...prev,
            {
                ...orderData,
                id: Date.now(),
                created_date: Date.now(),
                status: OrderStatus.OPEN,
            },
        ]);
    }, []);

    const updateOrder = useCallback((updatedOrder: Order) => {
        setOrders(prev => prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
    }, []);

    const deleteOrder = useCallback((orderId: number) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    }, []);

    const addDriver = useCallback((driverData: Omit<Driver, 'id' | 'is_frozen' | 'balance' | 'is_online' | 'last_activity'>) => {
        setDrivers(prev => [
            ...prev,
            {
                ...driverData,
                id: Date.now(),
                is_frozen: false,
                balance: 0,
                is_online: false,
                last_activity: 0,
            },
        ]);
    }, []);

    const deleteDriver = useCallback((driverId: number) => {
        const hasActiveOrder = orders.some(o => o.assigned_driver_id === driverId && o.status === OrderStatus.IN_PROGRESS);
        if (hasActiveOrder) {
            alert('Нельзя удалить курьера с активным заказом. Сначала снимите его с заказа.');
            return;
        }
        setDrivers(prev => prev.filter(d => d.id !== driverId));
        setTransactions(prev => prev.filter(t => t.driver_id !== driverId));
    }, [orders]);

    const updateDriver = useCallback((updatedDriver: Driver) => {
        setDrivers(prev => prev.map(d => (d.id === updatedDriver.id ? updatedDriver : d)));
    }, []);
    
    const updateDispatcher = useCallback((updatedDispatcher: Dispatcher) => {
        setDispatchers(prev => prev.map(d => d.id === updatedDispatcher.id ? updatedDispatcher : d));
    }, []);

    const topUpDriverBalance = useCallback((driverId: number, amount: number) => {
        setDrivers(prev => prev.map(d => (d.id === driverId ? { ...d, balance: d.balance + amount } : d)));
        setTransactions(prev => [
            ...prev,
            {
                id: Date.now(),
                driver_id: driverId,
                amount,
                type: TransactionType.BALANCE_TOPUP,
                date: Date.now(),
            },
        ]);
    }, []);
    
    const takeOrder = useCallback((orderId: number, driverId: number) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.IN_PROGRESS, assigned_driver_id: driverId } : o));
    }, []);

    const dropOrder = useCallback((orderId: number) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.OPEN, assigned_driver_id: undefined } : o));
    }, []);

    const completeOrder = useCallback((orderId: number, driverId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const commissionAmount = settings.commission_type === 'fixed'
            ? settings.commission_value
            : (order.price * settings.commission_value) / 100;

        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.COMPLETED, completed_date: Date.now() } : o));
        setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, balance: d.balance - commissionAmount } : d));
        setTransactions(prev => [
            ...prev,
            {
                id: Date.now(),
                driver_id: driverId,
                order_id: orderId,
                amount: -commissionAmount,
                type: TransactionType.ORDER_COMMISSION,
                date: Date.now(),
            }
        ]);
    }, [orders, settings.commission_type, settings.commission_value]);


    const updateSettings = useCallback((newSettings: Settings) => {
        setSettings(newSettings);
    }, []);
    
    const sendMessage = useCallback((messageData: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        setMessages(prev => [
            ...prev,
            {
                ...messageData,
                id: Date.now(),
                timestamp: Date.now(),
                isRead: false,
            },
        ]);
    }, []);

    const markMessagesAsRead = useCallback((chatPartnerId: number, currentUserId: number) => {
        setMessages(prev =>
            prev.map(msg => {
                if (msg.senderId === chatPartnerId && msg.receiverId === currentUserId && !msg.isRead) {
                    return { ...msg, isRead: true };
                }
                return msg;
            })
        );
    }, []);
    
    const contextValue = useMemo(() => ({
        orders, drivers, transactions, settings, dispatchers, messages, addOrder, updateOrder, deleteOrder, addDriver, updateDriver, deleteDriver, topUpDriverBalance, updateSettings, updateDispatcher, takeOrder, dropOrder, completeOrder, sendMessage, markMessagesAsRead
    }), [orders, drivers, transactions, settings, dispatchers, messages, addOrder, updateOrder, deleteOrder, addDriver, updateDriver, deleteDriver, topUpDriverBalance, updateSettings, updateDispatcher, takeOrder, dropOrder, completeOrder, sendMessage, markMessagesAsRead]);

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};