import PromiseRouter from "express-promise-router";
import multer from "multer";
import { joiSendEmailSchema } from "../common/validate";
import * as commonController from "../controllers/commonController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, fileName + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage }).single("file");

const router = PromiseRouter();

router.route("/upload").post(upload, commonController.uploadServer);
router
  .route("/send-email")
  .post(
    joiCommonValidateBody(joiSendEmailSchema),
    commonController.sendEmailServer
  );

export default router;
