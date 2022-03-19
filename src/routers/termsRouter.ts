import PromiseRouter from "express-promise-router";
import * as termsController from "../controllers/termsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiFilterSchema } from "../common/validate";
import { joiCreateTermSchema, joiUpdateTermSchema } from "../models/termsModel";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), termsController.getTerms)
  .post(joiCommonValidateBody(joiCreateTermSchema), termsController.createTerm);
router
  .route("/:id")
  .get(termsController.getTerm)
  .put(joiCommonValidateBody(joiUpdateTermSchema), termsController.updateTerm)
  .delete(termsController.deleteTerm);

export default router;
