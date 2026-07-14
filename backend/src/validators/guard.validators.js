import { body } from "express-validator";

const acceptDeliveryValidator = () => {
  return [
    body("orderId")
      .trim()
      .notEmpty()
      .withMessage("Order ID is required"),
  ];
};

const verifyDeliveryValidator = () => {
  return [
    body("trackingId")
      .trim()
      .notEmpty()
      .withMessage("Tracking ID is required"),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required"),
  ];
};

const handoverValidator = () => {
  return [
    body("trackingId")
      .trim()
      .notEmpty()
      .withMessage("Tracking ID is required"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required"),
    body("token")
      .trim()
      .notEmpty()
      .withMessage("Token is required"),
    body("token")
      .isNumeric()
      .withMessage("Token must be a valid number"),
    body("token")
      .toInt()
      .isInt({ min: 1, max: 100 })
      .withMessage("Token must be between 1 and 100"),
  ];
};

export {
  acceptDeliveryValidator,
  verifyDeliveryValidator,
  handoverValidator,
};