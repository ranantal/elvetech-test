import { createContext, useContext, useState, type ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

interface NotificationsContextValue {
  notifyError: (message: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

export interface NotificationsProviderProps {
  children: ReactNode;
}

// Renders a single page-level Snackbar/Alert — components call
// `useNotifyError` instead of managing their own toast state, so multiple
// failures don't stack multiple Snackbars on screen. A new error replaces
// whatever message is currently showing rather than queuing behind it.
export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const [message, setMessage] = useState<string | null>(null);

  const notifyError = (nextMessage: string) => setMessage(nextMessage);
  const handleClose = () => setMessage(null);

  return (
    <NotificationsContext.Provider value={{ notifyError }}>
      {children}
      <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  );
}

export function useNotifyError(): (message: string) => void {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifyError must be used within a NotificationsProvider');
  }

  return context.notifyError;
}
