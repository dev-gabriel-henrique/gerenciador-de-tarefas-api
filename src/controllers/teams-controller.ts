import { z } from "zod";
import { Request, Response } from "express";

import { prisma } from "@/database/prisma";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.status(201).json();
  }
  async index(request: Request, response: Response) {
    const teams = await prisma.teams.findMany({
      include: {
        TeamsMembers: {
          select: { users: { select: { name: true, role: true } } },
        },
      },
    });

    return response.json(teams);
  }
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(2),
      description: z.string().optional(),
    });

    const { id } = paramsSchema.parse(request.params);

    const { name, description } = bodySchema.parse(request.body);

    const parsedId = Number(id);

    await prisma.teams.update({
      data: {
        name,
        description,
      },
      where: {
        id: parsedId,
      },
    });

    return response.json();
  }
  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    });

    const { id } = paramsSchema.parse(request.params);

    const parsedId = Number(id);

    await prisma.teams.delete({
      where: {
        id: parsedId,
      },
    });

    return response.json();
  }
}

export { TeamsController };
