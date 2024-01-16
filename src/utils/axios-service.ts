import axiosInstance from "./axios-config";
interface Bookmark {
  bookmark_uuid: string;
  model: string;
  url: string;
  title: string;
}

export const registerUser = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/register", values);

    if (response.status === 200) {
      return true;
    } else {
      const data = response.data;
      console.error("Registration failed:", data.error);
      return false;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};
export const login = async (values: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/auth/login", values);

    if (response.status === 200) {
      const token = response.data.token;
      return token;
    } else {
      console.error("Login failed:", response.data.error);
      throw new Error("Niepoprawne dane");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const checkUserRole = async (token: string | null) => {
  try {
    if (token) {
      const response = await axiosInstance.get("/user/get_user_info");
      const userRole = response.data.role;
      return userRole === "admin";
    }
    return false;
  } catch (error) {
    console.error("Error while fetching user info:", error);
    return false;
  }
};
export const fetchProductsData = async (model: string) => {
  try {
    const response = await axiosInstance.get(`/scraper/products/${model}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/get_user_info");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const recordClick = async (user_uuid: string | null, link: string) => {
  try {
    await axiosInstance.post("/scraper/record_click", {
      user_uuid: user_uuid,
      link: link,
    });
  } catch (error) {
    console.error("Error recording click:", error);
    throw error;
  }
};
export const scrapeData = async (selectedModel: string) => {
  try {
    const response = await axiosInstance.post("/scraper/scrape_data", { selected_model: selectedModel });
    return response.data;
  } catch (error) {
    console.error("Error scraping data:", error);
    throw error;
  }
};
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/user/get_all_users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
export const deleteUser = async (user_uuid: string) => {
  try {
    const response = await axiosInstance.post("/user/delete_user", {
      user_uuid: user_uuid,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
export const fetchAllClicks = async () => {
  try {
    const response = await axiosInstance.get("/scraper/recorded_clicks");
    return response.data;
  } catch (error) {
    console.error("Error fetching all click data:", error);
    throw error;
  }
};
export const fetchUserById = async (user_uuid: string) => {
  try {
    const response = await axiosInstance.get(
      `/user/get_user_by_id/${user_uuid}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
export const fetchProductStatus = async (link: string) => {
  try {
    const response = await axiosInstance.get(`/scraper/product_status/${link}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product status:", error);
    throw error;
  }
};
export const verifyUser = async (user_uuid: string) => {
  try {
    const response = await axiosInstance.post(`/user/verify_user/${user_uuid}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};
export const createGroup = async (groupName: string) => {
  try {
    const response = await axiosInstance.post("/group/create_group", {
      group_name: groupName,
    });

    if (response.status === 201) {
      const groupData = response.data;
      return groupData;
    } else {
      console.error("Group creation failed:", response.data.error);
      throw new Error("Failed to create group");
    }
  } catch (error) {
    console.error("Error during group creation:", error);
    throw error;
  }
};
export const addMemberToGroup = async (groupID: string, user_uuid: string) => {
  try {
    const response = await axiosInstance.post(
      `/group/add_user_to_group/${groupID}/${user_uuid}`,
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error("Adding user to group failed:", response.data.error);
      return false;
    }
  } catch (error) {
    console.error("Error adding user to group:", error);
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const response = await axiosInstance.get("/group/get_all_groups");
    return response.data;
  } catch (error) {
    console.error("Error fetching all groups:", error);
    throw error;
  }
};
export const changeMemberRole = async (
  group_uuid: string,
  user_uuid: string,
  newRole: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/group/change_member_role/${group_uuid}/${user_uuid}/${newRole}`,
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error("Changing member role failed:", response.data.error);
      return false;
    }
  } catch (error) {
    console.error("Error changing member role:", error);
    throw error;
  }
};
export const deleteGroup = async (group_uuid: string) => {
  try {
    const response = await axiosInstance.delete(
      `/group/delete_group/${group_uuid}`,
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error("Deleting group failed:", response.data.error);
      return false;
    }
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};
export const getGroupName = async (group_uuid: string) => {
  try {
    const response = await axiosInstance.get(`/group/get_group/${group_uuid}`);
    if (response.status === 200) {
      return response.data.name;
    } else {
      console.error(
        "Błąd podczas pobierania nazwy grupy:",
        response.data.error,
      );
      return null;
    }
  } catch (error) {
    console.error("Błąd podczas pobierania nazwy grupy:", error);
    return null;
  }
};
export const addURL = async (newUrl: {
  model: string;
  url: string;
  title: string;
}) => {
  try {
    const response = await axiosInstance.post("/bookmark/add_bookmark", newUrl);

    if (response.status === 201) {
      return true;
    } else {
      console.error("Adding URL to database failed:", response.data.error);
      return false;
    }
  } catch (error) {
    console.error("Error adding URL to database:", error);
    throw error;
  }
};
export const fetchAllUrls = async (): Promise<Bookmark[]> => {
  try {
    const response = await axiosInstance.get<Bookmark[]>(
      "/bookmark/get_all_bookmarks",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching urls:", error);
    throw error;
  }
};
export const associateUrlWithUser = async (
  user_uuid: string,
  bookmark_uuid: string,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<{ error?: string }>(
      "/bookmark/associate_bookmark",
      { user_uuid, bookmark_uuid },
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error(
        "Associating Bookmark with user failed:",
        response.data.error,
      );
      return false;
    }
  } catch (error) {
    console.error("Error associating Bookmark with user:", error);
    throw error;
  }
};
