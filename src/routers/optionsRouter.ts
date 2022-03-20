import PromiseRouter from "express-promise-router";
import * as optionsController from "../controllers/optionsController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";
import {
  joiCreateOptionSchema,
  joiUpdateOptionSchema,
} from "../models/optionsModel";

const router = PromiseRouter();

router
  .route("/")
  .get(optionsController.getOptions)
  .post(
    joiCommonValidateBody(joiCreateOptionSchema),
    optionsController.createOption
  );
router
  .route("/:id")
  .get(optionsController.getOption)
  .patch(
    joiCommonValidateBody(joiUpdateOptionSchema),
    optionsController.updateOption
  )
  .delete(optionsController.deleteOption);

export default router;
