
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Driver } from '../../../types';
import { useDataContext } from '../../../context/DataContext';
import Modal from '../../../components/Modal';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver: Driver;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, driver }) => {
    const { messages, sendMessage, markMessagesAsRead, dispatchers } = useDataContext();
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // For simplicity, we assume the courier chats with the first dispatcher.
    const dispatcherId = dispatchers[0]?.id;

    const chatMessages = useMemo(() => {
        if (!dispatcherId) return [];
        return messages.filter(msg =>
            (msg.senderId === driver.id && msg.receiverId === dispatcherId) ||
            (msg.senderId === dispatcherId && msg.receiverId === driver.id)
        ).sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, driver.id, dispatcherId]);

    useEffect(() => {
        if (isOpen && dispatcherId) {
            markMessagesAsRead(dispatcherId, driver.id);
        }
    }, [isOpen, dispatcherId, driver.id, messages, markMessagesAsRead]);

    useEffect(() => {
        if(isOpen) {
             setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [chatMessages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.trim() === '' || !dispatcherId) return;
        sendMessage({
            senderId: driver.id,
            senderType: 'courier',
            receiverId: dispatcherId,
            text: messageText,
        });
        setMessageText('');
    };
    
    if (!dispatcherId) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Чат с Диспетчером">
            <div className="flex flex-col h-[70vh]">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100 rounded-md">
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderType === 'courier' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs p-3 rounded-lg ${msg.senderType === 'courier' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.senderType === 'courier' ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Напишите сообщение..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Chat message input"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600" aria-label="Send message">
                            Отпр
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
