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

  // Load from session storage on mount
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem('creanote_admin_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLogs(parsed.map(log => ({ ...log, timestamp: new Date(log.timestamp) })));
        }
      }
    } catch (e) {
      console.error('Failed to load logs from session storage', e);
    }
  }, []);

  const addLog = useCallback((message: string, type: ActionType) => {
    setLogs((prev) => {
      const newLogs = [
        {
          id: crypto.randomUUID(),
          message,
          timestamp: new Date(),
          type,
        },
        ...prev,
      ].slice(0, 50); // Keep last 50 logs to prevent storage bloat
      
      try {
        sessionStorage.setItem('creanote_admin_logs', JSON.stringify(newLogs));
      } catch (e) {
        console.error('Failed to save logs', e);
      }
      
      return newLogs;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    try {
      sessionStorage.removeItem('creanote_admin_logs');
    } catch (e) {
      // ignore
    }
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
