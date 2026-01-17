
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    type?: "danger" | "success";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    type = "danger"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
            <div className="bg-white rounded-[32px] max-w-md w-full p-10" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${type === "danger" ? "bg-red-50" : "bg-green-50"
                        }`}>
                        {type === "danger" ? <AlertCircle size={32} className="text-red-500" /> : <CheckCircle2 size={32} className="text-green-500" />}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{title}</h3>
                    <p className="text-gray-600 font-bold mb-8">{message}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-gray-100 text-black font-black uppercase text-xs rounded-2xl hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-4 font-black uppercase text-xs rounded-2xl transition-all ${type === "danger"
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
