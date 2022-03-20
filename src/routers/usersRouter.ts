import PromiseRouter from "express-promise-router";
import * as usersController from "../controllers/usersController";
import {
  joiCommonValidateBody,
  joiCommonValidateQuery,
} from "../helpers/commonFuncs";
import { joiCreateMetaSchema, joiDeleteManySchema, joiFilterSchema, joiUpdateMetaSchema } from "../common/validate";
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
  .patch(joiCommonValidateBody(joiUpdateUserSchema), usersController.updateUser)
  .delete(usersController.deleteUser);
router
  .route("/:id/meta")
  .get(usersController.getUserMeta)
  .post(joiCommonValidateBody(joiCreateMetaSchema), usersController.createUserMeta);
router
  .route("/:id/meta/:key")
  .get(usersController.getUserMeta)
  .patch(joiCommonValidateBody(joiUpdateMetaSchema), usersController.updateUserMeta)
  .delete(usersController.deleteUserMeta);

export default router;
