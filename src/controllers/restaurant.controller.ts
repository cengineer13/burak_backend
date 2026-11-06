import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import MemberService from "../models/Member.service";
import { AdminRequests, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/errors";
import path from "path";

const memberService = new MemberService();

const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    // LOGIC
    //SERVICE MODEL va xokazo ... (yoziladi)
    res.render("home");
    // response: send | json | redirect | end | render
  } catch (err) {
    console.log("Error on goHome:", err);
  }
};
restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error on goHome:", err);
    res.redirect("/admin");
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log("Error on goHome:", err);
    res.redirect("/admin");
  }
};

restaurantController.processSignup = async (
  req: AdminRequests,
  res: Response,
) => {
  try {
    console.log("Process Signup");
    // Requestdan file ni olish
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    //Yangi member hosil qilish
    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.RESTAURANT;
    console.log("file:", file);

    const result = await memberService.processSignup(newMember);
    // Sessions - part
    req.session.member = result;
    // session succesfully browser ichidagi coockie ga sid nijoylaydi/
    // Shuningdek DB sessions collectioniga joylab keyingi browserga response qaytaradi
    req.session.save(function () {
      res.redirect("/admin/product/all");
      console.log("Sign Up Done");
    });
  } catch (err) {
    console.log("Error Process Signup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`,
    );
  }
};

restaurantController.processLogin = async (
  req: AdminRequests,
  res: Response,
) => {
  try {
    console.log("Process Login");

    const input: LoginInput = req.body;

    const result = await memberService.processLogin(input);

    // Sessions - part
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error on Process Login:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`,
    );
  }
};

restaurantController.logout = async (req: AdminRequests, res: Response) => {
  try {
    console.log("Process Logout");

    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error on Logout process:", err);
    res.redirect("/admin");
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequests,
  res: Response,
) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member)
      res.send(
        `<script> alert("Hi, ${req.session.member.memberNick}") </script>`,
      );
    else res.send(`<script> alert('${Message.NOT_AUTHENTICATED}') </script>`);
  } catch (err) {
    console.log("Error on checkAuthSession:", err);
    res.send(err);
  }
};

/**USERS */
restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers page");
    const result = await memberService.getUsers();
    console.log(result);

    res.render("users", { users: result });
  } catch (err) {
    console.log("Error on getUsers:", err);
    res.redirect("/admin/login");
  }
};

restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser page");
    const result = await memberService.updateChosenUser(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error on updateChosenUser:", err);
    // Agar err biz hosil qilgan class ichidagi errolardan bir bolsa jsonga ogirib uni qayta jonatadi
    if (err instanceof Errors) res.status(err.code).json(err);
    // customized error classda mavjud bolmagan error bolsa standart errorni yuboradi
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

restaurantController.verifyRestaurant = (
  req: AdminRequests,
  res: Response,
  next: NextFunction,
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert('${message}'); window.location.replace('/admin/login')</script>`,
    );
  }
};

export default restaurantController;
