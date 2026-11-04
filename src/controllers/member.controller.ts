import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import {
  MemberInput,
  LoginInput,
  Member,
  ExtendedRequest,
} from "../libs/types/member";
import MemberService from "../models/Member.service";
import Errors, { HttpCode, Message } from "../libs/errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService(); // Token classidan olamiz

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("Process User Signup");
    console.log("POST: user sign up body:", req.body);

    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input);

    // Tokens
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error on User signup Process:", err);

    // Agar err biz hosil qilgan class ichidagi errolardan bolsa jsonga ogirib uni qayta jonatadi
    if (err instanceof Errors) res.status(err.code).json(err);
    // customized error classda mavjud bolmagan error bolsa shu qator ishlaydi
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("Process User Login");
    const input: LoginInput = req.body,
      result = await memberService.login(input);

    // Tokens
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error on User login process:", err);

    // Agar err biz hosil qilgan class ichidagi errolardan bolsa jsonga ogirib uni qayta jonatadi
    if (err instanceof Errors) res.status(err.code).json(err);
    // customized error classda mavjud bolmagan error bolsa shu qator ishlaydi
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

memberController.logout = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("User logged out succesfully!");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error on user logout", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

// Middlewares
memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let member = null;
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    if (!req.member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    next();
  } catch (err) {
    console.log("Error on verifyAuth", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

memberController.retriveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
    next();
  } catch (err) {
    console.log("Error on retriveAuth", err);
    next();
  }
};

export default memberController;
