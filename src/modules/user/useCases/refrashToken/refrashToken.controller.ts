import { NextFunction, Request, Response } from 'express'

import { REFRASH_TOKEN_COOKIE_KEY } from 'constants/auth'

import logger from 'utils/logger'

import { RefrashTokenService } from './refrashToken.service'

export class RefrashTokenController {
	constructor (private readonly service: RefrashTokenService) {}
  
	async execute (request: Request, response: Response, next: NextFunction) {
		try {
			const refrash_token_cookie = request.cookies

			const result = await this.service.execute(refrash_token_cookie[REFRASH_TOKEN_COOKIE_KEY])
			
			result.refrash_token && response.cookie(REFRASH_TOKEN_COOKIE_KEY, result.refrash_token?.id, {
				secure: process.env.NODE_ENV !== 'development',
				httpOnly: true,
				expires: new Date(result.refrash_token.expires_in),
			})

			return response.json(result)
		} catch (err) {

			logger.error(err)
			next(err)
		}
	}
}