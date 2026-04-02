import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Emergency } from '../types';

interface SocketContextType {
  socket: Socket | null;
  liveEmergencies: Emergency[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, liveEmergencies: [] });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveEmergencies, setLiveEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    // Always use port 5000 directly — no string manipulation needed
    const SOCKET_URL = 'http://localhost:5000';

    const s = io(SOCKET_URL, { reconnectionAttempts: 5 });

    s.on('connect', () => {
      console.log('✅ Socket connected:', s.id);
      setSocket(s);
    });

    s.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocket(null);
    });

    s.on('new_emergency', ({ emergency }: { emergency: Emergency }) => {
      setLiveEmergencies(prev => [emergency, ...prev]);
    });

    s.on('emergency_updated', (updated: Emergency) => {
      setLiveEmergencies(prev =>
        prev.map(e => (e.id === updated.id ? updated : e))
      );
    });

    return () => { s.disconnect(); };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, liveEmergencies }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);