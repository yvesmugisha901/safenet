// context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Emergency } from '../types';

interface SocketContextType {
  socket: Socket | null;
  liveEmergencies: Emergency[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, liveEmergencies: [] });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [liveEmergencies, setLiveEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('new_emergency', ({ emergency }: { emergency: Emergency }) => {
      setLiveEmergencies(prev => [emergency, ...prev]);
    });

    socketRef.current.on('emergency_updated', (updated: Emergency) => {
      setLiveEmergencies(prev =>
        prev.map(e => (e.id === updated.id ? updated : e))
      );
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, liveEmergencies }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
