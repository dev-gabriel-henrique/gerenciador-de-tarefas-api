import { Router } from "express";

import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthentication";
import { verifyUserAutorization } from "@/middlewares/verifyUserAutorization";

const teamRoutes = Router();
const teamsController = new TeamsController();

teamRoutes.post("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  teamsController.create
);
teamRoutes.get("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin", "member"]),
  teamsController.index
);
teamRoutes.put("/:id",
  ensureAuthenticated,
  verifyUserAutorization(["admin"]), 
  teamsController.update
);
teamRoutes.delete("/:id", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  teamsController.remove
);

export { teamRoutes }