import { actionTypes } from "./action";

export const initState = {
  isLoggedIn: localStorage.getItem("isLoggedIn")
    ? localStorage.getItem("isLoggedIn") === "true"
    : false,
  authToken: localStorage.getItem("authToken")
    ? localStorage.getItem("authToken")
    : null,
  userData: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
  appDefaultSetting: null,
  countries: [],
  registerRequestData: localStorage.getItem("registerRequestData")
  ? JSON.parse(localStorage.getItem("registerRequestData"))
  : null,
  resetPasswordRequestData: null,
  defaultAddress: localStorage.getItem("defaultAddress")
    ? JSON.parse(localStorage.getItem("defaultAddress"))
    : null,
  kycRequestData: null,
  ipData: null,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.APP_FIRST_START:
      return {
        ...state,
        authToken: action.authToken,
        userData: action.userData,
      };
    case actionTypes.APP_DEFAULT:
      return {
        ...state,
        appDefaultSetting: action.appDefaultSetting,
      };
    case actionTypes.REGISTER_REQEUST:
      return {
        ...state,
        registerRequestData: action.registerRequestData,
      };
    case actionTypes.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordRequestData: action.resetPasswordRequestData,
      };
    case actionTypes.KYC_REQUEST:
      return {
        ...state,
        kycRequestData: action.kycRequestData,
      };
    case actionTypes.DEFAULT_ADDRESS:
      return {
        ...state,
        defaultAddress: action.defaultAddress,
      };
    case actionTypes.WebAPP_CONFIGURATION:
        return {
          ...state,
          webAppConfiguration: action.webAppConfiguration,
        };
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        isLoggedIn: true,
        userData: action.userData,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...{ isLoggedIn: true },
      };
    case actionTypes.LOGOUT_SUCCESS:
      localStorage.clear();
      return {
        isLoggedIn: false,
      };
    case actionTypes.GET_COUNTRIES:
      return {
        ...state,
        countries: action.countries,
      };
    case actionTypes.FETCH_IP_DATA:
      return {
        ...state,
        ipData: action.ipData,
      };
    default:
      return state;
  }
}

export default reducer;
