import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY

export const gemini = apiKey ? new GoogleGenAI({ apiKey }) : null

export const AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"
