import { randomUUID as uuid } from 'crypto'

import { Profile } from '@prisma/client'
import { PERFIL_ERRORS } from 'constants/errors'

import prisma from 'prisma'

import { USER_SELECT } from 'constants/select'

type CreateProfile = Pick<Profile, 'avatar_url' | 'user_id' | 'username'>

export class PerfilService {
	async create ({ avatar_url, user_id, username }: CreateProfile) {
		const perfilExist = await prisma.profile.findFirst({
			where: {
				user_id
			}
		})

		if (perfilExist) throw new Error(PERFIL_ERRORS.ALREADY_EXIST)

		return await prisma.profile.create({
			data: {
				username,
				avatar_url,
				id: uuid(),
				user: {
					connect: {
						id: user_id
					}
				}
			},
		})
	}

	async findByUserId (user_id: string) {
		return await prisma.profile.findFirst({
			where: {
				user_id
			}
		})
	}
}