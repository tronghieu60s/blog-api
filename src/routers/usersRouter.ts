import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiDeleteManySchema, joiFilterSchema } from "../common/validate";
import { joiCreateUserSchema, joiUpdateUserSchema } from "../models/usersModel";

const router = PromiseRouter();

router
  .route("/")
  .get(joiCommonValidateQuery(joiFilterSchema), usersController.getUsers)
  .post(joiCommonValidateBody(joiCreateUserSchema), usersController.createUser)
  .delete(
    joiCommonValidateBody(joiDeleteManySchema),
    usersController.deleteUsers
  );
router
  .route("/:id")
  .get(usersController.getUser)
  .put(joiCommonValidateBody(joiUpdateUserSchema), usersController.updateUser)
  .delete(usersController.deleteUser);

export default router;
