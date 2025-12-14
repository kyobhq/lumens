import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidVerificationCodeException extends Exception {
  static status = 400
  static code = 'E_INVALID_VERIFICATION_CODE'
  static message = 'The verification code is invalid or has expired.'
}
