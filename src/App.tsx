import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShouldFetchDataTrue, setNavItems } from "./redux/models/navItems";
import { setUser, selectUser } from "./redux/models/user";
import { fetchUserInfo } from "./utils/axios-service";
import SignInComponent from "./components/Authorization/SignInComponent";
import RegisterComponent from "./components/Authorization/RegisterComponent";
import PanelComponent from "./components/Panel/PanelComponent";
import styled from "styled-components";
import AdminPanelComponent from "./components/Panel/AdminPanel/AdminPanelComponent";
import Cookies from "js-cookie";
import SignOutButtonComponent from "./components/Authorization/SignOutButtonComponent";

const App = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get("authToken") || null;
  });
  const [isTokenValid, setIsTokenValid] = useState(false);
  const user = useSelector(selectUser);
  const [activeComponent, setActiveComponent] = useState<"SignIn" | "Register">(
    "SignIn",
  );

  useEffect(() => {
    if (token) {
      fetchUserInfo()
        .then((response) => {
          const {
            email,
            user_uuid,
            role,
            avatar,
            group,
            group_name,
            user_bookmarks,
          } = response;
          const isAdmin = role === "admin";
          const isVerifed = role === "user";

          dispatch(
            setUser({
              email,
              user_uuid,
              role,
              avatar,
              group,
              group_name,
              isAdmin,
              isVerifed,
              user_bookmarks,
            }),
          );

          if (user_bookmarks) {
            dispatch(setNavItems(user_bookmarks));
          }

          setIsTokenValid(true);
        })
        .catch((error) => {
          console.error(error);
          setIsTokenValid(false);
        });
    }
  }, [token, dispatch]);

  const handleLogin = (receivedToken: string) => {
    Cookies.set("authToken", receivedToken, { expires: 1 });
    setToken(receivedToken);
    dispatch(setShouldFetchDataTrue());
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setToken(null);
    setIsTokenValid(false);
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
              {user.isVerifed ? (
                <PanelComponent onLogout={handleLogout} />
              ) : (
                <Unverifed>
                  Oczekiwanie na weryfikacje konta.
                  <SignOutButtonComponent onLogout={handleLogout} />
                </Unverifed>
              )}

              {user.isAdmin && <AdminPanelComponent />}
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
const Unverifed = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default App;
