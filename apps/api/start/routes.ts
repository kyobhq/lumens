/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsersController = () => import('#modules/users/controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/signup', [UsersController, 'createUser'])
    router.post('/signin', [UsersController, 'login'])
    router.post('/verify-email', [UsersController, 'sendVerificationCode'])

    router.post('/signout', [UsersController, 'logout']).use(middleware.auth())
    router.get('/check', [UsersController, 'check']).use(middleware.auth())
  })
  .prefix('/v1')
