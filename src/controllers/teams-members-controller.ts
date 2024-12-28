import { z } from 'zod'
import { Request, Response } from 'express'

import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'

class TeamsMembersController {
  async addUser(request: Request, response: Response) {
    const bodySchema = z.object({
      teamId: z.number(),
      teamMemberId: z.number(),
    })

    const { teamId, teamMemberId } = bodySchema.parse(request.body)

    const team = await prisma.teams.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      throw new AppError("Team not found")
    }

    const user = await prisma.users.findUnique({
      where: { id: teamMemberId },
    })

    if (!user) {
      throw new AppError("User not found")
    }

    const userInTeam = await prisma.teamsMembers.findFirst({
      where: {
        teamId,
        userId: teamMemberId,
      },
    })

    if (userInTeam) {
      throw new AppError("User is already in the team")
    }

    await prisma.teamsMembers.create({
      data: {
        teamId,
        userId: teamMemberId,
      },
    })

    return response.status(201).json({ message: "User added successfully to the team" })
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    });

    const { id } = paramsSchema.parse(request.params);

    const parsedId = Number(id);

    await prisma.teamsMembers.delete({
      where: {
        id: parsedId,
      },
    });

    return response.json();
  }
}

export { TeamsMembersController }
