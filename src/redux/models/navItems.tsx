import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface NavItem {
  id: number;
  url: string;
  file_name: string;
  title: string;
}

interface NavItemsState {
  navItems: NavItem[];
  selectedModel: string;
  shouldFetchData: boolean;
}

const initialState: NavItemsState = {
  navItems: [],
  selectedModel: "iphone-11-pro",
  shouldFetchData: true,
};

const navItemsSlice = createSlice({
  name: "navItems",
  initialState,
  reducers: {
    setNavItems: (state, action: PayloadAction<NavItem[]>) => {
      state.navItems = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
      state.shouldFetchData = true;
    },
    setShouldFetchData: (state, action: PayloadAction<boolean>) => {
      state.shouldFetchData = action.payload;
    },
    setShouldFetchDataTrue: (state) => {
      state.shouldFetchData = true;
    },
  },
});

export const {
  setNavItems,
  setSelectedModel,
  setShouldFetchData,
  setShouldFetchDataTrue,
} = navItemsSlice.actions;

export const selectNavItems = (state: RootState) => state.navItems.navItems;
export const selectSelectedModel = (state: RootState) =>
  state.navItems.selectedModel;

export default navItemsSlice.reducer;
