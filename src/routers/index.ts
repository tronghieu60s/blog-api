import PromiseRouter from "express-promise-router";
import commentsRouter from "../routers/commentsRouter";
import commonRouter from "../routers/commonRouter";
import postsRouter from "../routers/postsRouter";
import usersRouter from "../routers/usersRouter";
import identityRouter from "./identityRouter";

const router = PromiseRouter();

router.use("/", commonRouter);
router.use("/identity", identityRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

export default router;
