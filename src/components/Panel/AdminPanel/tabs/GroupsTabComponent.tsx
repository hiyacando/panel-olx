import React, { useState, useEffect } from "react";
import {
  createGroup,
  getAllGroups,
  addMemberToGroup,
  deleteGroup,
} from "../../../../utils/axios-service";
import styled from "styled-components";
import copy from "copy-to-clipboard";

const GroupsTabComponent: React.FC = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [groups, setGroups] = useState<any[]>([]);

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const groupData = await createGroup(groupName);

      if (groupData) {
        console.log("Grupa została utworzona:", groupData);
        setGroupName("");
        updateGroupList();
      }
    } catch (error) {
      console.error("Błąd podczas tworzenia grupy:", error);
    }
  };

  const handleAddUserToGroup = async (groupId: string) => {
    const user_uuid = prompt("Podaj userID użytkownika:");
    if (!user_uuid) return;

    try {
      await addMemberToGroup(groupId, user_uuid);
      updateGroupList();
    } catch (error) {
      console.error("Błąd podczas dodawania użytkownika do grupy:", error);
    }
  };

  const updateGroupList = async () => {
    try {
      const groupsData = await getAllGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Błąd podczas pobierania listy grup:", error);
    }
  };
  const handleDeleteGroup = async (groupId: string) => {
    try {
      const success = await deleteGroup(groupId);

      if (success) {
        console.log("Grupa została usunięta:", groupId);
        updateGroupList();
      } else {
        console.error("Błąd podczas usuwania grupy:", groupId);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania grupy:", error);
    }
  };

  const handleCopyGroupId = (groupId: string) => {
    copy(groupId);
  };
  useEffect(() => {
    updateGroupList();
  }, []);

  return (
    <>
      <Wrapper>
        <Title>Utwórz nową grupę</Title>
        <form onSubmit={handleSubmit}>
          <InputLabel>
            Wprowadź nazwę grupy
            <Input
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              required
            />
          </InputLabel>

          <button type="submit">Utwórz grupę</button>
        </form>
      </Wrapper>

      <Wrapper>
        <Title>Lista grup:</Title>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Nazwa</TableHeader>
              <TableHeader>ID</TableHeader>
              <TableHeader>Akcje</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.group_uuid}>
                <TableData>{group.name}</TableData>
                <TableData>
                  <button onClick={() => handleCopyGroupId(group.group_uuid)}>
                    Skopiuj ID
                  </button>
                </TableData>
                <TableData>
                  <button
                    onClick={() => handleAddUserToGroup(group.group_uuid)}
                  >
                    Dodaj użytkownika
                  </button>
                  <button onClick={() => handleDeleteGroup(group.group_uuid)}>
                    Usuń
                  </button>
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Wrapper>
    </>
  );
};
const Title = styled.h2`
  color: #212529;
`;
const Wrapper = styled.div``;
const InputLabel = styled.label`
  color: #212529;
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  width: 10rem;
  height: 1.2rem;
  border: 1px solid #212529;
  border-radius: 0.5rem;
  &:focus-visible {
    outline: none;
  }
`;

const TableData = styled.td`
  color: #212529;
  text-align: center;
  padding: 0;
  line-height: 1.35rem;
  padding: 0 0.25rem;
`;

const TableBody = styled.tbody``;

const TableHeader = styled.th``;

const TableRow = styled.tr`
  border-radius: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TableHead = styled.thead`
  color: #212529;
  text-align: center;
  z-index: 1001;
`;

const Table = styled.table`
  border-spacing: 0;
`;
export default GroupsTabComponent;
