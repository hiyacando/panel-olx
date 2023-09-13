import { useState, useEffect } from "react";
import SignInComponent from "./components/Authorization/SignInComponent";
import RegisterComponent from "./components/Authorization/RegisterComponent";
import PanelComponent from "./components/Panel/PanelComponent";
import styled from "styled-components";
import AdminPanelComponent from "./components/Panel/AdminPanel/AdminPanelComponent";
import { useDispatch, useSelector } from "react-redux";
import { setShouldFetchDataTrue } from "./redux/models/navItems";
import { setUser, selectUser } from "./redux/models/user";
import { fetchUserInfo } from "./utils/axios-service";

const App = () => {
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem("authToken");
  const [token, setToken] = useState<string | null>(storedToken);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const user = useSelector(selectUser);
  const [activeComponent, setActiveComponent] = useState<"SignIn" | "Register">(
    "SignIn",
  );

  useEffect(() => {
    if (token) {
      fetchUserInfo()
        .then((response) => {
          const { email, user_id, role, avatar } = response;
          const isAdmin = role === "admin";
          dispatch(setUser({ email, user_id, role, avatar, isAdmin }));
          setIsTokenValid(true);
        })
        .catch((error) => {
          console.error(error);
          setIsTokenValid(false);
        });
    }
  }, [token, dispatch]);

  const handleLogin = (receivedToken: string) => {
    setToken(receivedToken);
    localStorage.setItem("authToken", receivedToken);
    dispatch(setShouldFetchDataTrue());
  };

  const handleLogout = () => {
    setToken(null);
    setIsTokenValid(false);
    localStorage.removeItem("authToken");
  };
  return (
    <>
      {activeComponent === "SignIn" && (
        <>
          {!isTokenValid ? (
            <SignInComponent
              onLogin={handleLogin}
              onNavRegister={() => setActiveComponent("Register")}
            />
          ) : (
            <Wrapper>
              <PanelComponent token={token} onLogout={handleLogout} />
              {user.isAdmin && (
                <AdminPanelComponent token={token} userID={user.user_id} />
              )}
            </Wrapper>
          )}
        </>
      )}

      {activeComponent === "Register" && (
        <RegisterComponent
          onRegister={() => setActiveComponent("SignIn")}
          onNavLogin={() => setActiveComponent("SignIn")}
        />
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default App;
