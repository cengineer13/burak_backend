import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequests, ExtendedRequest } from "../libs/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { ProductCollection } from "../libs/enums/product.enum";

const productService = new ProductService();

const productController: T = {};

/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts Page");
    const { order, page, limit, productCollection, search } = req.query;

    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    if (productCollection)
      inquiry.productCollection = productCollection as ProductCollection;

    if (search) inquiry.search = String(search).trim();

    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error on getProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct Page");
    const { id } = req.params;
    const memberId = req.member?._id ?? null;
    console.log("req.member", req.member);

    const result = await productService.getProduct(memberId, id as string);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error on getProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

/** SSR */
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts Page");
    const data = await productService.getAllProducts();
    // console.log("getall dan kirib kelgan data:", data);
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error on getAllProducts page", err);

    // Agar err biz hosil qilgan class ichidagi errolardan bolsa jsonga ogirib uni qayta jonatadi
    if (err instanceof Errors) res.status(err.code).json(err);
    // customized error classda mavjud bolmagan error bolsa shu qator ishlaydi
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

productController.createNewProduct = async (
  req: AdminRequests,
  res: Response,
) => {
  try {
    console.log("createNewProduct ");
    console.log("req body:", req.body);

    // agar input array file 0 bo'lsa fale boladi va xato kelib chiqadi
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    const data: ProductInput = req.body;
    data.productImages = req.files?.map((el) => {
      return el.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);
    res.send(
      `<script> alert('sucessfully created'); window.location.replace('/admin/product/all')</script>`,
    );
  } catch (err) {
    console.log("Error on createNewProduct page", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert('${message}'); window.location.replace('/admin/product/all')</script>`,
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct Page ");
    const id = req.params.id as string;
    console.log("Berilayotgan ID:", id);

    const result = await productService.updateChosenProduct(id, req.body);
    console.log("Ma'lumot update bo'ldi:", result);
    res.send(result);
  } catch (err) {
    console.log("Error on updateChosenProduct page", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default productController;
