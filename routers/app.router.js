import { Router } from "express";
import clientRouter from "./client.router.js"
import urlRouter from "./url.router.js"

const router = Router();

router.use(clientRouter);
router.use(urlRouter);

export default router;