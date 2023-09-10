import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { registerUser } from '../../utils/axios-service';

interface RegisterComponentProps {
    onRegister: (values: { email: string; password: string }) => void;
    onNavLogin: () => void;
}

const RegisterComponent = ({ onRegister, onNavLogin }: RegisterComponentProps) => {
    const initialValues = {
        email: '',
        password: '',
    };
    const [registrationError, setRegistrationError] = useState('');

    const validationSchema = Yup.object({
        email: Yup.string().email('Niepoprawny format').required('Pole wymagane'),
        password: Yup.string().required('Pole wymagane'),
    });

    const handleSubmit = async (values: { email: string; password: string }, actions: any) => {
        try {
            const success = await registerUser(values);

            if (success) {
                onRegister(values);
            } else {
                setRegistrationError('Rejestracja nieudana. Spróbuj ponownie.');
            }
        } catch (error) {
            console.error('Błąd:', error);
            setRegistrationError('Wystąpił błąd podczas rejestracji.');
        }

        actions.setSubmitting(false);
    };


    return (
        <>
            <HeroMain>
                <Title>REJESTRACJA</Title>
                <Wrapper>
                    <Button onClick={onNavLogin}>Logowanie</Button>

                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        <Form>
                            <FormGroup>
                                <Label>Email</Label>
                                <Field type="email" name="email" />
                                <ErrorMessage name="email" component={ErrorText} />
                            </FormGroup>

                            <FormGroup>
                                <Label>Hasło</Label>
                                <Field type="password" name="password" />
                                <ErrorMessage name="password" component={ErrorText} />
                            </FormGroup>

                            <Button type="submit">Zarejestruj</Button>
                        </Form>
                    </Formik>
                    {registrationError && <ErrorMessageText>{registrationError}</ErrorMessageText>}

                </Wrapper>
            </HeroMain>
        </>
    );
};
const ErrorMessageText = styled.span`
color: red;
`
const Wrapper = styled.div`

`

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
    width: 60%;
    margin-left: auto;
    margin-right: auto;
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
const FormGroup = styled.div`
    margin-bottom: 1rem;
    color: white;
    justify-content: center;
`;

const Label = styled.label`
    /* ... */
`;

const ErrorText = styled.div`
    color: red;
`;

const Button = styled.button`
padding: 0;
color: white;
font-weight: 600;
font-size: 1rem;
background: none;
border: none;
&:hover{
    cursor: pointer;
    color: violet;
}
`;

export default RegisterComponent;
