import { Router } from "express";
import {urlSchema} from "../models/urlSchema.js"
import {validateSchema} from "../middleware/validateSchema.middleware.js"
import { urlShorten } from "../controllers/url.controller.js";

const router = Router();

router.post("/urls/shorten",validateSchema(urlSchema),urlShorten);

export default router