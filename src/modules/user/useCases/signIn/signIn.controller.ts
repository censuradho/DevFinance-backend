import{ Request, Response } from 'express'

import logger from 'utils/logger'

import { REFRASH_TOKEN_COOKIE_KEY } from 'constants/auth'

import { SignInService } from './signIn.service'

export class SignInController {
	constructor (private readonly service: SignInService) {}

	async store (request: Request, response: Response) {
    

		try {
			const result = await this.service.create(request.body)

			const { refrash_token, ...rest } = result

			logger.info({
				user_id: result.id
			}, 'logged in user')

			response.cookie(REFRASH_TOKEN_COOKIE_KEY, refrash_token.id, {
				// secure: process.env.NODE_ENV !== 'development',
				// httpOnly: true,
				expires: new Date(refrash_token.expires_in),
			})

			
			return response.json(rest)
      
		} catch (error) {
			if (!(error instanceof Error)) {
				logger.error(error)
				return response.sendStatus(500)
			}

			return response.status(401).json({
				error: {
					message: error.message
				}
			})
		}
	}
}