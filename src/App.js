import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Components/Home/Home';
import Game from './Components/Game/Game';
import Scores from './Components/Scores/Scores';
import Login from './Components/Unauthenticated/Login';
import Signup from './Components/Unauthenticated/Signup';
import LoggedOut from './Components/Authenticated/LoggedOut';
import payloadParser from './helpers/payloadParser';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged_in: false,
            user_payload: {},
        };
    }

    logoutHandler = () => {
        let tempState = this.state;
        tempState.is_logged_in = false;
        tempState.user_payload = {};
        localStorage.clear();
        this.setState(tempState);
    };

    loginHandler = () => {
        let tempState = this.state;
        tempState.is_logged_in = true;
        tempState.user_payload = payloadParser();
        this.setState(tempState);
    };

    componentDidMount() {
        let tempState = this.state;
        // Check if local storage has something in it, if so, it means they're logged in.
        if (
            localStorage.getItem('access_token') &&
            localStorage.getItem('refresh_token')
        ) {
            tempState.is_logged_in = true;
            tempState.user_payload = payloadParser();
            this.setState(tempState);
        } else {
            tempState.is_logged_in = false;
            this.setState(tempState);
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Container>
                        {this.state.is_logged_in ? ( // if logged this navbar is rendered
                            <Navbar className='navbar navbar-expand-lg navbar-dark bg-dark'>
                                <div className='container'>
                                    <Link
                                        className='navbar-brand'
                                        to='/'>
                                        Home
                                    </Link>
                                    <Link
                                        className='navbar-brand'
                                        to='/game'>
                                        Game
                                    </Link>
                                    <Link
                                        className='navbar-brand'
                                        to='/scores'>
                                        Scores
                                    </Link>
                                    {!!this.state.user_payload ? (
                                        this.state.user_payload.is_staff ? ( // If the user is "staff", provide them with the admin page.
                                            <a
                                                className='navbar-brand'
                                                href='https://math-game-react-backend.herokuapp.com/admin'>
                                                Admin
                                            </a>
                                        ) : null
                                    ) : null}
                                </div>
                            </Navbar>
                        ) : (
                            // if not logged this navbar is rendered
                            <Navbar className='navbar navbar-expand-lg navbar-dark bg-dark'>
                                <div className='container'>
                                    <Link
                                        className='navbar-brand'
                                        to='/'>
                                        Home
                                    </Link>
                                </div>
                            </Navbar>
                        )}

                        {this.state.is_logged_in ? ( // if logged in these routes are available
                            <div>
                                <Switch>
                                    <Route
                                        exact
                                        path='/'
                                        component={(props) => (
                                            <Home
                                                {...props}
                                                {...this.state}
                                                logoutHandler={
                                                    this.logoutHandler
                                                }
                                            />
                                        )}
                                    />
                                    <Route
                                        path='/game'
                                        component={(props) => (
                                            <Game
                                                {...props}
                                                {...this.state}
                                            />
                                        )}
                                    />
                                    <Route
                                        path='/scores'
                                        component={(props) => (
                                            <Scores
                                                {...props}
                                                {...this.state}
                                            />
                                        )}
                                    />
                                    <Route
                                        path='/logged-out'
                                        component={(props) => (
                                            <LoggedOut
                                                {...props}
                                                {...this.state}
                                                killSession={this.logoutHandler}
                                            />
                                        )}
                                    />
                                </Switch>
                            </div>
                        ) : (
                            // // if not logged in these routes are available
                            <div>
                                <Switch>
                                    <Route
                                        exact
                                        path='/'
                                        component={(props) => (
                                            <Home
                                                {...props}
                                                {...this.state}
                                                logoutHandler={
                                                    this.logoutHandler
                                                }
                                            />
                                        )}
                                    />
                                    <Route
                                        path='/login'
                                        component={(props) => (
                                            <Login
                                                {...props}
                                                loginHandler={this.loginHandler}
                                            />
                                        )}
                                    />
                                    <Route
                                        path='/signup'
                                        component={(props) => (
                                            <Signup {...props} />
                                        )}
                                    />
                                    <Route
                                        path='/logged-out'
                                        component={(props) => (
                                            <LoggedOut
                                                {...props}
                                                {...this.state}
                                                killSession={this.logoutHandler}
                                            />
                                        )}
                                    />
                                </Switch>
                            </div>
                        )}
                    </Container>
                </div>
            </Router>
        );
    }
}

export default App;
