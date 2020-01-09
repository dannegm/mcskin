import multer from 'multer'
import playerController from './controller'

export default function playerRouter (app) {
    const upload = multer({ dest: 'src/skins/' })

    app
        .route ('/players')
        .get (playerController.GET)
        .post (upload.single('skin'), playerController.POST)

    app
        .route ('/players/:uuid?')
        .get (playerController.GET)
        // .put(playerController.PUT)
        // .patch(playerController.PATCH)
        // .delete(playerController.DELETE)

    app
        .route ('/avatars/:uuid\.png')
        .all (playerController.AVATAR)
}