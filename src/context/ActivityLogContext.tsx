'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ActionType = 'create' | 'update' | 'delete' | 'system';

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: Date;
  type: ActionType;
}

interface ActivityLogContextProps {
  logs: ActivityLog[];
  addLog: (message: string, type: ActionType) => void;
  clearLogs: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextProps | undefined>(undefined);

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const addLog = useCallback((message: string, type: ActionType) => {
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        message,
        timestamp: new Date(),
        type,
      },
      ...prev,
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <ActivityLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};
