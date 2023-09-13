import { combineReducers } from "@reduxjs/toolkit";
import navItemsReducer from "./models/navItems";
import userReducer from "./models/user";

const rootReducer = combineReducers({
  navItems: navItemsReducer,
  user: userReducer,
});

export default rootReducer;
