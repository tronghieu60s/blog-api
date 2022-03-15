import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery
} from "../helpers/commonFuncs";
import { joiFilterSchema } from "../validate";
import {
  joiCreateUserSchema,
  joiUpdateUserSchema
} from "../validate/usersValidate";

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
