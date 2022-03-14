import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";

const router = PromiseRouter();

router.route("/").get(usersController.getUsers);
router.route("/:id").get(usersController.getUser);
router.route("/").post(usersController.createUser);
router.route("/:id").put(usersController.updateUser);
router.route("/:id").delete(usersController.deleteUser);

export default router;
