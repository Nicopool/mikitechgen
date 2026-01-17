import React, { useState, useEffect } from 'react';
import { X, Tag, Hash } from 'lucide-react';
import { Category } from '../types';

interface EditCategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onSave: (categoryId: string, data: { name: string; slug: string }) => Promise<void>;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    category,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.label || '',
                slug: category.label?.toLowerCase().replace(/\s+/g, '-') || ''
            });
        }
    }, [category]);

    if (!category) return null;

    const handleNameChange = (name: string) => {
        setFormData({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(category.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving category:', error);
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
                className="bg-white rounded-[48px] max-w-xl w-full p-12"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Editar Categoría</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
                            ID: {category.id}
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
                            Nombre de la Categoría
                        </label>
                        <div className="relative">
                            <Tag size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                placeholder="PC Gamer"
                                required
                            />
                        </div>
                    </div>

                    {/* Slug (auto-generated) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Slug (URL amigable)
                        </label>
                        <div className="relative">
                            <Hash size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all bg-gray-50"
                                placeholder="pc-gamer"
                                required
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold ml-1">
                            Se genera automáticamente desde el nombre
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            Vista Previa
                        </p>
                        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                                <Tag size={20} />
                            </div>
                            <div>
                                <p className="font-black uppercase text-sm">{formData.name || 'Nombre de categoría'}</p>
                                <p className="text-[10px] text-gray-400 font-bold">/{formData.slug || 'slug'}</p>
                            </div>
                        </div>
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
