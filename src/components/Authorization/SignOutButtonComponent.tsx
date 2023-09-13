import React from 'react';
import styled from 'styled-components';

interface SignOutButtonProps {
  onLogout: () => void;
}

const SignOutButtonComponent: React.FC<SignOutButtonProps> = ({ onLogout }) => {
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    onLogout();
  };

  return (
    <ScrapeButton onClick={handleSignOut}>Wyloguj się!</ScrapeButton>
  );
};

const ScrapeButton = styled.span`
  font-weight: 600;
  padding: 0;
  color: white;
  &:hover {
    cursor: pointer;
    color: violet;
  }
`;

export default SignOutButtonComponent;
