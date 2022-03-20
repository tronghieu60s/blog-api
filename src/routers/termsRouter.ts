import PromiseRouter from "express-promise-router";
import * as termsController from "../controllers/termsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiDeleteManySchema, joiFilterSchema } from "../common/validate";
import { joiCreateTermSchema, joiUpdateTermSchema } from "../models/termsModel";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), termsController.getTerms)
  .post(joiCommonValidateBody(joiCreateTermSchema), termsController.createTerm)
  .delete(
    joiCommonValidateBody(joiDeleteManySchema),
    termsController.deleteTerms
  );
router
  .route("/:id")
  .get(termsController.getTerm)
  .put(joiCommonValidateBody(joiUpdateTermSchema), termsController.updateTerm)
  .delete(termsController.deleteTerm);
router
  .route("/:id/meta")
  .get(termsController.getTermMeta)
  .post(termsController.createTermMeta);
router
  .route("/:id/meta/:key")
  .get(termsController.getTermMeta)
  .put(termsController.updateTermMeta)
  .delete(termsController.deleteTermMeta);

export default router;
