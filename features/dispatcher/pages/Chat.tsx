
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Dispatcher, Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';

interface ChatProps {
    user: Dispatcher;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
    const { drivers, messages, sendMessage, markMessagesAsRead } = useDataContext();
    const [selectedCourierId, setSelectedCourierId] = useState<number | null>(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const onlineDrivers = useMemo(() => drivers.filter(d => d.is_online && !d.is_frozen), [drivers]);

    const unreadMessagesByCourier = useMemo(() => {
        const unreadCounts: { [key: number]: number } = {};
        messages.forEach(msg => {
            if (msg.receiverId === user.id && msg.senderType === 'courier' && !msg.isRead) {
                unreadCounts[msg.senderId] = (unreadCounts[msg.senderId] || 0) + 1;
            }
        });
        return unreadCounts;
    }, [messages, user.id]);

    const selectedCourier = useMemo(() => {
        if (!selectedCourierId) return null;
        return drivers.find(d => d.id === selectedCourierId);
    }, [drivers, selectedCourierId]);

    const chatMessages = useMemo(() => {
        if (!selectedCourierId) return [];
        return messages.filter(msg =>
            (msg.senderId === user.id && msg.receiverId === selectedCourierId) ||
            (msg.senderId === selectedCourierId && msg.receiverId === user.id)
        ).sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, selectedCourierId, user.id]);

    useEffect(() => {
        if (selectedCourierId) {
            markMessagesAsRead(selectedCourierId, user.id);
        }
    }, [selectedCourierId, messages, user.id, markMessagesAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSelectCourier = (driver: Driver) => {
        setSelectedCourierId(driver.id);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim() === '' || !selectedCourierId) return;
        sendMessage({
            senderId: user.id,
            senderType: 'dispatcher',
            receiverId: selectedCourierId,
            text: messageText,
        });
        setMessageText('');
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Courier List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Курьеры на линии</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {onlineDrivers.map(driver => (
                        <div
                            key={driver.id}
                            onClick={() => handleSelectCourier(driver)}
                            className={`p-4 cursor-pointer flex items-center justify-between ${selectedCourierId === driver.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        >
                            <p className="font-medium text-gray-700">{driver.full_name}</p>
                            {unreadMessagesByCourier[driver.id] > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadMessagesByCourier[driver.id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedCourier ? (
                    <>
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-800">Чат с {selectedCourier.full_name}</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderType === 'dispatcher' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.senderType === 'dispatcher' ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.senderType === 'dispatcher' ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Напишите сообщение..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600">
                                    Отпр
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Выберите курьера, чтобы начать чат.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;