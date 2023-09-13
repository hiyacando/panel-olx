import axiosInstance from "./axios-config";

export const registerUser = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:2137/auth/register",
      values,
    );

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
    const response = await axiosInstance.post(
      "http://localhost:2137/auth/login",
      values,
    );

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
      const response = await axiosInstance.get("/auth/get_user_info");
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

export const fetchNavItems = async () => {
  try {
    const response = await axiosInstance.get("/scraper/urls");
    return response.data;
  } catch (error) {
    console.error("Error fetching urls:", error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/auth/get_user_info");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const recordClick = async (userID: string | null, link: string) => {
  try {
    await axiosInstance.post("/scraper/record_click", {
      user_id: userID,
      link: link,
    });
  } catch (error) {
    console.error("Error recording click:", error);
    throw error;
  }
};
export const scrapeData = async () => {
  try {
    const response = await axiosInstance.post("/scraper/scrape_data");
    return response.data;
  } catch (error) {
    console.error("Error scraping data:", error);
    throw error;
  }
};
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/auth/get_all_users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
export const deleteUser = async (userID: string) => {
  try {
    const response = await axiosInstance.post("/auth/delete_user", {
      user_id: userID,
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
export const fetchUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/auth/get_user_by_id/${userId}`);
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
