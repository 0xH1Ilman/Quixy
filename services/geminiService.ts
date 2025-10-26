import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import type { ApiResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("La variable de entorno API_KEY no está configurada");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialResponse(prompt: string): Promise<ApiResponse> {
  try {
    const genAIResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{googleSearch: {}}],
        temperature: 0.1,
      },
    });

    let text = genAIResponse.text.trim();
    if (!text) {
        throw new Error("Se recibió una respuesta vacía de la API.");
    }
    
    // The model may return JSON in a markdown block, so we extract it.
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1];
    }
    
    const parsedJson: ApiResponse = JSON.parse(text);

    // Copy conversational_response to nested objects to match component expectations
    if (parsedJson.conversational_response) {
        if (parsedJson.portfolio_details) {
            parsedJson.portfolio_details.conversational_response = parsedJson.conversational_response;
        }
        if (parsedJson.market_summary) {
            parsedJson.market_summary.conversational_response = parsedJson.conversational_response;
        }
        if (parsedJson.screener_results) {
            parsedJson.screener_results.conversational_response = parsedJson.conversational_response;
        }
        if (parsedJson.economic_indicators) {
            parsedJson.economic_indicators.conversational_response = parsedJson.conversational_response;
        }
        if (parsedJson.sector_performance) {
            parsedJson.sector_performance.conversational_response = parsedJson.conversational_response;
        }
    }

    // Extract grounding metadata for sources
    const groundingMetadata = genAIResponse.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      const sources = groundingMetadata.groundingChunks
        // Ensure we only process chunks with web sources
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => chunk.web);

      if (sources.length > 0) {
        parsedJson.sources = sources;
      }
    }

    return parsedJson as ApiResponse;

  } catch (error) {
    console.error("Error al contactar la API de Gemini:", error);
    if (error instanceof SyntaxError) {
      return { response_type: 'general_text', conversational_response: "Recibí un formato de datos inesperado. Por favor, intenta tu solicitud de nuevo." };
    }
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return { response_type: 'general_text', conversational_response: `Lo siento, encontré un error: ${errorMessage}` };
  }
}
