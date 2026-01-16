import React, { useState } from 'react';
import { Product, Kit } from '../types';
import { X, Plus, Minus, Check, ArrowRight, ArrowLeft, Package, DollarSign, Image as ImageIcon, FileText, Trash2, Search } from 'lucide-react';

interface KitBuilderProps {
    products: Product[];
    vendorId: string;
    onSave: (kit: Partial<Kit>) => Promise<void>;
    onCancel: () => void;
}

export const KitBuilder: React.FC<KitBuilderProps> = ({ products, vendorId, onSave, onCancel }) => {
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [kit, setKit] = useState<Partial<Kit>>({
        name: '',
        description: '',
        products: [],
        price: 0,
        status: 'ACTIVE',
        image: '',
        vendorId
    });

    // Cálculos
    const originalPrice = (kit.products || []).reduce((acc, kp) => {
        const p = products.find(x => x.id === kp.productId);
        return acc + (p?.price || 0) * kp.quantity;
    }, 0);

    const discount = originalPrice > 0 && kit.price ? ((originalPrice - kit.price) / originalPrice) * 100 : 0;
    const savings = originalPrice - (kit.price || 0);

    // Funciones
    const addProduct = (productId: string) => {
        const exists = kit.products?.find(p => p.productId === productId);
        if (exists) return;
        setKit({
            ...kit,
            products: [...(kit.products || []), { productId, quantity: 1 }]
        });
    };

    const updateQuantity = (productId: string, qty: number) => {
        setKit({
            ...kit,
            products: (kit.products || []).map(p =>
                p.productId === productId ? { ...p, quantity: Math.max(1, qty) } : p
            )
        });
    };

    const removeProduct = (productId: string) => {
        setKit({
            ...kit,
            products: (kit.products || []).filter(p => p.productId !== productId)
        });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canProceed = (currentStep: number) => {
        switch (currentStep) {
            case 1: return kit.name && kit.description;
            case 2: return (kit.products || []).length > 0;
            case 3: return kit.price && kit.price > 0;
            case 4: return kit.image;
            default: return false;
        }
    };

    const handleSave = async () => {
        await onSave({
            ...kit,
            originalPrice
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-8 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-display font-black uppercase tracking-tight">Crear Nuevo Kit</h2>
                        <p className="text-sm text-gray-500 mt-2">Paso {step} de 4</p>
                    </div>
                    <button onClick={onCancel} className="p-3 hover:bg-gray-100 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-6">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 transition-all ${s <= step ? 'bg-black' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest">
                        <span className={step >= 1 ? 'text-black' : 'text-gray-400'}>Información</span>
                        <span className={step >= 2 ? 'text-black' : 'text-gray-400'}>Productos</span>
                        <span className={step >= 3 ? 'text-black' : 'text-gray-400'}>Precio</span>
                        <span className={step >= 4 ? 'text-black' : 'text-gray-400'}>Imagen</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left: Form */}
                        <div>
                            {/* Step 1: Info */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center">
                                            <FileText size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Información Básica</h3>
                                            <p className="text-xs text-gray-500">Define el nombre y descripción del kit</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                            Nombre del Kit *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Kit Profesional de Streaming"
                                            className="w-full px-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                            value={kit.name}
                                            onChange={e => setKit({ ...kit, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                            Descripción *
                                        </label>
                                        <textarea
                                            placeholder="Describe qué incluye este kit y para quién es ideal..."
                                            className="w-full px-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium h-32 resize-none"
                                            value={kit.description}
                                            onChange={e => setKit({ ...kit, description: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-2">{kit.description?.length || 0}/500 caracteres</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Products */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center">
                                            <Package size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Seleccionar Productos</h3>
                                            <p className="text-xs text-gray-500">Elige los productos que incluirá el kit</p>
                                        </div>
                                    </div>

                                    {/* Search */}
                                    <div className="relative">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            className="w-full pl-12 pr-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Product List */}
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredProducts.map(product => {
                                            const isAdded = kit.products?.some(p => p.productId === product.id);
                                            return (
                                                <div
                                                    key={product.id}
                                                    className={`flex items-center gap-4 p-4 border transition-all cursor-pointer ${isAdded ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                    onClick={() => !isAdded && addProduct(product.id)}
                                                >
                                                    <div className="w-16 h-16 bg-gray-100 overflow-hidden shrink-0">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-black">${product.price.toFixed(2)}</p>
                                                        {isAdded && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Check size={16} className="text-black" />
                                                                <span className="text-xs font-bold">Agregado</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Pricing */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center">
                                            <DollarSign size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Definir Precio</h3>
                                            <p className="text-xs text-gray-500">Establece el precio final del kit</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Precio Original</span>
                                            <span className="text-2xl font-black">${originalPrice.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Suma de todos los productos individuales</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                            Precio del Kit *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full pl-12 pr-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-lg font-black"
                                                value={kit.price || ''}
                                                onChange={e => setKit({ ...kit, price: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    {kit.price && kit.price > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-green-50 border border-green-200">
                                                <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Descuento</p>
                                                <p className="text-2xl font-black text-green-700">{discount.toFixed(0)}%</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 border border-blue-200">
                                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Ahorro</p>
                                                <p className="text-2xl font-black text-blue-700">${savings.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-yellow-50 border border-yellow-200">
                                        <p className="text-xs font-bold text-yellow-800">💡 Recomendación</p>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            Un descuento entre 10-20% suele ser atractivo para los clientes sin sacrificar mucho margen.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Image */}
                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center">
                                            <ImageIcon size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">Imagen del Kit</h3>
                                            <p className="text-xs text-gray-500">Agrega una imagen representativa</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
                                            URL de la Imagen *
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            className="w-full px-6 py-4 border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium"
                                            value={kit.image}
                                            onChange={e => setKit({ ...kit, image: e.target.value })}
                                        />
                                    </div>

                                    {kit.image && (
                                        <div className="aspect-video bg-gray-100 border border-gray-200 overflow-hidden">
                                            <img
                                                src={kit.image}
                                                alt="Vista previa"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Imagen+no+disponible';
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="p-4 bg-gray-50 border border-gray-200">
                                        <p className="text-xs font-bold mb-2">Sugerencias de imágenes:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
                                                'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
                                                'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
                                                'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800'
                                            ].map((url, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setKit({ ...kit, image: url })}
                                                    className="aspect-video bg-gray-200 overflow-hidden border-2 border-transparent hover:border-black transition-all"
                                                >
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Preview */}
                        <div className="lg:sticky lg:top-0">
                            <div className="p-6 bg-gray-50 border border-gray-200">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-6">Vista Previa</h4>

                                {/* Kit Card Preview */}
                                <div className="bg-white border border-gray-200 overflow-hidden">
                                    <div className="aspect-[4/3] bg-gray-100">
                                        {kit.image ? (
                                            <img src={kit.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">
                                            {kit.name || 'Nombre del Kit'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {kit.description || 'Descripción del kit...'}
                                        </p>

                                        {/* Products in kit */}
                                        {(kit.products || []).length > 0 && (
                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                                                    Incluye {kit.products?.length} producto{kit.products?.length !== 1 ? 's' : ''}:
                                                </p>
                                                <div className="space-y-2">
                                                    {kit.products?.map(kp => {
                                                        const product = products.find(p => p.id === kp.productId);
                                                        return (
                                                            <div key={kp.productId} className="flex items-center gap-3 text-xs">
                                                                <div className="w-8 h-8 bg-gray-100 overflow-hidden shrink-0">
                                                                    <img src={product?.image} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <span className="flex-1 truncate font-medium">{product?.name}</span>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <button
                                                                        onClick={() => updateQuantity(kp.productId, kp.quantity - 1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                                                                    >
                                                                        <Minus size={12} />
                                                                    </button>
                                                                    <span className="font-bold w-6 text-center">{kp.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity(kp.productId, kp.quantity + 1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
                                                                    >
                                                                        <Plus size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeProduct(kp.productId)}
                                                                        className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {originalPrice > 0 && (
                                                    <p className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                                                )}
                                                <p className="text-3xl font-black">
                                                    ${kit.price?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                            {discount > 0 && (
                                                <div className="px-3 py-1 bg-[#ff3b30] text-white text-xs font-bold uppercase">
                                                    -{discount.toFixed(0)}%
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={() => step > 1 && setStep(step - 1)}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-sm font-bold uppercase tracking-widest hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={16} />
                        Anterior
                    </button>

                    <div className="flex items-center gap-4">
                        {step < 4 ? (
                            <button
                                onClick={() => canProceed(step) && setStep(step + 1)}
                                disabled={!canProceed(step)}
                                className="flex items-center gap-2 px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={!canProceed(step)}
                                className="flex items-center gap-2 px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={16} />
                                Crear Kit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
