import { Router } from "express";
import { userRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamRoutes } from "./teams-routes";
import { teamsMembersRoutes } from "./teams-members-routes";
import { tasksRoutes } from "./tasks-routes";

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/teams", teamRoutes)
routes.use("/teamsMembers", teamsMembersRoutes)
routes.use("/tasks", tasksRoutes)

export { routes }