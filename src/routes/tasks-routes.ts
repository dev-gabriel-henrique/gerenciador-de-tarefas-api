import { Router } from "express";

import { TasksController } from "@/controllers/tasks-controller";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/", tasksController.create);
tasksRoutes.get("/", tasksController.index);
tasksRoutes.put("/:id", tasksController.update);
tasksRoutes.delete("/:id", tasksController.remove);

export { tasksRoutes }