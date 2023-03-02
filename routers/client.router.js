import { Router } from "express";
import {signUp,signIn, usersMe, ranking} from "../controllers/client.controller.js"
import {signUpSchema, signInSchema} from "../models/clientSchema.js"
import {validateSchema} from "../middleware/validateSchema.middleware.js"

const router = Router();

router.post("/signup",validateSchema(signUpSchema),signUp);
router.post("/signIn",validateSchema(signInSchema),signIn);
router.get("/users/me",usersMe);
router.get("/ranking",ranking)

export default router