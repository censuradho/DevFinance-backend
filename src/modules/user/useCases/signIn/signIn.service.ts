import { User  } from '@prisma/client'

import { USER_REGISTRATION } from 'constants/errors'

import prisma from 'prisma'

import { compare } from 'utils/_bcrypt'
import { generateToken } from 'utils/_jwt'

type CreateRequest = Pick<User, 'email' | 'password'>

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

		const token = generateToken({ id: user.id })

		const { password, ...removePassUser } = user

		return {
			...removePassUser,
			token
		}
	}
}