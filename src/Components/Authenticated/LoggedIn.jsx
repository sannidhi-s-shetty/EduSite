import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

export default class LoggedIn extends React.Component {
    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Logged In</h1>
                    <hr className='my-2'></hr>
                    <p>
                        You successfully logged in! You can now navigate to the
                        game page to start playing.
                    </p>
                    <Button
                        id='logout'
                        type='submit'
                        className='btn btn-dark'
                        onClick={this.loginButtonHandler}>
                        Logout
                    </Button>
                </Jumbotron>
            </div>
        );
    }
}
