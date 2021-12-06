import { User  } from '@prisma/client'

import { USER_REGISTRATION } from 'constants/errors'

import prisma from 'prisma'

import { compare } from 'utils/_bcrypt'
import { generateToken } from 'utils/_jwt'

type CreateRequest = Pick<User, 'email' | 'password'>

export interface SignJWTPayload {
id: string;
account_id: string
}


export class SignInService {
	async create ({ email, password: _password }: CreateRequest) {
		const user = await prisma.user.findFirst({
			where: {
				email
			},
			include: {
				profile: true,
				account: {
					select: {
						id: true,
					}
				}
			}
		})

		if (!user) throw new Error(USER_REGISTRATION.EMAIL_OR_PASSWORD_ARE_INCORRECT)

		const isEqualPassword = await compare(_password, user.password)

		if (!isEqualPassword) throw new Error(USER_REGISTRATION.EMAIL_OR_PASSWORD_ARE_INCORRECT)

		const payload: SignJWTPayload = {
			id: user.id,
			account_id: String(user.account?.id)
		}

		const token = generateToken(payload, {
			expiresIn: '1m'
		})

		const { password, ...removePassUser } = user

		return {
			...removePassUser,
			token
		}
	}
}