import { Router } from "express";

import { TeamsMembersController } from "@/controllers/teams-members-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthentication";
import { verifyUserAutorization } from "@/middlewares/verifyUserAutorization";

const teamsMembersRoutes = Router();
const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.post("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  teamsMembersController.addUser
);
teamsMembersRoutes.delete("/:id",
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  teamsMembersController.remove
);

export { teamsMembersRoutes }