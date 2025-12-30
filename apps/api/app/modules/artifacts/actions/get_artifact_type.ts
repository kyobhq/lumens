import Artifact from '../models/artifact.js'

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'avi']

export function getArtifactType(extname: string): Artifact['type'] {
  const ext = extname.toLowerCase().replace('.', '')

  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (VIDEO_EXTS.includes(ext)) return 'video'
  if (ext === 'pdf') return 'pdf'

  return 'unknown'
}

export function isOptimizableImage(extname: string): boolean {
  const ext = extname.toLowerCase().replace('.', '')
  const optimizableExts = ['jpg', 'jpeg', 'png']
  return optimizableExts.includes(ext)
}
