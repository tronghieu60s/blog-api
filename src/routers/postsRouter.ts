import PromiseRouter from "express-promise-router";
import * as postsController from "../controllers/postsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery
} from "../helpers/commonFuncs";
import {
  joiFilterSchema,
  joiCreatePostsSchema,
  joiUpdatePostsSchema,
} from "../helpers/commonValidate";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), postsController.getPosts)
  .post(
    joiCommonValidateBody(joiCreatePostsSchema),
    postsController.createPost
  );
router
  .route("/:id")
  .get(postsController.getPost)
  .put(joiCommonValidateBody(joiUpdatePostsSchema), postsController.updatePost)
  .delete(postsController.deletePost);

export default router;
