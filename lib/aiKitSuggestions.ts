// AI Kit Suggestions Service
// Uses Gemini API for intelligent kit creation assistance

import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const getApiKey = () => {
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || 'PLACEHOLDER_API_KEY';
};

interface KitSuggestion {
    name: string;
    description: string;
    recommendedProducts?: string[];
    suggestedPrice?: number;
    targetAudience?: string;
}

/**
 * Generate AI suggestions for kit name and description based on selected products
 */
export const generateKitSuggestions = async (
    products: Product[],
    kitType?: string
): Promise<KitSuggestion> => {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        // Fallback suggestions when API is not configured
        return generateFallbackSuggestion(products, kitType);
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const productList = products.map(p => `- ${p.name} ($${p.price})`).join('\n');

        const prompt = `Eres un experto en tecnología y gaming. Basándote en estos productos:

${productList}

Genera una sugerencia para un kit ${kitType || 'de tecnología'} que incluya:
1. Un nombre atractivo y profesional para el kit (máximo 5 palabras)
2. Una descripción comercial convincente (máximo 100 palabras)
3. A quién está dirigido este kit

Responde SOLO en este formato JSON:
{
  "name": "nombre del kit",
  "description": "descripción del kit",
  "targetAudience": "audiencia objetivo"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        });

        const text = response.text || '';

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                name: parsed.name || '',
                description: parsed.description || '',
                targetAudience: parsed.targetAudience || ''
            };
        }

        return generateFallbackSuggestion(products, kitType);
    } catch (error) {
        console.error('Error generating AI suggestions:', error);
        return generateFallbackSuggestion(products, kitType);
    }
};

/**
 * Generate description improvement suggestions
 */
export const improveDescription = async (
    currentDescription: string,
    products: Product[]
): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        return currentDescription;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const productNames = products.map(p => p.name).join(', ');

        const prompt = `Mejora esta descripción de kit de productos tecnológicos. Hazla más atractiva y profesional, manteniéndola en español y en máximo 100 palabras.

Descripción actual: "${currentDescription}"
Productos incluidos: ${productNames}

Responde SOLO con la descripción mejorada, sin explicaciones adicionales.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.6,
                maxOutputTokens: 200
            }
        });

        return response.text?.trim() || currentDescription;
    } catch (error) {
        console.error('Error improving description:', error);
        return currentDescription;
    }
};

/**
 * Suggest a competitive price for the kit based on products
 */
export const suggestKitPrice = async (
    products: Product[],
    originalPrice: number
): Promise<{ suggestedPrice: number; reasoning: string }> => {
    const apiKey = getApiKey();

    // Default suggestion: 10-15% discount
    const defaultDiscount = 0.12;
    const defaultPrice = Math.round(originalPrice * (1 - defaultDiscount));

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        return {
            suggestedPrice: defaultPrice,
            reasoning: `Descuento del ${Math.round(defaultDiscount * 100)}% sobre el precio original`
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const productList = products.map(p => `${p.name}: $${p.price}`).join(', ');

        const prompt = `Como experto en ventas de tecnología, sugiere un precio competitivo para un kit que contiene estos productos: ${productList}

Precio total individual: $${originalPrice}

Responde SOLO en este formato JSON:
{
  "suggestedPrice": número,
  "discountPercent": número,
  "reasoning": "breve explicación"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.5,
                maxOutputTokens: 150
            }
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                suggestedPrice: parsed.suggestedPrice || defaultPrice,
                reasoning: parsed.reasoning || ''
            };
        }

        return { suggestedPrice: defaultPrice, reasoning: '' };
    } catch (error) {
        console.error('Error suggesting price:', error);
        return { suggestedPrice: defaultPrice, reasoning: '' };
    }
};

/**
 * Fallback suggestion generator when API is not available
 */
function generateFallbackSuggestion(products: Product[], kitType?: string): KitSuggestion {
    const categories = [...new Set(products.map(p => p.category))];
    const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);

    // Generate name based on categories
    let name = 'Kit ';
    if (categories.includes('Gaming') || categories.includes('Periféricos')) {
        name += 'Gaming ';
    } else if (categories.includes('Audio') || categories.includes('Streaming')) {
        name += 'Streaming ';
    } else if (categories.includes('Componentes')) {
        name += 'Workstation ';
    }
    name += products.length > 3 ? 'Profesional' : 'Starter';

    // Generate description
    const productNames = products.slice(0, 3).map(p => p.name).join(', ');
    const description = `Kit completo que incluye ${productNames}${products.length > 3 ? ' y más' : ''}. Configuración optimizada para máximo rendimiento. Todo lo que necesitas en un solo paquete con garantía extendida.`;

    return {
        name,
        description,
        suggestedPrice: Math.round(totalPrice * 0.88),
        targetAudience: kitType === 'gaming' ? 'Gamers y entusiastas' : 'Profesionales y creativos'
    };
}

// =====================================================
// PRODUCT AI SUGGESTIONS
// =====================================================

interface ProductSuggestion {
    name: string;
    description: string;
    sku: string;
    suggestedPrice?: number;
    category?: string;
}

/**
 * Generate AI suggestions for a new product based on partial info
 */
export const generateProductSuggestion = async (
    partialName: string,
    category: string
): Promise<ProductSuggestion> => {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        return generateFallbackProductSuggestion(partialName, category);
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Eres un experto en productos tecnológicos y gaming. Basándote en esta información parcial:

Nombre parcial: "${partialName || 'producto tecnológico'}"
Categoría: "${category}"

Genera una sugerencia completa para un producto de tecnología que incluya:
1. Un nombre comercial atractivo y profesional
2. Una descripción técnica convincente (máximo 80 palabras)
3. Un código SKU sugerido (formato: 3 letras mayúsculas - 3 números)
4. Un precio sugerido en USD

Responde SOLO en este formato JSON:
{
  "name": "nombre del producto",
  "description": "descripción técnica del producto",
  "sku": "ABC-123",
  "suggestedPrice": número
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.7,
                maxOutputTokens: 400
            }
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                name: parsed.name || partialName,
                description: parsed.description || '',
                sku: parsed.sku || generateSKU(category),
                suggestedPrice: parsed.suggestedPrice,
                category
            };
        }

        return generateFallbackProductSuggestion(partialName, category);
    } catch (error) {
        console.error('Error generating product suggestions:', error);
        return generateFallbackProductSuggestion(partialName, category);
    }
};

/**
 * Improve product description with AI
 */
export const improveProductDescription = async (
    currentDescription: string,
    productName: string,
    category: string
): Promise<string> => {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        return currentDescription;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Mejora esta descripción de producto tecnológico. Hazla más técnica, atractiva y profesional. Mantén máximo 80 palabras en español.

Producto: "${productName}"
Categoría: "${category}"
Descripción actual: "${currentDescription}"

Responde SOLO con la descripción mejorada, sin explicaciones adicionales.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                temperature: 0.6,
                maxOutputTokens: 150
            }
        });

        return response.text?.trim() || currentDescription;
    } catch (error) {
        console.error('Error improving product description:', error);
        return currentDescription;
    }
};

/**
 * Generate SKU based on category
 */
function generateSKU(category: string): string {
    const prefixes: { [key: string]: string } = {
        'Componentes': 'CMP',
        'Periféricos': 'PRF',
        'Audio': 'AUD',
        'Monitores': 'MON',
        'Almacenamiento': 'ALM',
        'Networking': 'NET',
        'Gaming': 'GAM'
    };
    const prefix = prefixes[category] || 'PRD';
    const number = Math.floor(Math.random() * 900) + 100;
    return `${prefix}-${number}`;
}

/**
 * Fallback product suggestion generator
 */
function generateFallbackProductSuggestion(partialName: string, category: string): ProductSuggestion {
    const categoryDescriptions: { [key: string]: string } = {
        'Componentes': 'Componente de alto rendimiento diseñado para entusiastas del PC gaming. Fabricación premium con materiales de primera calidad. Garantía extendida incluida.',
        'Periféricos': 'Periférico gaming profesional con tecnología avanzada. Respuesta ultrarrápida y diseño ergonómico para sesiones prolongadas.',
        'Audio': 'Sistema de audio inmersivo con calidad de estudio. Drivers de alta fidelidad y cancelación de ruido activa.',
        'Monitores': 'Monitor gaming con panel de última generación. Alta tasa de refresco y tiempos de respuesta mínimos.',
        'Almacenamiento': 'Solución de almacenamiento de alta velocidad. Lectura/escritura ultrarrápida para cargas instantáneas.',
        'Networking': 'Equipo de red de alto rendimiento. Baja latencia y conexión estable para gaming competitivo.'
    };

    return {
        name: partialName || `${category} Pro Gaming`,
        description: categoryDescriptions[category] || 'Producto tecnológico de alta calidad con garantía incluida.',
        sku: generateSKU(category),
        suggestedPrice: Math.floor(Math.random() * 200) + 50,
        category
    };
}
