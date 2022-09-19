import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

export default class SignedIn extends React.Component {
    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Signed In</h1>
                    <hr className='my-2'></hr>
                    <p>
                        You successfully created an account and have
                        automatically been logged in. Head over to the game page
                        to start playing.
                    </p>
                    <Button
                        id='login'
                        type='submit'
                        className='btn btn-dark'
                        onClick={this.loginButtonHandler}>
                        Login
                    </Button>
                </Jumbotron>
            </div>
        );
    }
}
