import { HttpCode, Message } from "../libs/errors";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import Errors from "../libs/errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
  private readonly memberModel; //DB ni ozgartirmaslik uchun

  constructor() {
    this.memberModel = MemberModel;
  }

  /** SPA */
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    // bcrypt orqali passwordni hashlash
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.log("Error on user sign up process:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    // TODO: Add  member status later

    // member hosil qilib Schme modeldan DB ichidan qidiramiz
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 },
      )
      .exec();

    // agar member DB da mavjud bo'lmasa Error qilamiz va uni controler catchga uzatamiz
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    // agar input pw bn DB dagi hashlanga pw bir xilligni tekshirish
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );

    // bir xil bo'lmasa Error qilamiz va uni controler catchga uzatamiz
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    console.log("Tizimga muvaffaqiyatli login bo'lindi!");
    return await this.memberModel.findById(member._id).lean().exec();
  }

  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  /** SSR */

  // Restaurant user royxatdan otish
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();
    // console.log("exist", exist)
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    // bcrypt orqali passwordni hashlash
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    // console.log("after", input.memberPassword);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      `<script> alert("Restaurant admin succesfully created"); </script>`;
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // Logindan otish
  public async processLogin(input: LoginInput): Promise<Member> {
    // member hosil qilib Schme modeldan DB ichidan qidiramiz
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 },
      )
      .exec();

    // agar member DB da mavjud bo'lmasa Error qilamiz va uni controler catchga uzatamiz
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    // agar input pw bn DB dagi hashlanga pw bir xilligni tekshirish
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );

    // xavfli usul -> const isMatch = input.memberPassword === member.memberPassword;
    // bir xil bo'lmasa Error qilamiz va uni controler catchga uzatamiz
    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    console.log("Tizimga muvaffaqiyatli login bo'lindi!");
    return await this.memberModel.findById(member._id).exec();
  }

  // Userlarni olish
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // Update user
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}
export default MemberService;
