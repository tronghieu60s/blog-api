import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import { joiCommonValidate } from "../validate/commonValidate";
import { joiAuthSchema, joiRegisterSchema } from "../validate/usersValidate";

const router = PromiseRouter();

router
  .route("/auth")
  .post(joiCommonValidate(joiAuthSchema), usersController.authUser);
router
  .route("/register")
  .post(joiCommonValidate(joiRegisterSchema), usersController.registerUser);

export default router;
