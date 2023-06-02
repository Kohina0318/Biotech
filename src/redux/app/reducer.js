import { actionTypes } from "./action";

export const initState = {
  isShowDemoPanel: false,
  categories: [],
  cartData: null,
  languageList: null,
  languageLocalList: null,
  selectedLanguage: localStorage.getItem("selectedLanguage")
    ? JSON.parse(localStorage.getItem("selectedLanguage"))
    : {
        CountryCode: "US",
        LanguageCode: "en",
        Locale: "en-US",
        Url: "json/en-US.json",
      },
  selectedLanguageData: {},
  currencySetting: null,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.SWITCH_DEMO_PANEL_SUCCESS:
      return {
        ...state,
        ...{ isShowDemoPanel: action.payload },
      };
    case actionTypes.FETCH_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };
    case actionTypes.FETCH_CART_DATA:
      return {
        ...state,
        cartData: action.cartData,
      };
    case actionTypes.FETCH_LANGUAGE_LIST:
      return {
        ...state,
        languageList: action.languageList,
      };
    case actionTypes.FETCH_SELECTED_LANGUAGE_DATA:
      return {
        ...state,
        selectedLanguageData: { ...action.selectedLanguageData },
      };
    case actionTypes.FETCH_LANGUAGE_LOCAL:
      return {
        ...state,
        languageLocalList: action.languageLocalList,
      };

    case actionTypes.UPDATE_USER_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.selectedLanguage,
      };
    case actionTypes.FETCH_CURRENCY:
      return {
        ...state,
        currencySetting: action.currencySetting,
      };
    default:
      return state;
  }
}

export default reducer;
