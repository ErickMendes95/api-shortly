import { Router } from "express";
import {urlSchema} from "../models/urlSchema.js"
import {validateSchema} from "../middleware/validateSchema.middleware.js"
import { deleteUrl, getUrls, openUrl, urlShorten } from "../controllers/url.controller.js";

const router = Router();

router.post("/urls/shorten",validateSchema(urlSchema),urlShorten);
router.get("/urls/:id",getUrls)
router.get("/urls/open/:shortUrl",openUrl)
router.delete("/urls/:id",deleteUrl)

export default router