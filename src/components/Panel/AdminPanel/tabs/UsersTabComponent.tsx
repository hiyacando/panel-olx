import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAllUsers, deleteUser } from '../../../../utils/axios-service';

interface UserData {
    id: string;
    email: string;
    role: string;
    avatar: string;
}

const UsersTabComponent: React.FC = () => {
    const [usersData, setUsersData] = useState<UserData[]>([]);

    useEffect(() => {
        fetchAllUsers()
            .then((data: UserData[]) => {
                setUsersData(data);
            })
            .catch((error) => {
                console.error('Error fetching users data:', error);
            });
    }, []);

    const handleDeleteUser = (userId: string) => {
        deleteUser(userId)
            .then(() => {
                const updatedUsersData = usersData.filter((user) => user.id !== userId);
                setUsersData(updatedUsersData);
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <>

            <Table>
                <TableHead>
                    <TableRow>

                        <TableHeader>Awatar</TableHeader>
                        <TableHeader>Adres Email</TableHeader>
                        <TableHeader>Rola</TableHeader>
                        <TableHeader>Akcja</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usersData.map((user) => (
                        <TableRow key={user.id}>
                            <TableData><Avatar src={user.avatar} /></TableData>
                            <TableData>{user.email}</TableData>
                            <TableData>{user.role}</TableData>
                            <TableData>
                                <DeleteButton onClick={() => handleDeleteUser(user.id)}>USUŃ</DeleteButton>

                            </TableData>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
const DeleteButton = styled.button`
background: none;
border: none;
color: violet;
&:hover{
    cursor: pointer;

}

`
const Avatar = styled.img`
width: 2rem;
background-color: rgba(0, 0, 0, 0.2);
border-radius: 0.5rem;
`
const TableData = styled.td`
    color: white;
    text-align: center;
    padding: 0; 
    line-height: 1.35rem;
    padding: 0 0.5rem;
    
`
const TableBody = styled.tbody`

`
const TableHeader = styled.th`
margin-bottom: 1rem;
`

const TableRow = styled.tr`
    border-radius: 1rem;

    &:hover{
        background-color: rgba(0, 0, 0, 0.03);
        
    }

`
const TableHead = styled.thead`
    color: white;
    text-align: center;
    z-index: 1001;
    
`
const Table = styled.table`
    margin-left: auto;
    margin-right: auto;
    border-spacing: 0;
`
export default UsersTabComponent;