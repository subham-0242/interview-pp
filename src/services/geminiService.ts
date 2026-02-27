import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "../store/useStore";

export async function analyzeResume(fileBase64: string, mimeType: string): Promise<ResumeAnalysis> {
  // Create a new instance right before the call to ensure it uses the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this resume for ATS compatibility. Provide a detailed analysis in JSON format.",
          },
        ],
      },
    ],
    config: {
      systemInstruction: `You are an expert ATS (Applicant Tracking System) analyzer. 
      Analyze the provided resume and return a structured JSON object.
      The JSON must include:
      - atsScore: (number 0-100)
      - summary: (string, brief overview of the candidate)
      - topSkills: (array of strings)
      - missingKeywords: (array of strings, keywords commonly found in job descriptions for similar roles but missing here)
      - formattingScore: (number 0-100, based on readability and layout)
      - actionItems: (array of strings, specific steps to improve the resume)
      
      Return ONLY the JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          topSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          formattingScore: { type: Type.NUMBER },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["atsScore", "summary", "topSkills", "missingKeywords", "formattingScore", "actionItems"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid response format from AI");
  }
}
