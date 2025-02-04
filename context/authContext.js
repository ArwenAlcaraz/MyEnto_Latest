import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Context
const AuthContext = createContext();

//provider
const AuthProvider = ({ children }) => {
  // Global State
  const [state, setState] = useState({ user: null, token: "" });

  // Initial Local Storage Data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      setState({ ...state, user: loginData?.user, token: loginData?.token });

      if (loginData?.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${loginData.token}`;
      }
    };
    loadLocalStorageData();
  }, []);

  let token = state && state.token;

  // Default Axios Setting
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.baseURL =
    "https://production-myentobackend.onrender.com/api/v1";

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
