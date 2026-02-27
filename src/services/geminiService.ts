import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "../store/useStore";

export async function analyzeResume(fileBase64: string, mimeType: string): Promise<ResumeAnalysis> {
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

export async function generateRoundFeedback(roundType: string, performanceData: any): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `Analyze the student's performance in the ${roundType} round.
            Performance Data: ${JSON.stringify(performanceData)}
            
            Generate a structured response with two clear sections in Markdown:
            1. "## What You Did": A summary of their mistakes, areas for improvement, or specific observations.
            2. "## What Is Expected": A breakdown of the ideal industry-standard answer, logic, or behavior for this round.
            
            Be constructive, professional, and detailed.`,
          },
        ],
      },
    ],
  });

  return response.text || "Failed to generate feedback.";
}

export async function generateHRQuestion(skills: string[], previousTranscripts: any[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = previousTranscripts.length === 0 
    ? `Generate a professional behavioral interview question based on these skills: ${skills.join(', ')}. The question should be challenging and specific.`
    : `Based on the interview history: ${JSON.stringify(previousTranscripts)}, generate the next follow-up behavioral question. Keep it conversational but professional.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "You are an expert HR interviewer. You ask behavioral questions to evaluate candidates based on their skills and experience."
    }
  });

  return response.text || "Could you tell me about a challenging project you worked on?";
}

export async function processHRAudio(audioBase64: string, mimeType: string, question: string): Promise<{ transcript: string; evaluation: string; sentiment: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: audioBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `The candidate was asked: "${question}". 
            1. Transcribe their response accurately.
            2. Evaluate their answer based on clarity, relevance, and depth.
            3. Analyze the tone for confidence vs hesitation.
            
            Return a JSON object with:
            - transcript: (string)
            - evaluation: (string)
            - sentiment: (string, e.g., "Confident", "Hesitant", "Neutral")`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcript: { type: Type.STRING },
          evaluation: { type: Type.STRING },
          sentiment: { type: Type.STRING },
        },
        required: ["transcript", "evaluation", "sentiment"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
}
