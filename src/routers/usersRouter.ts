import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import { joiCommonValidate } from "../validate/commonValidate";
import {
  joiCreateSchema,
  joiRegisterSchema,
  joiUpdateSchema,
} from "../validate/usersValidate";

const router = PromiseRouter();

router
  .route("/")
  .get(usersController.getUsers)
  .post(joiCommonValidate(joiCreateSchema), usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .put(joiCommonValidate(joiUpdateSchema), usersController.updateUser)
  .delete(usersController.deleteUser);

router.route("/auth").post(usersController.authUser);
router
  .route("/register")
  .post(joiCommonValidate(joiRegisterSchema), usersController.registerUser);

export default router;
