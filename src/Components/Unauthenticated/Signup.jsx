import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            passwordConfirmation: '',
            passwordsMatch: false,
        };
    }

    inputFieldHandler = (event) => {
        let tempState = this.state;
        tempState[event.target.name] = event.target.value;

        if (event.target.name.includes('password')) {
            this.passwordMatchCheck();
        }

        this.setState(tempState);
    };

    passwordMatchCheck = () => {
        let tempState = this.state;

        if (this.state.password === this.state.passwordConfirmation) {
            tempState.passwordsMatch = true;
            this.setState(tempState);
        } else {
            tempState.passwordsMatch = false;
            this.setState(tempState);
        }
    };

    submitButtonHandler = (event) => {
        event.preventDefault(); // Prevent default form action.
        // Send username and password from signup page to backend where the backend creates a new user record.
        axios
            .post(
                'https://math-game-react-backend.herokuapp.com/accounts/signup/',
                {
                    username: this.state.username,
                    password: this.state.password,
                }
            )
            // After submission is sent and completed, the backend sends back a response containing the status of
            // the submission workflow.  The user won't see the response unless they're looking at the console.
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem(
                        'refresh_token',
                        response.data.refresh
                    );
                    window.location.href = '/';
                } else {
                    console.log(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        return (
            <div class='jumbotron'>
                <Form>
                    <Form.Group controlId='formBasicUsername'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            name='username'
                            type='input'
                            placeholder='Enter your username here'
                            onChange={this.inputFieldHandler}
                        />
                    </Form.Group>

                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name='password'
                            type='password'
                            placeholder='Enter your password here'
                            onChange={this.inputFieldHandler}
                            isValid={this.state.passwordsMatch}
                        />
                    </Form.Group>

                    <Form.Group controlId='formBasicPasswordConfirmation'>
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control
                            name='passwordConfirmation'
                            type='password'
                            placeholder='Enter your password here'
                            onChange={this.inputFieldHandler}
                            isValid={this.state.passwordsMatch}
                        />
                    </Form.Group>

                    <Button
                        className='btn btn-dark'
                        type='submit'
                        onClick={this.submitButtonHandler}>
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}
