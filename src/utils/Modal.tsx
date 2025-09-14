import React, { PropsWithChildren } from 'react';

// Define the interface for your specific props
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Combine your props with the `PropsWithChildren` utility type
const MyModal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                {children} {/* This is where the projected content is rendered */}
            </div>
        </div>
    );
};

export default MyModal;
