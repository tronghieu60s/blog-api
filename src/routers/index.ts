import PromiseRouter from "express-promise-router";
import authRouter from "../routers/authRouter";
import commentsRouter from "../routers/commentsRouter";
import commonRouter from "../routers/commonRouter";
import postsRouter from "../routers/postsRouter";
import usersRouter from "../routers/usersRouter";

const router = PromiseRouter();

router.use("/", authRouter);
router.use("/", commonRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

export default router;
