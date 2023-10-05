import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
type Bookmark = {
  id: number;
  model: string;
  title: string;
  user_bookmarks: string;
};

interface UserState {
  email: string | null;
  user_uuid: string | null;
  role: string | null;
  avatar: string | null;
  group: string | null;
  group_name: string | null;
  isAdmin: boolean;
  isVerifed: boolean;
  user_bookmarks: Bookmark[] | null;
}

const initialState: UserState = {
  email: null,
  user_uuid: null,
  role: null,
  avatar: null,
  group: null,
  group_name: null,
  isAdmin: false,
  isVerifed: false,
  user_bookmarks: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const {
        email,
        user_uuid,
        role,
        avatar,
        group,
        group_name,
        user_bookmarks,
      } = action.payload;
      const isAdmin = role === "admin";
      const isVerifed = role === "user" || role === "admin";

      return {
        ...state,
        email,
        user_uuid,
        role,
        avatar,
        group,
        group_name,
        user_bookmarks,
        isAdmin,
        isVerifed,
      };
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
