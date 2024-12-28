import { Router } from "express";

import { TeamsMembersController } from "@/controllers/teams-members-controller";

const teamsMembersRoutes = Router();
const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.post("/", teamsMembersController.addUser)
teamsMembersRoutes.delete("/:id", teamsMembersController.remove)

export { teamsMembersRoutes }