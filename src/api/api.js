import axios from "axios";
import { notification } from "antd";
import jwt from "jsonwebtoken";
import { v1 as uuidv1 } from "uuid";
import { privateSecretKey } from "../utilities/constants";
import { BASE_URL } from "../utilities/constants";
import { parseJwt } from "utilities/helpers";
import { languageLable } from "utilities/helpers";

const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

// CHECK BELOW FOR SAMPLE DATA TO BE PASSED
class API {
  isLoggedIn = false;
  userToken = null;
  token = null;
  isGuest = false;
  selectedLanguageData = {}

  constructor() {
    this.baseURL = BASE_URL;
  }

  generateDeviceToken() {
    const token = jwt.sign(
      /*{
        appversion: "2.1",
        appversioncode: "22",
        aud: ["com.archisys.artis"],
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        iat: Date.now(),
        id: uuidv1(),
        iss: "com.archisys.biotech",
        manufacturer: "Xiaomi",
        model: "Redmi Note 5",
        notificationid: uuidv1(),
        os: "Android",
        osversion: "8.1.0",
        platform: "Mobile",
      },*/
      {
            aud: ['com.archisys.artis'],
            appversion: '2.1',
            appversioncode: '22',
            iat: Date.now(),
            id: uuidv1(),
            iss: 'com.archisys.biotech',
            manufacturer: window.navigator.vendor,
            model: window.navigator.vendor,
            notificationid: uuidv1(),
            os: "PWA",
            osversion: window.navigator.appVersion,
            platform: 'Web',
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        },
      privateSecretKey,
      { algorithm: "HS256" }
    );
    localStorage.setItem("deviceToken", token);

    // Method for decoding and verify token
    // const decodedToken = jwt.verify(token , privateSecretKey);
    // console.log("decodedToken" , decodedToken)
    return token;
  }

  getAuthenticationInfo() {
    if (
      localStorage.getItem("isLoggedIn") &&
      localStorage.getItem("authToken")
    ) {
      this.isLoggedIn = true;
      this.userToken = localStorage.getItem("authToken");
    } else if (localStorage.getItem("authToken")) {
      this.userToken = localStorage.getItem("authToken");
    }

    // LANGUAGE DATA
    if(localStorage.getItem("selectedLanguageData")) {
      this.selectedLanguageData = JSON.parse(localStorage.getItem("selectedLanguageData"));  
    }
  }

  // URL FOR API
  // REFER SAMPLE JSON AT BOTTOM FOR DATA VALUES
  get(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.GET, url, data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    });
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.POST, url, data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  put(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.PUT, url, data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  delete(url, data) {
    return new Promise((resolve, reject) => {
      this.api(METHOD.DELETE, url, data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  api(method, url, data) {
    return new Promise((resolve, reject) => {
      // GET THE AUTH TOKEN
      this.getAuthenticationInfo();

      let axiosConfig = {};
      axiosConfig.method = method;
      axiosConfig.url = this.baseURL + url;

      axiosConfig.headers = this.setHeaders(data);
      if (data) {
        if (data.params) axiosConfig.params = data.params;
        if (data.data) axiosConfig.data = data.data;
      }

      axios(axiosConfig)
          .then((response) => {
              
          if (response.data.ResponseException) {
            if(response.data.ResponseException.HasValidationErrors){
              notification.error({
                message: languageLable(this.selectedLanguageData, response.data.ResponseException.ValidationErrors && response.data.ResponseException.ValidationErrors[0].Message),
              });
            } else {
              notification.error({
                message: languageLable(this.selectedLanguageData, response.data.ResponseException.Message),
              });
            }
            return;
          }

          if (
            (response && response.StatusCode >= 400) ||
            response.StatusCode <= 500
          ) {
            notification.error({
              message:
              languageLable(this.selectedLanguageData, response.ResponseException &&
                response.ResponseException.ExceptionMessage),
            });
          } else {
            resolve(response.data);
          }
        })
        .catch((error) => {
            let errorData = JSON.parse(JSON.stringify(error));
            let errorData500 = JSON.parse(JSON.stringify(error.response.data));
            
          if (
            errorData &&
            errorData.message &&
            errorData.message.search("401") !== -1
          ) {
            //notification.error({
            //message: "Your session is expire please login.",
            //});
            //DEFAULT ERROR HANDLING
            //localStorage.clear();
            //window.location = "/account/login";

            //return;
            const authToken = localStorage.getItem("authToken");
            localStorage.removeItem("authToken");
            if (!localStorage.getItem("authToken") && authToken) {
              // GENERATE REFRESH TOKEN
              fetch(`${BASE_URL}RefreshToken?expiredTokenString=${authToken}`, {
                method: "post",
                headers: {
                  Device: localStorage.getItem("deviceToken")
                    ? localStorage.getItem("deviceToken")
                    : this.generateDeviceToken(),
                },
              }).then(async (res) => {
                const content = await res.json();
                if (content.StatusCode === 200 && content.Result) {
                  localStorage.setItem("authToken", content.Result.Token);
                  const tokenData = parseJwt(content.Result.Token);
                  localStorage.setItem("userData", JSON.stringify(tokenData));
                  window.location = "/";
                } else {
                  notification.info({
                    message:
                    languageLable(this.selectedLanguageData, errorData.message ? errorData.message : "Something went wrong. Refreshing the page, Please try again."),
                  });
                  localStorage.clear();
                  window.location = "/";
                }
              });
            }
          } else {
              
              if (errorData500 !== null && errorData500.StatusCode && errorData500.StatusCode === 500 && (url === "AppFirstStart" || (errorData500.ResponseException != null && errorData500.ResponseException.ExceptionMessage.includes("The token is expired"))))
              {
                  localStorage.removeItem("authToken");
                  fetch(`${BASE_URL}AppFirstStart`, {
                      method: "post",
                      headers: {
                          Device: this.generateDeviceToken(),
                      },
                  }).then(async (res) => {
                      const content = await res.json();
                      if (content.StatusCode === 200 && content.Result) {
                          localStorage.setItem("authToken", content.Result.Token);
                          const tokenData = parseJwt(content.Result.Token);
                          localStorage.setItem("userData", JSON.stringify(tokenData));
                          window.location = "/account/login";
                      } else {
                          notification.info({
                              message:
                              languageLable(this.selectedLanguageData, errorData.message ? errorData.message : "Something went wrong. Refreshing the page, Please try again."),
                          });
                          localStorage.clear();
                          window.location = "/account/login";
                      }
                  });
                  notification.error({
                      message: languageLable(this.selectedLanguageData, "Something went wrong! Refreshing the page, Please try again."),
                  });
              } else {
                  if (errorData500 != null && errorData500.ResponseException != null && errorData500.ResponseException.ExceptionMessage != "Shipping not found!") {
                      notification.error({
                          message: languageLable(this.selectedLanguageData, errorData500 != null && errorData500.ResponseException != null && errorData500.ResponseException.ExceptionMessage ? errorData500.ResponseException.ExceptionMessage : "Something went wrong! Please contact support."),
                      });
                  }
                 
              }              
          }
        });
    });
  }

  setHeaders(data) {
    let headers = {};
    headers["accept-language"] = "en";
    headers["Content-Type"] = "application/json";

    if (localStorage.getItem("deviceToken")) {
      headers["Device"] = localStorage.getItem("deviceToken");
    } else {
      headers["Device"] = this.generateDeviceToken();
    }

    if (data) {
      if (data.isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
      }

      if (data.headers) {
        for (var key in data.headers) {
          if (data.headers.hasOwnProperty(key)) {
            headers[key] = data.headers[key];
          }
        }
      }
    }

    if (!(data && data.skipAuth) && this.userToken) {
      headers["Authorization"] = `Bearer ${this.userToken}`;
    }

    return headers;
  }
}

export default API;
