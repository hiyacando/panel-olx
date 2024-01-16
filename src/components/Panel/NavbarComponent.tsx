import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/models/user";
import {FaAngleDown} from 'react-icons/fa'

interface NavbarComponentProps {
  onLogout: () => void;
}

const NavbarComponent: React.FC<NavbarComponentProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setShouldFetchData] = useState(true);
  const user = useSelector(selectUser);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setShouldFetchData(false);
    }
  };

  return (
    <>
        <NavbarWrapper>
          <UserWrapper>
            
            <div className="user">
              <text className="bold userMenu">         
                {user.email}
              </text>
              <text className="light">{user.group_name}</text>
              
            </div>
            <div className="userAvatar" onClick={handleMenuToggle}  >

            <img className="avatar" src={user.avatar!} />
            <FaAngleDown size="0.75rem" className="angleDownIcon"/>
            {isMenuOpen && (
                  <UserMenu>
                    <ul className="modal">
                    {user.isAdmin && <li>Panel</li>}
                      <li>Ustawienia</li>
                      <li>Informacje</li>
                      <li onClick={onLogout}>
                        Wyloguj się
                      </li>
                    </ul>
                  </UserMenu>
                )}
            </div>


          </UserWrapper>

        </NavbarWrapper>

    </>
  );
};
const UserMenu = styled.div`
  position: absolute;
  inset: 100% 0 auto auto;
  z-index: 1001;
    background: #e9ecef;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  user-select: none;

  ul.modal {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  li {
    display: flex;
    font-weight: 500;
    color: #212529;
    padding: 0.5rem;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
    }
  }
`;

const NavbarWrapper = styled.div`
  padding: 0.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #cb8849;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
    flex: 1;
    flex-grow: 1;
    max-height: 2.5rem;
  div.sidebarOptions {
    h1 {
      color: skyblue;
      font-size: 2rem;
      padding: 0;
      margin: 0;
    }
  }

  div.border {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    border-bottom: solid 1px #ced4da;
  }
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: default;

  .user {
    display: flex;
    flex-direction: column;
  }

  .userData {
  }

  text.userMenu {
    user-select: none;
    position: relative;
    
  }

  text {
    color: #212529;
    user-select: none;
    font-size: 0.9rem;
  }

  text.light {
    color: #212529;
  }

  text.bold {
    font-weight: 600;
  }

  text.light.userRole {}

  div.userAvatar {
    position: relative;
    display: flex;
    align-items: center;
    .angleDownIcon:hover{
      cursor: pointer;
    }
  }

  img.avatar {
    width: 2.4em;
    height: 2.4em;
    margin-left: 0.5rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2rem;
    user-select: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }
  }
`;
export default NavbarComponent;
