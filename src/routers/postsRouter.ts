import PromiseRouter from "express-promise-router";
import * as postsController from "../controllers/postsController";
import { joiCommonValidate } from "../validate/commonValidate";
import { joiCreatePostsSchema } from "../validate/postsValidate";

const router = PromiseRouter();

router
  .route("/")
  .post(joiCommonValidate(joiCreatePostsSchema), postsController.createPost);

export default router;
