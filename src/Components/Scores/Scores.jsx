import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import axiosInstance from '../../helpers/axiosInstance';
import ScoresChart from './ScoresChart';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                correctCounter: 0,
                incorrectCounter: 0,
                totalCounter: 0,
            },
        };
    }

    componentDidMount() {
        // Request the user's current score details from the backend, which pull from db.
        axiosInstance
            .get('api/scoring/request_score_details')
            .then((response) => {
                let tempState = this.state;
                tempState.chartData.correctCounter =
                    response.data.correct_answer_count;
                tempState.chartData.incorrectCounter =
                    response.data.incorrect_answer_count;
                tempState.chartData.totalCounter =
                    response.data.total_questions_answered;
                this.setState(tempState);
            });
    }

    loginButtonHandler = () => {
        this.setState({ logged_in: !this.state.logged_in });
    };

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Scores and Results Analysis</h1>
                    <hr className='my-2'></hr>
                    <p>Below is a representation of your math game results.</p>
                    {this.props.is_logged_in ? ( // if logged in show logout button.
                        <div>
                            <div>
                                {this.state.chartData.totalCounter > 0 ? (
                                    <ScoresChart
                                        chartData={this.state.chartData}
                                    />
                                ) : null}
                            </div>
                            <Button
                                id='logout'
                                type='submit'
                                className='btn btn-dark'
                                onClick={() =>
                                    this.props.history.push('/logged-out')
                                }>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        // if logged in show logout button.
                        <div>
                            <Button
                                id='login'
                                type='submit'
                                className='btn btn-dark'
                                onClick={() =>
                                    this.props.history.push('/login')
                                }>
                                Login
                            </Button>
                        </div>
                    )}
                </Jumbotron>
            </div>
        );
    }
}
