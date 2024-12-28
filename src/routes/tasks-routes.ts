import { Router } from "express";

import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthentication";
import { verifyUserAutorization } from "@/middlewares/verifyUserAutorization";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  tasksController.create
);
tasksRoutes.get("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin", "member"]),
  tasksController.index
);
tasksRoutes.put("/:id", 
  ensureAuthenticated,
  verifyUserAutorization(["admin", "member"]),
  tasksController.update
);
tasksRoutes.delete("/:id", 
  ensureAuthenticated,
  verifyUserAutorization(["admin", "member"]),
  tasksController.remove
);

export { tasksRoutes }