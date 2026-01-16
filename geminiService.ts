
import { GoogleGenAI, Type } from "@google/genai";
import { AISize } from "./types";

/**
 * Handle multi-turn conversation with Gemini, supporting search grounding and thinking capabilities.
 */
export const chatWithGemini = async (prompt: string, history: any[], options: any = {}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = options.useSearch ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  // Format history for the SDK
  const contents: any[] = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const currentParts: any[] = [];
  if (prompt) {
    currentParts.push({ text: prompt });
  }

  // Handle uploaded image attachments
  if (options.image) {
    currentParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: options.image.includes(',') ? options.image.split(',')[1] : options.image
      }
    });
  }

  contents.push({
    role: 'user',
    parts: currentParts
  });

  const config: any = {
    systemInstruction: "Eres el Asistente Experto de MIKITECH. Tu objetivo es ayudar a los usuarios con la elección, configuración y optimización de kits digitales para Gaming PC, Portátiles, Streaming y Sets Gaming. Responde siempre en español, con un tono profesional, técnico y futurista. Ayuda a resolver dudas sobre compatibilidad de hardware y configuraciones de software para gaming.",
  };

  // Enable Google Search grounding if requested
  if (options.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  // Enable thinking budget for complex technical reasoning
  if (options.useThinking) {
    config.thinkingConfig = { thinkingBudget: 16000 };
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: contents,
    config: config
  });

  // Extract grounding citations for transparency
  const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '#'
  })) || [];

  return {
    text: response.text || '',
    groundingLinks
  };
};

/**
 * Generate conceptual parts using gemini-2.5-flash-image.
 */
export const generatePartConcept = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A futuristic, high-tech industrial tech component or robotic part concept: ${prompt}. Cinematic lighting, engineering render style, black and metallic finish.` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * High-quality image generation using gemini-3-pro-image-preview.
 */
export const generateImage = async (prompt: string, size: AISize) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * Video generation for assembly animations using Veo models.
 */
export const generateVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Wait for the long-running video generation task to complete
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  // SDK requires appending the API key to the URI for direct media access
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
