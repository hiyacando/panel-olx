import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  fetchAllUsers,
  deleteUser,
  verifyUser,
} from "../../../../utils/axios-service";
import { FaUserTag, FaUserTimes, FaUserCog } from "react-icons/fa";

interface UserData {
  user_uuid: string;
  email: string;
  role: string;
  avatar: string;
  group: string;
  group_name: string;
}

const UsersTabComponent: React.FC = () => {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean[]>([]);

  useEffect(() => {
    fetchAllUsers()
      .then((data: UserData[]) => {
        setUsersData(data);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });
  }, []);

  const handleDeleteUser = (user_uuid: string) => {
    deleteUser(user_uuid)
      .then(() => {
        const updatedUsersData = usersData.filter(
          (user) => user.user_uuid !== user_uuid,
        );
        setUsersData(updatedUsersData);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleVerifyUser = (user_uuid: string) => {
    verifyUser(user_uuid)
      .then(() => {
        const updatedUsersData = usersData.map((user) => {
          if (user.user_uuid === user_uuid) {
            return { ...user, role: "user" };
          }
          return user;
        });
        setUsersData(updatedUsersData);
        handleMenuToggle(0);
        console.log("User verified successfully");
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
      });
  };
  const handleMenuToggle = (index: number) => {
    const updatedIsMenuOpen = [...isMenuOpen];

    updatedIsMenuOpen[index] = !updatedIsMenuOpen[index];
    for (let i = 0; i < updatedIsMenuOpen.length; i++) {
      if (i !== index) {
        updatedIsMenuOpen[i] = false;
      }
    }
    setIsMenuOpen(updatedIsMenuOpen);
  };
  const handleCopyUserId = async (user_uuid: string) => {
    try {
      await navigator.clipboard.writeText(user_uuid);
      console.log("User ID copied to clipboard:", user_uuid);
    } catch (error) {
      console.error("Error copying user ID to clipboard:", error);
    }
  };
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Awatar</TableHeader>
            <TableHeader>Adres Email</TableHeader>
            <TableHeader>Rola</TableHeader>
            <TableHeader>Grupa</TableHeader>
            <TableHeader>Akcja</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user, index) => (
            <TableRow key={user.user_uuid}>
              <TableData>
                <Avatar src={user.avatar} />
              </TableData>
              <TableData
                onClick={() => handleCopyUserId(user.user_uuid)}
                className="hover-pointer"
              >
                {user.email}{" "}
              </TableData>
              <TableData>{user.role}</TableData>
              <TableData>{user.group_name}</TableData>
              <TableData>
                <ButtonGroup>
                  <Button onClick={() => handleMenuToggle(index)}>
                    <FaUserCog size={25} />
                  </Button>
                  {isMenuOpen[index] && (
                    <MenuWrapper>
                      <Button
                        onClick={() => {
                          handleDeleteUser(user.user_uuid);
                          handleMenuToggle(index);
                        }}
                      >
                        <FaUserTimes size={20} />
                      </Button>
                      <Button onClick={() => handleVerifyUser(user.user_uuid)}>
                        <FaUserTag size={20} />
                      </Button>
                    </MenuWrapper>
                  )}
                </ButtonGroup>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
const MenuWrapper = styled.div`
  position: fixed;
  display: inline-block;
  margin-left: 0.5rem;
`;
const ButtonGroup = styled.div`
  align-items: center;
`;
const Button = styled.button`
  background: none;
  border: none;
  color: #212529;
  padding: 0.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;
const Avatar = styled.img`
  width: 2rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
`;
const TableData = styled.td`
  color: #212529;
  text-align: center;
  padding: 0;
  line-height: 1.35rem;
  padding: 0 0.5rem;
  &.hover-pointer:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
  }
`;
const TableBody = styled.tbody``;
const TableHeader = styled.th`
  margin-bottom: 1rem;
`;

const TableRow = styled.tr`
  border-radius: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;
const TableHead = styled.thead`
  color: #212529;
  text-align: center;
  z-index: 1001;
`;
const Table = styled.table`
  margin-left: auto;
  margin-right: auto;
  border-spacing: 0;
`;
export default UsersTabComponent;
