import fs from 'fs'
import Jimp from 'jimp/es';
import db from '@/database'
import responses from '@/utils/responses'
import { parseQuery } from '@/utils/helpers'

const userController = {
	async GET (req, res) {
        const uuid = req.params.uuid.replace(/-/g, '')

		if (!uuid) {
            try {
                const registers = db.getData('/players')
                responses.OK (res, Object.values(registers))
                return
            } catch (e) {
                responses.OK (res, {})
                return
            }
        }

        try {
            const model = db.getData(`/players/${uuid}`)
            responses.OK (res, model)
            return
        } catch (e) {
            responses.NOT_FOUND (res, {
                uuid,
                message: 'User with providen ID not found',
            })
            return
        }
	},

	async POST (req, res) {
        const { uuid, username } = req.body
        const trimmedUUID = uuid.replace(/-/g, '')

        const { destination, filename } = req.file
        const skinPath = `${destination}${trimmedUUID}.png`

        await fs.renameSync(`${destination}${filename}`, skinPath)

        const playerData = {
            username,
            trimmedUUID,
            fullUUID: uuid,
            skin: `${req.app.locals.skinsPath}/${trimmedUUID}.png`,
        }

        db.push(`/players/${trimmedUUID}`, playerData)
        responses.CREATED (res, playerData)
        return
    },

    async AVATAR (req, res) {
        const uuid = req.params.uuid.replace(/-/g, '')
        const [ path, query ] = req.originalUrl.split('?')
        const hasOverlay = !!parseQuery(query).overlay

        try {
            const model = db.getData(`/players/${uuid}`)
            const skinPath = `${__dirname}/../../skins/${model.trimmedUUID}.png`

            const skin = await Jimp.read(skinPath)
            const overlay = skin.clone()
            skin.crop(8, 8, 8, 8)

            if (hasOverlay) {
                overlay.crop(40, 8, 8, 8)
                skin.composite(overlay, 0, 0)
            }

            skin.resize(160, 160, Jimp.RESIZE_NEAREST_NEIGHBOR)

            const encodedSkin = await skin.getBase64Async(Jimp.MIME_PNG)
            responses.IMAGE(res, encodedSkin)
        } catch (e) {
            console.log(e)
            const realAvatar = `https://crafatar.com/avatars/${uuid}${hasOverlay ? '?overlay' : ''}`
            responses.REDIRECT (res, realAvatar)
            return
        }
    }
};

export default userController