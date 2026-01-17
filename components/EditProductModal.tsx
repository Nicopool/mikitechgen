import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Hash, FileText, Image as ImageIcon, Tag } from 'lucide-react';
import { Product } from '../types';

interface EditProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSave: (productId: string, data: Partial<Product>) => Promise<void>;
    categories: { id: string; label: string }[];
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
    product,
    onClose,
    onSave,
    categories
}) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        category: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                sku: product.sku || '',
                price: product.price || 0,
                stock: product.stock || 0,
                description: product.description || '',
                image: product.image || '',
                category: product.category || '',
                status: product.status || 'ACTIVE'
            });
        }
    }, [product]);

    if (!product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(product.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
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
                className="bg-white rounded-[48px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Editar Producto</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
                            SKU: {product.sku}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Nombre del Producto
                            </label>
                            <div className="relative">
                                <Package size={18} className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                    placeholder="Mouse Gamer RGB"
                                    required
                                />
                            </div>
                        </div>

                        {/* SKU */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                SKU
                            </label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                    placeholder="MGR-001"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Precio
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                    placeholder="49.99"
                                    required
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Stock
                            </label>
                            <div className="relative">
                                <Package size={18} className="absolute left-4 top-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                    placeholder="100"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Categoría
                            </label>
                            <div className="relative">
                                <Tag size={18} className="absolute left-4 top-4 text-gray-400" />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.label}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                Estado
                            </label>
                            <div className="relative">
                                <Package size={18} className="absolute left-4 top-4 text-gray-400" />
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all appearance-none bg-white cursor-pointer"
                                >
                                    <option value="ACTIVE">✅ Activo</option>
                                    <option value="INACTIVE">❌ Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Descripción
                        </label>
                        <div className="relative">
                            <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all resize-none"
                                placeholder="Descripción detallada del producto..."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            URL de Imagen
                        </label>
                        <div className="relative">
                            <ImageIcon size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-black outline-none transition-all"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Vista Previa</p>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                                    }}
                                />
                            </div>
                        )}
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
