export const TOPICS = [
  'programming',
  'marketing',
  'seo',
  'technology',
  'science',
  'translation',
  'legal',
  'finance',
  'health',
  'trivia',
  'academia',
] as const

export type Topic = (typeof TOPICS)[number]

export const DIFFICULTIES = ['easy', 'medium', 'hard', 'very_hard'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export interface QueryAnalysis {
  topic: Topic
  difficulty: Difficulty
}

export interface ChatResponse {
  content: string
}

export interface LumenChatResponse {
  id: string
  content: string
  createdAt: string
}
