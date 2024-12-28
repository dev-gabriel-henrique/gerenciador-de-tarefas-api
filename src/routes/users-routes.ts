import { Router } from "express";

import { UsersController } from "@/controllers/users-controllers";
import { ensureAuthenticated } from "@/middlewares/ensureAuthentication";
import { verifyUserAutorization } from "@/middlewares/verifyUserAutorization";

const userRoutes = Router();
const usersController = new UsersController();

userRoutes.post("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  usersController.create
);
userRoutes.get("/", 
  ensureAuthenticated,
  verifyUserAutorization(["admin"]),
  usersController.index
);
userRoutes.put("/:id", 
  ensureAuthenticated,
  verifyUserAutorization(["admin", "member"]),
  usersController.update
);

export { userRoutes }