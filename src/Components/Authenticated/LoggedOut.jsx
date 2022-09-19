import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';

export default class LoggedOut extends React.Component {
    componentDidMount() {
        if (this.props.is_logged_in) {
            this.props.killSession();
        } else {
            console.log('You are already logged out');
        }
    }

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Logged Out</h1>
                    <hr className='my-2'></hr>
                    <p>We're sorry to see you leave. Come back another time.</p>
                    <Button
                        id='login'
                        type='submit'
                        className='btn btn-dark'
                        onClick={() => this.props.history.push('/login')}>
                        Login
                    </Button>
                </Jumbotron>
            </div>
        );
    }
}
