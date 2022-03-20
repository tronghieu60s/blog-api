import PromiseRouter from "express-promise-router";
import fs from "fs";
import multer from "multer";
import { joiSendEmailSchema } from "../common/validate";
import * as commonController from "../controllers/commonController";
import { joiCommonValidateBody } from "../helpers/commonFuncs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dir = process.cwd() + `\\public\\uploads\\${year}\\${month}\\`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName =
      Date.now() +
      "-" +
      String(Math.round(Math.random() * 1e9)).padStart(9, "0");
    cb(null, fileName + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage }).array("files");

const router = PromiseRouter();

router.route("/uploads").post(upload, commonController.uploadServer);
router
  .route("/send-email")
  .post(
    joiCommonValidateBody(joiSendEmailSchema),
    commonController.sendEmailServer
  );

export default router;
