import { useState } from "react";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import {
  selectNavItems,
  selectSelectedModel,
  setSelectedModel,
} from "../../redux/models/navItems";


const BookmarkNavComponent = () => {
    const dispatch = useDispatch();
    const selectedModel = useSelector(selectSelectedModel);
    const navItems = useSelector(selectNavItems);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [, setShouldFetchData] = useState(true);
  
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


    const visibleNavItems = navItems.slice(0, 3);

  return (
    <>

<BookmarksNav >
    <div className="navWrapper">
      
          <ul>
          {visibleNavItems.map((navItem, index) => (

            <NavItem key={index}
            onClick={() => handleModelClick(navItem.model)}
            isActive={selectedModel === navItem.model}

          >{navItem.title}</NavItem>

            ))}
                          <NavItem className="other" onClick={handleMenuToggle} isActive={isMenuOpen}>
                Inne
                {isMenuOpen && (
                  <SubMenuWrapper>
                  <SubMenu isActive={isMenuOpen}>
                    {navItems.slice(3).map((navItem, index) => (
                      <SubNavItem
                        key={index}
                        onClick={() => {
                          handleModelClick(navItem.model);
                          if (!isMenuOpen) {
                            setShouldFetchData(true);
                          }
                        }}
                        isActive={selectedModel === navItem.model}
                      >
                        {navItem.title}
                      </SubNavItem>
                    ))}
                  </SubMenu>
                  </SubMenuWrapper>
                )}
              </NavItem>
              <NavItem className="newTab" isActive={selectedModel === navItems.model}>
                NOWA ZAKŁADKA
              </NavItem>
          </ul>

        </div>

    </BookmarksNav>
    </>
  )
}
const SubMenuWrapper = styled.div`
position: relative;
margin: 0;
padding: 0;
`
const SubMenu = styled.ul<{ isActive: boolean }>`
  position: absolute;
  inset: 100% 0 auto auto;
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  background: #e9ecef;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  user-select: none;
  z-index: 1111;
  padding: 0;
  margin: 0;
  list-style: none; 
  width: 8rem;
  
`;

const SubNavItem = styled.li<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? "violet" : "#212529")};
  font-size: 0.9rem; 
  padding: 0.5rem 1.2rem; /* Adjust the padding as needed */
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;
const BookmarksNav = styled.div`
padding: 0;
margin: 0;
flex: 0 0 auto;
width: auto;
position: sticky;
top: 0;
margin-left: 1.5rem;
margin-right: 1.5rem;
div.navWrapper{
  ul{

    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
    .newTab{
    margin-left: auto;
    }
    .other{
      margin-left: 0.5rem;
    }

  }
  }

`
const NavItem = styled.li<{ isActive: boolean }>`
user-select: none;

  margin: 0;
  display: flex;
  list-style-type: none;
  padding: 0 0.5rem;
  line-height: 2.5rem;
  font-size: 0.9rem;

  color: #212529;
  font-weight: ${({ isActive }) => (isActive ? "600" : "500")};
  border-bottom: ${({ isActive }) => (isActive ? "2px solid #cb8849" : "none")};
  &:hover {
    cursor: pointer;
  }

`;

export default BookmarkNavComponent