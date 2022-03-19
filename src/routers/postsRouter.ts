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

export default router;
