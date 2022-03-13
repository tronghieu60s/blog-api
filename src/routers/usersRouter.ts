import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";

const router = PromiseRouter();

router.route("/").get(usersController.index);

router.route("/").post(usersController.create);

export default router;
