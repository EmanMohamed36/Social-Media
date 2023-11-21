import express from "express"

import {getAllUser, singUpUser,loginUser} from "../controllers/user_controllers.js";

const router = express.Router();

router.get("/", getAllUser)
router.post("/signup", singUpUser)
router.post("/login",loginUser)

export default router