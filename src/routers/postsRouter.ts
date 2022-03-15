import PromiseRouter from "express-promise-router";
import * as postsController from "../controllers/postsController";
import { joiCommonValidate } from "../validate/commonValidate";
import { joiCreatePostsSchema } from "../validate/postsValidate";

const router = PromiseRouter();

router
  .route("/")
  .get(postsController.getPosts)
  .post(joiCommonValidate(joiCreatePostsSchema), postsController.createPost);
router.route("/:id").get(postsController.getPost);

export default router;
