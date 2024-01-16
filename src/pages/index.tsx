import React, { useState, useEffect } from 'react';
import NavbarComponent from '../components/Panel/NavbarComponent';
import styled from 'styled-components';
import AdminPanelComponent from '../components/Panel/AdminPanel/AdminPanelComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNavItems,
  selectSelectedModel,
  setSelectedModel,
} from '../redux/models/navItems';
import { selectUser } from '../redux/models/user';
import PanelComponent from '../components/Panel/PanelComponent';

interface MainPageProps {
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const selectedModel = useSelector(selectSelectedModel);
  const navItems = useSelector(selectNavItems);
  const [, setShouldFetchData] = useState(true);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!selectedModel && navItems.length > 0) {
      dispatch(setSelectedModel(navItems[0].model));
    }
  }, [selectedModel, navItems, dispatch]);

  return (
    <MainWrapper>
      <AdminPanelAndContent>
        {user.isAdmin && <AdminPanelComponent />}
        <div className="content">
          <NavbarComponent onLogout={onLogout} />
          <PanelComponent />
        </div>
      </AdminPanelAndContent>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const AdminPanelAndContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
  }
`;

export default MainPage;
