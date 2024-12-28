import { z } from "zod";
import { hash } from "bcrypt";
import { Request, Response } from "express";

import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { UserRole } from "@prisma/client";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.users.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists!");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
  async update(request: Request, response: Response) {
    const userAdmin = request.user;
    const isAdmin = userAdmin?.role === UserRole.admin;

    const paramsSchema = z.object({
      id: z.string().refine((val) => !isNaN(Number(val)), {
        message: "ID must be a number",
      }),
    });

    const bodySchema = z.object({
      name: z.string().trim().min(2).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      role: z.enum(["admin", "member"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);

    const parsedId = Number(id);

    const userToUpdate = await prisma.users.findUnique({
      where: { id: parsedId },
    });

    if (!userToUpdate) {
      throw new AppError("User not found", 404);
    }

    if (!isAdmin && Number(userAdmin?.id) !== userToUpdate.id) {
      throw new AppError("You are not authorized to perform this action!", 403);
    }

    const { name, email, password, role } = bodySchema.parse(request.body);

    if (!isAdmin && role) {
      throw new AppError("Only admins can change user roles!", 403);
    }

    if (email && email !== userToUpdate.email) {
      const userWithSameEmail = await prisma.users.findFirst({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("User with same email already exists!");
      }
    }

    const hashedPassword = password ? await hash(password, 8) : undefined;

    const user = await prisma.users.update({
      data: {
        name: name || userToUpdate.name,
        email: email || userToUpdate.email,
        password: hashedPassword || userToUpdate.password,
        role: role || userToUpdate.role,
      },
      where: { id: parsedId },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json(userWithoutPassword);
  }
  async index(request: Request, response: Response) {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return response.json(users);
  }
}

export { UsersController };
