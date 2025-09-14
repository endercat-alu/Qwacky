import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

interface NotificationProps {
  message: string;
  position?: { x: number; y: number };
  duration?: number;
  onClose: () => void;
}

const NotificationContainer = styled.div<{ position?: { x: number; y: number } }>`
  position: fixed;
  background: #ff9f19;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 999999;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
  
  ${props => props.position
    ? `
      left: ${props.position.x}px;
      top: ${props.position.y}px;
    `
    : `
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Notification: React.FC<NotificationProps> = ({
  message,
  position,
  duration = 1500,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return createPortal(
    <NotificationContainer position={position}>
      {message}
    </NotificationContainer>,
    document.body
  );
};

interface NotificationItem {
  id: string;
  message: string;
  position?: { x: number; y: number };
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const showNotification = (message: string, event?: MouseEvent) => {
    const id = Math.random().toString(36).substring(2, 9);
    const position = event ? { x: event.clientX + 10, y: event.clientY + 10 } : undefined;
    
    setNotifications(prev => [...prev, { id, message, position }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(item => item.id !== id));
    }, 1500);
  };
  
  const NotificationRenderer = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          position={notification.position}
          onClose={() => setNotifications(prev => prev.filter(item => item.id !== notification.id))}
        />
      ))}
    </>
  );
  
  return { showNotification, NotificationRenderer };
};