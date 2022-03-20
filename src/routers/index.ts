import PromiseRouter from "express-promise-router";
import commentsRouter from "./commentsRouter";
import commonRouter from "./commonRouter";
import identityRouter from "./identityRouter";
import postsRouter from "./postsRouter";
import termsRouter from "./termsRouter";
import uploadsRouter from "./uploadsRouter";
import usersRouter from "./usersRouter";

const router = PromiseRouter();

router.use("/", commonRouter);
router.use("/uploads", uploadsRouter);
router.use("/identity", identityRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/terms", termsRouter);

export default router;
