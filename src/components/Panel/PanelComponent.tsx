import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ScrapeButtonComponent from "./ScrapeButtonComponent";
import SignOutButtonComponent from "../Authorization/SignOutButtonComponent";
import DataTable from "./DataTableComponent";
import "animate.css";
import { fetchNavItems } from "../../utils/axios-service";
import {
  selectNavItems,
  selectSelectedModel,
  setSelectedModel,
  setNavItems,
} from "../../redux/models/navItems";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/models/user";

interface PanelComponentProps {
  onLogout: () => void;
}

const PanelComponent: React.FC<PanelComponentProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const selectedModel = useSelector(selectSelectedModel);
  const navItems = useSelector(selectNavItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setShouldFetchData] = useState(true);
  const user = useSelector(selectUser);

  const handleModelClick = (model: string) => {
    if (model !== selectedModel) {
      setShouldFetchData(true);
      dispatch(setSelectedModel(model));
    }
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setShouldFetchData(false);
    }
  };

  const visibleNavItems = navItems.slice(0, 4);

  useEffect(() => {
    fetchNavItems()
      .then((navItemsData) => {
        dispatch(setNavItems(navItemsData));
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
      });
  }, [dispatch]);

  return (
    <>
      <HeroMain>
        <Title>PANEL OGŁOSZEŃ</Title>
        <Wrapper>
          <MenuContainer>
            <UserWrapper>
              <Avatar src={user.avatar!} />
              <UserInfo>
                <UserName>{user.email}</UserName>
                <UserRole>{user.role}</UserRole>
                <SignOutButtonComponent onLogout={onLogout} />
              </UserInfo>
            </UserWrapper>
          </MenuContainer>
          <NavWrapper>
            <NavFrame>
              {visibleNavItems.map((navItem, index) => (
                <NavItem
                  key={index}
                  onClick={() => handleModelClick(navItem.file_name)}
                  isActive={selectedModel === navItem.file_name}
                >
                  {navItem.title}
                </NavItem>
              ))}
              <NavItem onClick={handleMenuToggle} isActive={isMenuOpen}>
                Inne
                {isMenuOpen && (
                  <SubMenu isActive={isMenuOpen}>
                    {navItems.slice(4).map((navItem, index) => (
                      <SubNavItem
                        key={index}
                        onClick={() => {
                          handleModelClick(navItem.file_name);
                          if (!isMenuOpen) {
                            setShouldFetchData(true);
                          }
                        }}
                        isActive={selectedModel === navItem.file_name}
                      >
                        {navItem.title}
                      </SubNavItem>
                    ))}
                  </SubMenu>
                )}
              </NavItem>

              <ScrapeButtonComponent />
            </NavFrame>
          </NavWrapper>
          <DataTable />
        </Wrapper>
      </HeroMain>
    </>
  );
};
const MenuContainer = styled.div`
  position: fixed;
  flex-direction: column;
  float: left;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserRole = styled.span`
  color: #ffffff;
`;
const UserName = styled.span`
  color: #ffffff;
`;
const UserWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;
const Avatar = styled.img`
  width: 3.5rem;
  margin-right: 0.5rem; /* Dodaj odstęp od prawej strony avatara */
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
`;

const SubMenu = styled.ul<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  list-style-type: none;
  padding: 0.5rem 0.2rem;
  margin-top: 2.6rem;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 0 0 0.6rem 0.6rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const SubNavItem = styled.li<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? "violet" : "white")};
  font-size: 1rem;

  &:hover {
    color: violet;
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    border-radius: 0.5rem;
  }
`;
const NavItem = styled.li<{ isActive: boolean }>`
  margin: 0;
  display: flex;
  list-style-type: none;
  padding: 0;

  gap: 3rem;
  padding: 0 2rem;
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
  align-items: center;
`;
const NavWrapper = styled.div``;
const Wrapper = styled.div`
  margin-top: 1rem;
  display: flex-start;
  justify-content: center;
`;

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
  min-width: 70rem;
  width: 100%;
  display: block;
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

export default PanelComponent;
