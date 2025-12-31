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

export const AVAILABLE_TOOLS = ['web_search'] as const

export type AvailableTool = (typeof AVAILABLE_TOOLS)[number]

export const VERBOSITIES = ['brief', 'expanded'] as const

export type Verbosity = (typeof VERBOSITIES)[number]

export interface QueryAnalysis {
  topic: Topic
  difficulty: Difficulty
  required_tools: AvailableTool[]
  verbosity: Verbosity
  model: string
}

export interface ChatResponse {
  content: string
}

export interface LumenChatResponse {
  id: string
  content: string
  createdAt: string
}
