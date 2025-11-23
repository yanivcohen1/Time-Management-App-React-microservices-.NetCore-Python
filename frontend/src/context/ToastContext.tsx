import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor, SnackbarOrigin } from '@mui/material';

type ToastVariant = 'dark' | 'success' | 'danger' | 'secondary';
type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
    position: ToastPosition;
    open: boolean;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant, position?: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToastWithTimeout = (message: string, variant: ToastVariant = 'dark', pos: ToastPosition = 'top-center') => {
        const id = Date.now().toString();
        const newToast: ToastItem = {
            id,
            message,
            variant,
            position: pos,
            open: true
        };

        setToasts(prev => [...prev, newToast]);
    };

    const handleClose = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const getSeverity = (variant: ToastVariant): AlertColor => {
        switch (variant) {
            case 'success': return 'success';
            case 'danger': return 'error';
            case 'secondary': return 'info';
            case 'dark': return 'info'; // Default to info for dark
            default: return 'info';
        }
    };

    const getAnchorOrigin = (position: ToastPosition): SnackbarOrigin => {
        const [vertical, horizontal] = position.split('-') as [SnackbarOrigin['vertical'], SnackbarOrigin['horizontal']];
        return { vertical, horizontal };
    };

    return (
        <ToastContext.Provider value={{ showToast: showToastWithTimeout }}>
            {children}
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={toast.open}
                    autoHideDuration={3000}
                    onClose={() => handleClose(toast.id)}
                    anchorOrigin={getAnchorOrigin(toast.position)}
                >
                    <Alert onClose={() => handleClose(toast.id)} severity={getSeverity(toast.variant)} sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
};