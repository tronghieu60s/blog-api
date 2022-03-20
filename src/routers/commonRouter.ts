import PromiseRouter from "express-promise-router";
import { joiSendEmailSchema } from "../common/validate";
import * as commonController from "../controllers/commonController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";

const router = PromiseRouter();

router
  .route("/send-email")
  .post(
    joiCommonValidateBody(joiSendEmailSchema),
    commonController.sendEmailServer
  );

export default router;
