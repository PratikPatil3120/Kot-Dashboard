import { create } from "zustand";

const LOCAL_STORAGE_KEY = "kot_user";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || null, // read on load

  login: (role, password) => {
    let name = "";

    if (role === "chef" && password === "chef@123") name = "Chef User";
    else if (role === "manager" && password === "manager@123")
      name = "Manager User";
    else return false;

    const user = { name, role };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user)); // persist
    set({ user });
    return true;
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY); // remove on logout
    set({ user: null });
  },

  getUserFromStorage: () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || null;
  },
}));
