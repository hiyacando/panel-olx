import { useState } from "react";
import styled from "styled-components";
import "animate.css";
import UsersTabComponent from "./tabs/UsersTabComponent";
import BookmarksTabComponent from "./tabs/BookmarksTabComponent";
import StatsTabComponent from "./tabs/StatsTabComponent";

interface AdminPanelComponentProps {
  token: string | null;
  userID: string | null;
}

const AdminPanelComponent: React.FC<AdminPanelComponentProps> = () => {
  const [activeTab, setActiveTab] = useState('Users');




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
              <NavItem isActive={activeTab === "Bookmarks"}
                onClick={() => setActiveTab("Bookmarks")}>Zakładki</NavItem>
              <NavItem
                isActive={activeTab === "Statistics"}
                onClick={() => setActiveTab("Statistics")}
              >Statystyki</NavItem>



            </NavFrame>
          </NavWrapper>
          {activeTab === "Users" && <UsersTabComponent />}
          {activeTab === "Bookmarks" && <BookmarksTabComponent />}
          {activeTab === "Statistics" && <StatsTabComponent />}


        </Wrapper>
      </HeroMain>

    </>
  );
};

// const SubMenu = styled.ul<{ isActive: boolean }>`
//   display: ${({ isActive }) => (isActive ? "block" : "none")};
//   list-style-type: none;
//   padding: 0.5rem 0.2rem;
//   margin-top: 2.6rem;
//   position: absolute;
//   background-color: rgba(0, 0, 0, 0.9);
//   border-radius: 0 0 0.6rem 0.6rem;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//   z-index: 1;
// `;

// const SubNavItem = styled.li<{ isActive: boolean }>`
//   color: ${({ isActive }) => (isActive ? "violet" : "white")};
//   font-size: 1rem;

//   &:hover {
//     color: violet;
//     background-color: rgba(255, 255, 255, 0.1);
//     cursor: pointer;
//     border-radius: 0.5rem;
//   }
// `;
const NavItem = styled.li<{ isActive: boolean }>`
  margin: 0;
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  gap: 3rem;
  padding: 0 1.5rem;
  line-height: 2.5rem;
  color: ${({ isActive }) => (isActive ? "violet" : "white")};
  border-bottom: ${({ isActive }) => (isActive ? "2px solid violet" : "none")};
  &:hover {
    color: violet;
    cursor: pointer;
  }
  &:active {
    color: violet;
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
  background: rgba(27, 27, 27, 0.56);
  border-radius: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(0.7px);
  -webkit-backdrop-filter: blur(0.7px);
  border: 1px solid rgba(27, 27, 27, 0.15);
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  animation: zoomIn 0.7s;
  transition: all 0.3s ease;
  min-width: 20rem;
  max-width: 25rem;
  width: 100%;
  margin-left: 1rem;
  
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: solid 1px #2a2a2f;
  margin: 0;
  align-self: center;
  text-align: center;
`;

export default AdminPanelComponent;
