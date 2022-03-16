import PromiseRouter from "express-promise-router";
import * as commentsController from "../controllers/commentsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery
} from "../helpers/commonFuncs";
import {
  joiFilterSchema,
  joiCreateCommentsSchema,
  joiUpdateCommentsSchema,
} from "../helpers/commonValidate";

const router = PromiseRouter();

router
  .route("/")
  .get([joiCommonValidateQuery(joiFilterSchema)], commentsController.getComments)
  .post(
    joiCommonValidateBody(joiCreateCommentsSchema),
    commentsController.createComment
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
