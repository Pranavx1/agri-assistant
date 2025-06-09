import { atom, selector } from "recoil";

const API_URL = "http://localhost:3001/api";

// Initialize auth state from localStorage if available
const initializeAuthState = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return {
        user: JSON.parse(storedUser),
        loading: false,
        error: null,
      };
    }
  }
  return {
    user: null,
    loading: false,
    error: null,
  };
};

export const authState = atom({
  key: "authState",
  default: initializeAuthState(),
});

export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const auth = get(authState);
    return !!auth.user;
  },
});

export const authActions = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      throw err;
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      throw err;
    }
  },
};
