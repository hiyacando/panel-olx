import { useState } from "react";
import styled from "styled-components";
import UsersTabComponent from "./tabs/UsersTabComponent";
import BookmarksTabComponent from "./tabs/BookmarksTabComponent";
import StatsTabComponent from "./tabs/StatsTabComponent";
import GroupsTabComponent from "./tabs/GroupsTabComponent";

const AdminPanelComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <>
      <HeroMain>
        <Title>PANEL ADMINISTRATORA</Title>
        <Wrapper>
          <NavWrapper>
            <NavFrame>
              <NavItem
                isActive={activeTab === "Users"}
                onClick={() => setActiveTab("Users")}
              >
                Użytkownicy
              </NavItem>
              <NavItem
                isActive={activeTab === "Bookmarks"}
                onClick={() => setActiveTab("Bookmarks")}
              >
                Zakładki
              </NavItem>
              <NavItem
                isActive={activeTab === "Statistics"}
                onClick={() => setActiveTab("Statistics")}
              >
                Statystyki
              </NavItem>
              <NavItem
                isActive={activeTab === "Groups"}
                onClick={() => setActiveTab("Groups")}
              >
                Grupy
              </NavItem>
            </NavFrame>
          </NavWrapper>
          {activeTab === "Users" && <UsersTabComponent />}
          {activeTab === "Bookmarks" && <BookmarksTabComponent />}
          {activeTab === "Statistics" && <StatsTabComponent />}
          {activeTab === "Groups" && <GroupsTabComponent />}
        </Wrapper>
      </HeroMain>
    </>
  );
};

const NavItem = styled.li<{ isActive: boolean }>`
  margin: 0;
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  gap: 3rem;
  padding: 0 1.5rem;
  line-height: 2.5rem;
  font-size: 0.9rem;
  color: ${({ isActive }) => (isActive ? "#212529" : "#212529")};
  border-bottom: ${({ isActive }) => (isActive ? "2px solid #212529" : "none")};
  &:hover {
    color: #212529;
    cursor: pointer;
  }
  &:active {
    color: #cb8849;
  }
`;
const NavFrame = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
`;
const NavWrapper = styled.div``;
const Wrapper = styled.div``;

const HeroMain = styled.div`
  background: #cb8849;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  animation: ease-in-out 0.7s;
  transition: all 0.3s ease;
  min-width: 20rem;
  max-width: 25rem;
  width: 100%;
  z-index: 1001;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  @media(max-width:1140px){
    display: none;
  }
  `;

const Title = styled.div`
  color: #212529;
  font-weight: 600;
  font-size: 1rem;
  
  margin: 0;
  align-self: center;
  text-align: center;
`;

export default AdminPanelComponent;
