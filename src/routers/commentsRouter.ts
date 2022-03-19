import PromiseRouter from "express-promise-router";
import * as commentsController from "../controllers/commentsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiDeleteManySchema, joiFilterSchema } from "../common/validate";
import {
  joiCreateCommentsSchema,
  joiUpdateCommentsSchema,
} from "../models/commentsModel";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), commentsController.getComments)
  .post(
    joiCommonValidateBody(joiCreateCommentsSchema),
    commentsController.createComment
  )
  .delete(
    joiCommonValidateBody(joiDeleteManySchema),
    commentsController.deleteComments
  );
router
  .route("/:id")
  .get(commentsController.getComment)
  .put(
    joiCommonValidateBody(joiUpdateCommentsSchema),
    commentsController.updateComment
  )
  .delete(commentsController.deleteComment);

export default router;
