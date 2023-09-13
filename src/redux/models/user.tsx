import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
  email: string | null;
  user_id: string | null;
  role: string | null;
  avatar: string | null;
  isAdmin: boolean;
}

const initialState: UserState = {
  email: null,
  user_id: null,
  role: null,
  avatar: null,
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const { email, user_id, role, avatar } = action.payload;
      const isAdmin = role === "admin";

      return { ...state, email, user_id, role, avatar, isAdmin };
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
