import express, { Request, Response } from "express";
import memberController from "./controllers/member.controller";

const router = express.Router();

/** Member API*/
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout,
);


router.get("/member/detail", memberController.verifyAuth, memberController.getMemberDetail);

/** Product API */

/** Order API */

export default router;
