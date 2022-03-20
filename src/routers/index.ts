import PromiseRouter from "express-promise-router";
import commentsRouter from "./commentsRouter";
import commonRouter from "./commonRouter";
import identityRouter from "./identityRouter";
import optionsRouter from "./optionsRouter";
import postsRouter from "./postsRouter";
import termsRouter from "./termsRouter";
import uploadsRouter from "./uploadsRouter";
import usersRouter from "./usersRouter";

const router = PromiseRouter();

router.use("/", commonRouter);
router.use("/comments", commentsRouter);
router.use("/identity", identityRouter);
router.use("/options", optionsRouter);
router.use("/posts", postsRouter);
router.use("/terms", termsRouter);
router.use("/uploads", uploadsRouter);
router.use("/users", usersRouter);

export default router;
