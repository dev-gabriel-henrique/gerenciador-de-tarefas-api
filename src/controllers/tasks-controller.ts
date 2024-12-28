import { z } from 'zod'
import { Request, Response } from 'express'

import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().min(2).max(200),
      description: z.string().min(2),
      status: z.enum(['pending', 'inProgress', 'completed']),
      priority: z.enum(['high', 'medium', 'low']),
      assigned_to: z.number(),
      team_id: z.number(),
    })

    const { assigned_to, team_id, ...taskData } = bodySchema.parse(request.body)

    const user = await prisma.users.findUnique({
      where: {id: assigned_to},
    })

    if(!user) {
      throw new AppError("User not found")
    }

    const team = await prisma.teams.findUnique({
      where: { id: team_id }
    })

    if(!team) {
      throw new AppError("Team not found")
    }

    const userOnTeam = await prisma.teamsMembers.findFirst({
      where: { teamId: team_id, userId: assigned_to }
    })

    if(!userOnTeam) {
      throw new AppError(`User with ID ${assigned_to} not found in team with ID ${team_id}`);
    }

    await prisma.tasks.create({
      data: {
        teamId: team_id,
        assignedTo: assigned_to,
        ...taskData
      }
    })

    return response.status(201).json();
  }
  async index(request: Request, response: Response) {
    const tasks = await prisma.tasks.findMany()

    return response.json(tasks)
  }
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    });

    const bodySchema = z.object({
      title: z.string().min(2).max(200),
      description: z.string().min(2),
      status: z.enum(['pending', 'inProgress', 'completed']),
      priority: z.enum(['high', 'medium', 'low']),
      assigned_to: z.number(),
      team_id: z.number(),
    })

    const { id } = paramsSchema.parse(request.params);

    const parsedId = Number(id);

    const { assigned_to, team_id, ...taskData } = bodySchema.parse(request.body)

    const user = await prisma.users.findUnique({
      where: {id: assigned_to},
    })

    if(!user) {
      throw new AppError("User not found")
    }

    const team = await prisma.teams.findUnique({
      where: { id: team_id }
    })

    if(!team) {
      throw new AppError("Team not found")
    }

    const userOnTeam = await prisma.teamsMembers.findFirst({
      where: { teamId: team_id, userId: assigned_to }
    })

    if(!userOnTeam) {
      throw new AppError(`User with ID ${assigned_to} not found in team with ID ${team_id}`);
    }

    await prisma.tasks.update({
      where: { id: parsedId },
      data: {
        teamId: team_id,
        assignedTo: assigned_to,
        ...taskData
      }
    })

    return response.json();
  }
  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    })

    const { id } = paramsSchema.parse(request.params);

    const parsedId = Number(id);

    await prisma.tasks.delete({
      where: { id: parsedId },
    });

    return response.json()
  }
}

export { TasksController }