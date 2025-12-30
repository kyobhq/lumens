import app from '@adonisjs/core/services/app'
import drive from '@adonisjs/drive/services/main'
import { Exception } from '@adonisjs/core/exceptions'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import sharp from 'sharp'

const AVIF_QUALITY = 60

/**
 * Optimizes an uploaded image to AVIF format while preserving the original.
 *
 * - Optimized version: `{baseKey}.avif` (what we save in DB as the url)
 * - Original version: `{baseKey}_og.{ext}` (for download/copy)
 *
 * Skips optimization for formats that don't benefit from it (SVG, AVIF, WebP).
 */
export async function optimizeImage(file: MultipartFile, baseKey: string): Promise<string> {
  const ext = file.extname?.toLowerCase().replace('.', '') ?? ''

  const originalKey = `${baseKey}_og.${ext}`
  const optimizedKey = `${baseKey}.avif`

  try {
    await file.moveToDisk(originalKey)

    const originalPath = app.makePath('storage', originalKey)
    const optimizedPath = app.makePath('storage', optimizedKey)

    await sharp(originalPath).avif({ quality: AVIF_QUALITY }).toFile(optimizedPath)

    return `/uploads/${optimizedKey}`
  } catch {
    await drive
      .use()
      .delete(originalKey)
      .catch(() => {})
    await drive
      .use()
      .delete(optimizedKey)
      .catch(() => {})

    throw new Exception('Image upload failed, we were not able to optimize the image', {
      code: 'E_IMAGE_OPTIMIZATION_FAILED',
      status: 422,
    })
  }
}
