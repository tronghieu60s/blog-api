import PromiseRouter from "express-promise-router";
import * as termsController from "../controllers/termsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import {
  joiCreateMetaSchema,
  joiDeleteManySchema,
  joiFilterSchema,
  joiUpdateMetaSchema,
} from "../common/validate";
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
  .patch(joiCommonValidateBody(joiUpdateTermSchema), termsController.updateTerm)
  .delete(termsController.deleteTerm);
router
  .route("/:id/meta")
  .get(joiCommonValidateBody(joiCreateMetaSchema), termsController.getTermMeta)
  .post(termsController.createTermMeta);
router
  .route("/:id/meta/:key")
  .get(termsController.getTermMeta)
  .patch(
    joiCommonValidateBody(joiUpdateMetaSchema),
    termsController.updateTermMeta
  )
  .delete(termsController.deleteTermMeta);

export default router;
