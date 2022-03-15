import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";
import {
  joiAuthUserSchema,
  joiRegisterUserSchema,
} from "../validate/usersValidate";

const router = PromiseRouter();

router
  .route("/auth")
  .post(joiCommonValidateBody(joiAuthUserSchema), usersController.authUser);
router
  .route("/register")
  .post(
    joiCommonValidateBody(joiRegisterUserSchema),
    usersController.registerUser
  );

export default router;
