import { Exception } from '@adonisjs/core/exceptions'

export default class SingleArtifactTypeException extends Exception {
  static status = 400
  static code = 'E_SINGLE_ARTIFACT_TYPE'
  static message = 'Artifact can only be a note OR a file'
}
