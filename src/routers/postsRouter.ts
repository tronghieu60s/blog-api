import PromiseRouter from "express-promise-router";
import * as postsController from "../controllers/postsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiDeleteManySchema, joiFilterSchema } from "../common/validate";
import {
  joiCreatePostsSchema,
  joiUpdatePostsSchema,
} from "../models/postsModel";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), postsController.getPosts)
  .post(joiCommonValidateBody(joiCreatePostsSchema), postsController.createPost)
  .delete(
    joiCommonValidateBody(joiDeleteManySchema),
    postsController.deletePosts
  );
router
  .route("/:id")
  .get(postsController.getPost)
  .put(joiCommonValidateBody(joiUpdatePostsSchema), postsController.updatePost)
  .delete(postsController.deletePost);
router
  .route("/:id/meta")
  .get(postsController.getPostMeta)
  .post(postsController.createPostMeta);
router
  .route("/:id/meta/:key")
  .get(postsController.getPostMeta)
  .put(postsController.updatePostMeta)
  .delete(postsController.deletePostMeta);

export default router;
