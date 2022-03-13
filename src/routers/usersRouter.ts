import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";

const router = PromiseRouter();

router.route("/").get(usersController.index);

export default router;
