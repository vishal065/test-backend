import { Router } from "express";
import UserRouter from "./User.routes.js";
import AdminRouter from "./Admin.routes.js";

const IndexRoute = Router();

IndexRoute.use("/health-check", (_, res) => {
  res.send("hello");
});
IndexRoute.use("/user", UserRouter);
IndexRoute.use("/admin", AdminRouter);

export default IndexRoute;
