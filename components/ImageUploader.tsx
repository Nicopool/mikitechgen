import React, { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
    currentImage: string;
    onImageUpdate: (imageUrl: string) => Promise<void>;
    itemName: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpdate, itemName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleSave = async () => {
        if (!newImageUrl.trim()) return;

        try {
            setLoading(true);
            await onImageUpdate(newImageUrl);
            setIsEditing(false);
            setNewImageUrl('');
            setPreviewUrl('');
        } catch (error) {
            console.error('Error updating image:', error);
            alert('Error al actualizar la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        setPreviewUrl(newImageUrl);
    };

    return (
        <div className="space-y-4">
            {/* Current Image Display */}
            <div className="relative group">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                        src={currentImage}
                        alt={itemName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x400/1a1a1a/white?text=${encodeURIComponent(itemName)}`;
                        }}
                    />
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-black"
                    >
                        <Upload size={14} />
                        Cambiar Imagen
                    </button>
                )}
            </div>

            {/* Edit Mode */}
            {isEditing && (
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Image size={18} className="text-gray-400" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Actualizar Imagen</h4>
                        </div>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewImageUrl('');
                                setPreviewUrl('');
                            }}
                            className="text-gray-400 hover:text-black transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                                URL de la Imagen
                            </label>
                            <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-black focus:outline-none"
                            />
                        </div>

                        {previewUrl && (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/600x400/ff3b30/white?text=Error+al+cargar`;
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handlePreview}
                                disabled={!newImageUrl.trim()}
                                className="flex-1 px-4 py-3 bg-gray-200 text-black text-xs font-bold rounded-lg hover:bg-gray-300 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Vista Previa
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!newImageUrl.trim() || loading}
                                className="flex-1 px-4 py-3 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                        💡 Puedes usar cualquier URL de imagen pública. Recomendamos usar servicios como Imgur, Cloudinary o subir a tu propio servidor.
                    </p>
                </div>
            )}
        </div>
    );
};
