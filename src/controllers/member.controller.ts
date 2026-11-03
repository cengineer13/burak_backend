import { Request, Response } from "express";
import { T } from "../libs/types/common";
import { MemberInput, LoginInput, Member } from "../libs/types/member";
import MemberService from "../models/Member.service";
import Errors from "../libs/errors";
import AuthService from "../models/Auth.service";

const memberService = new MemberService();
const authService = new AuthService(); // Token classidan olamiz

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("Process User Signup");
    console.log("POST: user sign up body:", req.body);

    const input: MemberInput = req.body,
      result: Member = await memberService.signup(input);
    // TODO: tokens
    const token = await authService.createToken(result);

    res.json({ member: result });
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
    console.log("POST: input user login req body:", req.body);

    const input: LoginInput = req.body,
      result = await memberService.login(input);

    // TODO: tokens
    const token = await authService.createToken(result);
    // console.log("token:", token);

    res.json({ member: result });
  } catch (err) {
    console.log("Error on User login process:", err);

    // Agar err biz hosil qilgan class ichidagi errolardan bolsa jsonga ogirib uni qayta jonatadi
    if (err instanceof Errors) res.status(err.code).json(err);
    // customized error classda mavjud bolmagan error bolsa shu qator ishlaydi
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default memberController;
