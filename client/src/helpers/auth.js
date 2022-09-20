import cookie from "js-cookie";

// set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      // 1 Day
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      // 1 Day
      expires: 1,
    });
  }
};

// get from cookie such as token
export const getCookie = (key) => {
  if (window !== "undefined") {
    cookie.get(key, {
      // 1 Day
      expires: 1,
    });
  }
};

// set in localStorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(
      key,
      value instanceof String ? JSON.stringify(value) : value
    );
  }
};

// remove from localStorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// auth user after login
export const authenticate = (response) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", JSON.stringify(response.data.user));
  // next();
};

// signout
export const signout = () => {
  removeCookie("token");
  removeLocalStorage("token");
};

// get user info from localstorage
export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};
export const updateUser = (response, next) => {
  if (window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response;
    localStorage.setItem(
      "user",
      auth instanceof String ? JSON.stringify(auth) : auth
    );
    next();
  }
};
