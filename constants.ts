
import type { Order, Driver, Transaction, Settings, Dispatcher, Message } from './types';
import { OrderStatus, TransactionType } from './types';

export const INITIAL_DISPATCHERS: Dispatcher[] = [
    { id: 1, login: 'admin', password_hash: 'admin' }, // In a real app, this would be a hash
];

export const INITIAL_DRIVERS: Driver[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_SETTINGS: Settings = {
    id: 1,
    commission_type: 'fixed',
    commission_value: 50,
};

export const INITIAL_MESSAGES: Message[] = [];