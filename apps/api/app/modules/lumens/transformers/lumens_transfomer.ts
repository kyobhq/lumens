import Lumen from '../models/lumen.js'

export class LumensTransformer {
  static toJson(lumen: Lumen) {
    return {
      id: lumen.id,
      name: lumen.name,
      personality: lumen.personality,
      avatar: lumen.avatar,
    }
  }
}

export type LumenTransformer = ReturnType<typeof LumensTransformer.toJson>
