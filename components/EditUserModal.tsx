import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield } from 'lucide-react';
import { AppUser } from '../types';

interface EditUserModalProps {
    user: AppUser | null;
    onClose: () => void;
    onSave: (userId: string, data: Partial<AppUser>) => Promise<void>;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'USER' as 'USER' | 'VENDOR' | 'ADMIN'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'USER'
            });
        }
    }, [user]);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(user.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[48px] max-w-2xl w-full p-12"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Editar Usuario</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
                            ID: {user.id.slice(0, 8)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Nombre Completo
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Teléfono
                        </label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Rol del Usuario
                        </label>
                        <div className="relative">
                            <Shield size={18} className="absolute left-4 top-4 text-gray-400" />
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all appearance-none bg-white cursor-pointer"
                            >
                                <option value="USER">👤 Usuario Regular</option>
                                <option value="VENDOR">🏪 Proveedor</option>
                                <option value="ADMIN">👑 Administrador</option>
                            </select>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold ml-1 mt-2">
                            {formData.role === 'ADMIN' && '⚠️ Tendrá acceso completo al panel de administración'}
                            {formData.role === 'VENDOR' && '📦 Podrá gestionar productos y pedidos'}
                            {formData.role === 'USER' && '🛒 Solo podrá realizar compras'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 border-2 border-gray-100 text-gray-600 text-xs font-black uppercase rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-8 py-4 bg-black text-white text-xs font-black uppercase rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
