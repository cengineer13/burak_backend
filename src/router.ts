import express, { Request, Response } from "express";
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";

const router = express.Router();

/** Member API*/
router.get("/member/restaurant", memberController.getRestaurant);
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout,
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail,
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateMember,
);

router.get("/member/top-users", memberController.getTopUsers);

/** Product API */
router.get("/product/all", productController.getProducts);

/** Order API */

export default router;
