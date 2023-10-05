import React from "react";
import Button from "../Panel/UI/Button";

interface SignOutButtonProps {
  onLogout: () => void;
}

const SignOutButtonComponent: React.FC<SignOutButtonProps> = ({ onLogout }) => {


  return <>
  <Button text="Wyloguj się" onClick={onLogout} /> 
  </>;
};


export default SignOutButtonComponent;
