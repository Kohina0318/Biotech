import NoImage from "public/static/img/noImage.png";
import { getAppSettings } from "../utilities/app-settings";
export const NoImg = NoImage;


export const STATUS_CODE = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
};

// API BASE URL
const API_URL = process.env.REACT_APP_API_URL;
export const SITE_URL = `${API_URL}`;
export const BASE_URL = `${API_URL}Api/`;
export const IMAGE_BASE_URL = `${API_URL}Api`;
export const LANGUAGE_BASE_URL = `${API_URL}json/`;

export const SITE_WEBURL = process.env.REACT_APP_BASE_PATH;

export const privateSecretKey = "2C39927D43F04E1CBAB1615841D94000";
export const KYC_STATUS = {
  Draft: "Draft",
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
  Invalidated: "Invalidated",
  NoSubmission: "NoSubmission",
};

export const KYC_STATUS_MESSAGE = {
  Draft: "Your KYC verification drafted. Verify your KYC now.",
  Pending: "Your KYC is submitted, Please contact System Administrator.",
  Approved: "Approved",
  Rejected: "Your KYC rejected. Re-submit KYC to place order",
  Invalidated:
    "Your KYC verification invalidated. please submit required documents.",
  NoSubmission: "NoSubmission",
};

export const KYC_FIELD_TYPE = {
  Boolean: "Boolean",
  Int16: "Int16",
  String: "String",
  IFormFile: "IFormFile",
  DateTime: "DateTime",
};

export const KYC_UPLOAD_DOC_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "application/pdf": "pdf",
};

export const COMBO_PRODUCT_CATEGORY = "0948f47b-5f02-46d0-9c33-b049515d07ee";

export const RAZORPAY_ENV = process.env.REACT_APP_RAZOR_PAY_ENVIRONMENT; // "LIVE / TEST"

export const RAZORPAY_CREDENTIALS = {
  TEST: {
    key: process.env.REACT_APP_RAZOR_PAY_TEST_KEY,
    key_secret: process.env.REACT_APP_RAZOR_PAY_TEST_SECRET,
  },
  LIVE: {
    key: process.env.REACT_APP_RAZOR_PAY_LIVE_KEY,
    key_secret: process.env.REACT_APP_RAZOR_PAY_LIVE_SECRET,
  },
  MERCHANT_NAME: process.env.REACT_APP_NAME,
};

export const PRODUCT_TYPE = {
  SINGEL: "Single",
  GROUPED: "Grouped",
  COMBO: "Combo",
};

/*
export const RAZORPAY_CREDENTIALS = {
  TEST: {
    key: "rzp_test_KJ9p4xRJZcupaP",
    key_secret: "9xN53CBwDpt0jnMqhb1AWww7",
  },
  MERCHANT_NAME: "Testing Credentials",
};*/

export const APP_SETTINGS = {
  isB2B: process.env.REACT_APP_IS_B2B === "true" ? true : false, // LOGIN WITH MAIL
  isB2C: process.env.REACT_APP_IS_B2B === "false" ? true : false, // LOGIN AND REGISTER WITH PHONE
  isKyc: process.env.REACT_APP_IS_KYC === "true" ? true : false, // KYC ALLOWED OR NOT
  isLoyalty: process.env.REACT_APP_IS_LOYALTY === "true" ? true : false, // LOYALTY
  isWallet: process.env.REACT_APP_IS_WALLET === "true" ? true : false, // WALLET
  isShippingEnable : process.env.REACT_APP_IS_WALLET === "false" ? true : false, // WALLET
  Grouping: true,
  KYC: true,
  MultipleBusiness: true,
  Shipping: true,
  AutoRegisterOnLogin: true,
  OnlinePaymentOnly: true,
  AddressMappedByPincode: true,

  
};