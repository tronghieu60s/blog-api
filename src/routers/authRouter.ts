import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import {
  joiAuthUserSchema,
  joiRegisterUserSchema,
  joiVerifyUserSchema,
} from "../models/usersModel";

const router = PromiseRouter();

router.route("/no-auth").post(usersController.noAuthUser);
router
  .route("/auth")
  .post(joiCommonValidateBody(joiAuthUserSchema), usersController.authUser);
router
  .route("/register")
  .post(
    joiCommonValidateBody(joiRegisterUserSchema),
    usersController.createUser
  );
router
  .route("/verify")
  .post(
    joiCommonValidateQuery(joiVerifyUserSchema),
    usersController.verifyUser
  );
router
  .route("/verify-resend")
  .post(
    joiCommonValidateQuery(joiVerifyUserSchema),
    usersController.verifyUserResend
  );
router.route("/reset-password").post(usersController.resetPassword);

export default router;
