import Errors, { HttpCode } from "../libs/errors";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { Response } from "express";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderController: T = {};

const orderService = new OrderService();

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("on createOrder page");
    const result = await orderService.createOrder(req.member, req.body);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error on createOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("on getMyOrders page");
    const { page, limit, orderStatus } = req.query;
    const inquiry: OrderInquiry = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };
    console.log("inquiry:", inquiry);

    const result = await orderService.getMyOrders(req.member, inquiry);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error on getMyOrders", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("on updateOrder page");
    const input: OrderUpdateInput = req.body;

    console.log("input:", req.body);
    const result = await orderService.updateOrder(req.member, input);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error on updateOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standart.code).json(Errors.standart);
  }
};

export default orderController;
