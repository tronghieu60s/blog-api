import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import { joiCommonValidate } from "../validate/commonValidate";
import { joiAuthUserSchema, joiRegisterUserSchema } from "../validate/usersValidate";

const router = PromiseRouter();

router
  .route("/auth")
  .post(joiCommonValidate(joiAuthUserSchema), usersController.authUser);
router
  .route("/register")
  .post(joiCommonValidate(joiRegisterUserSchema), usersController.registerUser);

export default router;
