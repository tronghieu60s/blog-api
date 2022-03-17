import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import {
  authorizationRouterUserByLevel,
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import {
  joiFilterSchema,
  joiCreateUserSchema,
  joiUpdateUserSchema,
} from "../helpers/commonValidate";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), usersController.getUsers)
  .post(joiCommonValidateBody(joiCreateUserSchema), usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .put(joiCommonValidateBody(joiUpdateUserSchema), usersController.updateUser)
  .delete(usersController.deleteUser);

export default router;
