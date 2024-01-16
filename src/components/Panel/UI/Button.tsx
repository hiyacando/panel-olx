import styled from 'styled-components'

interface ButtonProps{
    text: string;
    onClick: () => void;
    disabled?: boolean; 
}
const Button: React.FC<ButtonProps> = ({text, onClick, disabled = false}) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>{text}</StyledButton>
  )
}

const StyledButton = styled.button`
font-weight: 600;
padding: 0;
color: black;
background: none;
border: none;
display: flex;
font-size: 0.9rem;
&:hover {
  cursor: pointer;
  color: violet;
}
&:disabled{
    color: red;
}
`
export default Button