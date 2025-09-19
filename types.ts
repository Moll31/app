
export enum OrderStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export enum TransactionType {
    ORDER_COMMISSION = 'order_commission',
    BALANCE_TOPUP = 'balance_topup',
}

export enum AuthView {
    MAIN = 'main',
    DISPATCHER = 'dispatcher',
    COURIER = 'courier',
}

export interface Dispatcher {
    id: number;
    login: string;
    password_hash: string;
}

export interface Driver {
    id: number;
    full_name: string;
    phone: string;
    license_number: string;
    car_number: string;
    is_frozen: boolean;
    balance: number;
    is_online: boolean;
    last_activity: number; // unix timestamp
}

export interface Order {
    id: number;
    sender_phone: string;
    receiver_phone?: string;
    price: number;
    comment?: string;
    address_from: string;
    address_to?: string;
    status: OrderStatus;
    assigned_driver_id?: number;
    created_date: number; // unix timestamp
    completed_date?: number; // unix timestamp
}

export interface Transaction {
    id: number;
    driver_id: number;
    order_id?: number;
    amount: number;
    type: TransactionType;
    date: number; // unix timestamp
}

export interface Settings {
    id: number;
    commission_type: 'fixed' | 'percentage';
    commission_value: number;
}

export type User = {
    type: 'dispatcher';
    data: Dispatcher;
} | {
    type: 'courier';
    data: Driver;
};

export interface Message {
    id: number;
    senderId: number; // courier.id or dispatcher.id
    senderType: 'courier' | 'dispatcher';
    receiverId: number; // courier.id or dispatcher.id
    text: string;
    timestamp: number;
    isRead: boolean;
}