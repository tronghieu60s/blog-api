import PromiseRouter from "express-promise-router";
import * as postsController from "../controllers/postsController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery
} from "../helpers/commonFuncs";
import { joiFilterSchema } from "../validate/commonValidate";
import { joiCreatePostsSchema, joiUpdatePostsSchema } from "../validate/postsValidate";

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
  .put(joiCommonValidateBody(joiUpdatePostsSchema), postsController.updateUser)
  .delete(postsController.deleteUser);

export default router;
