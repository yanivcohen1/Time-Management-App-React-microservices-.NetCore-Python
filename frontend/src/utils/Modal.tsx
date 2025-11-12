import React from 'react';
import type { PropsWithChildren } from 'react';
import { useTheme } from '../hooks/useTheme';

// Define the interface for your specific props
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Combine your props with the `PropsWithChildren` utility type
const MyModal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, children }) => {
    const theme = useTheme();
    const isDarkTheme = theme === 'dark';

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${isDarkTheme ? 'modal-content-dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className={`modal-close-button ${isDarkTheme ? 'modal-close-button-dark' : ''}`} onClick={onClose}>
                    &times;
                </button>
                {children} {/* This is where the projected content is rendered */}
            </div>
        </div>
    );
};

export default MyModal;
