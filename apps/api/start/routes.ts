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
const LumensController = () => import('#modules/lumens/controllers/lumens_controller')
const ArtifactsController = () => import('#modules/artifacts/controllers/artifacts_controller')

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

    router
      .group(() => {
        router.get('/', [LumensController, 'getLumen'])
        router.post('/create', [LumensController, 'createLumen'])
      })
      .prefix('/lumens')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/create', [ArtifactsController, 'createArtifact'])
      })
      .prefix('/artifacts')
      .use(middleware.auth())
  })
  .prefix('/v1')
