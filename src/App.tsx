import { useState, useEffect } from 'react';
import SignInComponent from './components/SignIn/SignInComponent';
import RegisterComponent from './components/SignIn/RegisterComponent';
import PanelComponent from './components/Panel/PanelComponent';
import styled from 'styled-components';
import AdminPanelComponent from './components/Panel/AdminPanel/AdminPanelComponent';
import { useDispatch } from 'react-redux';
import { setShouldFetchDataTrue } from './redux/models/navItems';
import { fetchUserInfo, checkUserRole } from './utils/axios-service';

const App = () => {
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem('authToken');
  const [token, setToken] = useState<string | null>(storedToken);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<'SignIn' | 'Register'>('SignIn');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserInfo()
        .then((response) => {
          setUserEmail(response.email);
          setUserID(response.user_id);
          setUserRole(response.role);
          setUserAvatar(response.avatar);
          setIsTokenValid(true);


          checkUserRole(response.role)
            .then(userIsAdmin => {
              setIsAdmin(userIsAdmin);
              setIsAdminChecked(true);
            })
            .catch(error => {
              console.error(error);
              setIsAdmin(false);
              setIsAdminChecked(true);
            });
        })
        .catch(error => {
          console.error(error);
          setIsTokenValid(false);
        });
    }
  }, [token]);


  const handleLogin = (receivedToken: string) => {
    setToken(receivedToken);
    localStorage.setItem('authToken', receivedToken);
    dispatch(setShouldFetchDataTrue());

  };

  const handleLogout = () => {
    setToken(null);
    setUserID(null);
    setUserAvatar(null);
    setIsTokenValid(false);
    localStorage.removeItem('authToken');
  };

  return (
    <>
      {activeComponent === 'SignIn' && (
        <>
          {!isTokenValid ? (
            <SignInComponent onLogin={handleLogin} onNavRegister={() => setActiveComponent('Register')} />
          ) : (
            <Wrapper>
              {isAdminChecked ? (
                <>
                  <PanelComponent userAvatar={userAvatar} token={token} userID={userID} userEmail={userEmail} userRole={userRole} onLogout={handleLogout} />
                  {isAdmin && <AdminPanelComponent token={token} userID={userID} />}
                </>
              ) : (
                <>Weryfikacja danych...</>
              )}
            </Wrapper>

          )}

        </>
      )}

      {activeComponent === 'Register' && (
        <RegisterComponent onRegister={() => setActiveComponent('SignIn')} onNavLogin={() => setActiveComponent('SignIn')} />)}
    </>
  );
};

const Wrapper = styled.div`
display: flex;
justify-content: space-between;
`;

export default App;