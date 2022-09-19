import axiosInstance from '../../helpers/axiosInstance';
import React from 'react';
import { Button, Form } from 'react-bootstrap';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errors: false,
        };
    }

    inputFieldHandler = (event) => {
        let tempState = this.state;
        tempState[event.target.name] = event.target.value;

        this.setState(tempState);
    };

    loginButtonHandler = (event) => {
        event.preventDefault();
        // Send post request to backend containing username and password.
        axiosInstance
            .post('token/obtain/', {
                username: this.state.username,
                password: this.state.password,
            })
            //Response from backend provides access token and refresh token so the user can login and stay logged in.
            .then((response) => {
                // Store the keys
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                // Navigate to the home page
                this.props.history.push('/');
                this.props.loginHandler();
            })
            .catch((error) => {
                this.setState({ errors: error.response });
                if (error.status === 401) {
                    console.log('Something went wrong');
                }
                console.log(error.response);
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
                            isInvalid={!!this.state.errors}
                        />
                        {!!this.state.errors ? ( // Check if there are errors.  Check truthy or falsy using double bang operator.
                            <Form.Control.Feedback type='invalid'>
                                {this.state.errors.data.detail}
                            </Form.Control.Feedback>
                        ) : null}
                    </Form.Group>

                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name='password'
                            type='password'
                            autoComplete='off'
                            placeholder='Enter your password here'
                            onChange={this.inputFieldHandler}
                            isInvalid={!!this.state.errors}
                        />
                        {!!this.state.errors ? (
                            <Form.Control.Feedback type='invalid'>
                                {this.state.errors.data.details}
                            </Form.Control.Feedback>
                        ) : null}
                    </Form.Group>

                    <Button
                        className='btn btn-dark'
                        type='submit'
                        onClick={this.loginButtonHandler}>
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}
