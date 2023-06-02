export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const prepareAddressData = (address) => {
  let addressPayload = null;
  if (address) {
    addressPayload = {};
    if (address.address_components) {
      address.address_components.forEach((item) => {
        // City
        if (item.types.includes("administrative_area_level_2")) {
          addressPayload.city = item.long_name;
        }

        // State
        if (item.types.includes("administrative_area_level_1")) {
          addressPayload.state = item.long_name;
        }

        // Country
        if (item.types.includes("country")) {
          addressPayload.country = item.long_name;
        }

        // postal code
        if (item.types.includes("postal_code")) {
          addressPayload.pin = item.long_name;
        }
      });
    }

    if (address.latLng) {
      addressPayload.latitude = address.latLng.lat;
      addressPayload.longitude = address.latLng.lng;
    }

    if (address.formatted_address) {
      addressPayload.addressLine2 = address.formatted_address;
    }
    addressPayload.isDefault = true;
  }

  return addressPayload;
};

export const languageLable = (data, key) => {
    var splitVal = "";
    if (String(key).includes(" / ORD")) {
        var splitArr = String(key).split(" / ");
        key = splitArr[0];
        splitVal = splitArr[1];
    }
    if (data[String(key) && String(key).toLowerCase()]) {
        if (splitVal !== "") {
            return data[key && key.toLowerCase()] + " / " + splitVal;    
        }
        return data[key && key.toLowerCase()];
    }
    return key;
};

export const validatePassword = (p) => {
  let errors = [];
  if (
    p.search(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/
    )
  ) {
    errors.push(
      "Your password length should be 6 to 20 characters & must contain 1-Uppercase, Lowercase, Numeric and Special Character"
    );
  }
  return errors;
};
