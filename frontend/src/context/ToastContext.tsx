import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import type { ToastPosition } from 'react-bootstrap/ToastContainer';

type ToastVariant = 'dark' | 'success' | 'danger' | 'secondary';

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
    position: ToastPosition;
    autohide: boolean;
    timeoutRef: NodeJS.Timeout | null;
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
            autohide: true,
            timeoutRef: setTimeout(() => {
                removeToast(id);
            }, 3000)
        };

        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleToastMouseEnter = (id: string) => {
        setToasts(prev => prev.map(toast => {
            if (toast.id === id) {
                if (toast.timeoutRef) {
                    clearTimeout(toast.timeoutRef);
                }
                return { ...toast, autohide: false, timeoutRef: null };
            }
            return toast;
        }));
    };

    const handleToastMouseLeave = (id: string) => {
        setToasts(prev => prev.map(toast => {
            if (toast.id === id) {
                const timeoutRef = setTimeout(() => {
                    removeToast(id);
                }, 3000);
                return { ...toast, autohide: true, timeoutRef };
            }
            return toast;
        }));
    };

    const toastContainerStyle = (position: ToastPosition): React.CSSProperties => ({
        zIndex: 1500,
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        ...(position.includes('bottom') ? { bottom: '1rem' } : { top: '1rem' })
    });

    // Group toasts by position
    const toastsByPosition = toasts.reduce((acc, toast) => {
        if (!acc[toast.position]) {
            acc[toast.position] = [];
        }
        acc[toast.position].push(toast);
        return acc;
    }, {} as Record<ToastPosition, ToastItem[]>);

    return (
        <ToastContext.Provider value={{ showToast: showToastWithTimeout }}>
            {children}
            {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
                <ToastContainer
                    key={position}
                    className="p-3"
                    position={position as ToastPosition}
                    style={toastContainerStyle(position as ToastPosition)}
                >
                    {positionToasts.map(toast => (
                        <Toast
                            key={toast.id}
                            show={true}
                            onClose={() => removeToast(toast.id)}
                            bg={toast.variant}
                            autohide={toast.autohide}
                            onMouseEnter={() => handleToastMouseEnter(toast.id)}
                            onMouseLeave={() => handleToastMouseLeave(toast.id)}
                        >
                            <Toast.Header>
                                <strong className="me-auto">System Message</strong>
                                <small></small>
                            </Toast.Header>
                            <Toast.Body className="text-white d-flex justify-content-between align-items-center gap-3">
                                <span>{toast.message}</span>
                            </Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>
            ))}
        </ToastContext.Provider>
    );
};