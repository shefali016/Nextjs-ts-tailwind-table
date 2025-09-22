import * as React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string | React.ReactNode;
    children: React.ReactNode;
};

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white rounded-lg overflow-hidden shadow-lg z-10">
                <div className="px-4 py-2 border-b">
                    <h2 className="font-semibold">{title}</h2>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}