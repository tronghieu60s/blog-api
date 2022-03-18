import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";
import { joiAuthUserSchema, joiRegisterUserSchema } from "../models/usersModel";

const router = PromiseRouter();

router.route("/no-auth").post(usersController.noAuthUser);
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
