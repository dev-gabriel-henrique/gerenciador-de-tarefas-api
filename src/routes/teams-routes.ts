import { Router } from "express";

import { TeamsController } from "@/controllers/teams-controller";

const teamRoutes = Router();
const teamsController = new TeamsController();

teamRoutes.post("/", teamsController.create);
teamRoutes.get("/", teamsController.index);
teamRoutes.put("/:id", teamsController.update);
teamRoutes.delete("/:id", teamsController.remove);

export { teamRoutes }