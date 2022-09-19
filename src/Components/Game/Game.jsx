import React from 'react';
import { Jumbotron, Button, Form } from 'react-bootstrap';
import { randomProblemGenerator } from './MathProblemGenerator';
import axiosInstance from '../../helpers/axiosInstance';
import GameChart from './GameChart';
import answerValidator from '../../helpers/formValidation';
import FormErrors from './FormErrors';
import _ from 'lodash';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            game_properties: {
                splash_screen: {
                    splash_screen_text: null,
                    splash_screen_preference: false,
                    checkbox_state: false,
                },
                problem: {
                    problem_string: 'Press START to begin',
                    problem_answer: null,
                    show_answer: '',
                    user_input: '',
                    status: 'not_answered',
                },
                chartData: {
                    correctCounter: 0,
                    incorrectCounter: 0,
                    totalCounter: 0,
                },
                startButtonState: {
                    value: false,
                    text: 'Start',
                },
                checkButtonState: {
                    value: true,
                },
                answerFieldErrors: null,
                answerFieldState: {
                    value: true,
                },
            },
        };
    }

    componentDidMount() {
        // Send get request to backend requesting user's splash screen preferences (splash screen message and preference).
        // We are requesting preferences for the "Math" game but the backend allows for multiple game types.
        axiosInstance.get('/api/game-properties/math').then((response) => {
            let tempState = this.state;
            tempState.game_properties.splash_screen.splash_screen_text =
                response.data.splash_screen.splash_screen_text;
            tempState.game_properties.splash_screen.splash_screen_preference =
                response.data.splash_screen.splash_screen_preference;
            this.setState(tempState, this.validateInput());
        });
    }

    validateInput = () => {
        let tempState = this.state;
        tempState.game_properties.answerFieldErrors = answerValidator(
            this.state.game_properties.problem.user_input
        );
        this.setState(tempState);
    };

    loginButtonHandler = () => {
        this.setState({ logged_in: !this.state.logged_in });
    };

    splashScreenHandler = (event) => {
        let tempState = this.state;
        tempState.game_properties.splash_screen.checkbox_state =
            event.target.checked;
        this.setState(tempState);
        axiosInstance
            .post('api/user_preferences/set_preference', {
                splash_screen_name: 'Math',
                display_on_refresh:
                    !this.state.game_properties.splash_screen.checkbox_state,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    submitHandler = (event) => {
        // Prevent form from automatically sending something.
        event.preventDefault();
    };

    startButtonHandler = () => {
        // Show random math problem.
        let problem = randomProblemGenerator();
        let tempState = this.state;
        tempState.game_properties.problem.status = 'not_answered';
        tempState.game_properties.problem = {
            ...tempState.game_properties.problem,
            ...problem,
        };
        tempState.game_properties.problem.user_input = '';
        tempState.game_properties.problem.show_answer = false;
        this.userInput.focus();
        tempState.game_properties.startButtonState.value = true;
        tempState.game_properties.checkButtonState.value = true;
        tempState.game_properties.answerFieldState.value = false;
        this.setState(tempState, this.changeButtonText());
    };

    checkButtonHandler = () => {
        // Check if user's answer is correct.
        let input = parseInt(this.state.game_properties.problem.user_input);
        let answer = parseInt(
            this.state.game_properties.problem.problem_answer
        );
        let tempState = this.state;

        if (input === answer) {
            tempState.game_properties.problem.status = 'correct';
            this.tallyBarChartData('correct');
        } else {
            tempState.game_properties.problem.status = 'incorrect';
            this.tallyBarChartData('incorrect');
            tempState.game_properties.problem.show_answer = `Sorry, the correct answer is ${this.state.game_properties.problem.problem_answer}!`;
        }
        tempState.game_properties.startButtonState.value = false;
        tempState.game_properties.checkButtonState.value = true;
        tempState.game_properties.answerFieldState.value = true;

        this.setState(tempState, this.sendMathResults());
    };

    answerChangeHandler = (event) => {
        // Grab the user's answer string.
        let input = event.target.value;
        let tempState = this.state;
        tempState.game_properties.answerFieldErrors = answerValidator(input);
        tempState.game_properties.problem.user_input = input;
        // Use Lodash "_.isEmpty" to check answer submissions and whether they're empty.
        if (_.isEmpty(tempState.game_properties.answerFieldErrors)) {
            tempState.game_properties.checkButtonState.value = false;
        } else if (!_.isEmpty(tempState.game_properties.answerFieldErrors)) {
            tempState.game_properties.checkButtonState.value = true;
        } else if (_.isEmpty(input)) {
            tempState.game_properties.checkButtonState.value = true;
        } else {
            tempState.game_properties.checkButtonState.value = false;
        }
        this.setState(tempState);
    };

    // enterPressHandler = (event) => {
    //     if ((event.key === 'Enter')) {
    //         this.checkButtonHandler()
    //     }
    // }

    tallyBarChartData = (status) => {
        // Tally user's current math results.  Data is wiped on refresh.
        let tempState = this.state;
        switch (status) {
            case 'incorrect':
                tempState.game_properties.chartData.incorrectCounter += 1;
                break;
            case 'correct':
                tempState.game_properties.chartData.correctCounter += 1;
                break;
            default:
                break;
        }
        tempState.game_properties.chartData.totalCounter += 1;
        this.setState(tempState);
    };

    changeButtonText = () => {
        let tempState = this.state;
        tempState.game_properties.startButtonState.text = 'New Problem';
        this.setState(tempState);
    };

    sendMathResults = () => {
        // Submit the user's problem, answer, user's answer, and true/false status to the backend.
        axiosInstance.post('/api/scoring/submit_score_details', {
            math_problem: this.state.game_properties.problem.problem_string,
            true_answer: this.state.game_properties.problem.problem_answer,
            user_answer: this.state.game_properties.problem.user_input,
            question_status: this.state.game_properties.problem.status,
        });
    };

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Welcome to Math 101!</h1>
                    <hr className='my-2'></hr>
                    {
                        this.state.game_properties.splash_screen
                            .splash_screen_preference ? ( // if user wants to see splash screen show splash screen.
                            <div className='alert alert-primary'>
                                <p>
                                    {
                                        this.state.game_properties.splash_screen
                                            .splash_screen_text
                                    }
                                </p>
                                <p>
                                    <input
                                        name='splash'
                                        type='checkbox'
                                        checked={
                                            this.state.game_properties
                                                .splash_screen.checkbox_state
                                        }
                                        onChange={this.splashScreenHandler}
                                    />{' '}
                                    Don't show this message again.
                                </p>
                            </div>
                        ) : null // if user does not want to see splash screen show nothing.
                    }

                    {this.props.is_logged_in ? ( // if logged in, show logout button.
                        <div className='col text-center'>
                            <Button
                                id='startNewProblemButton'
                                type='button'
                                disabled={
                                    this.state.game_properties.startButtonState
                                        .value
                                }
                                className='btn btn-primary btn-lg'
                                onClick={this.startButtonHandler}>
                                {
                                    this.state.game_properties.startButtonState
                                        .text
                                }
                            </Button>
                            <p id='problemText'>
                                {
                                    this.state.game_properties.problem
                                        .problem_string
                                }
                            </p>
                            <p id='problemAnswer'>
                                {this.state.game_properties.problem.show_answer}
                            </p>
                            <Form.Group controlId='exampleForm.ControlInput1'>
                                <Form.Control
                                    placeholder='Enter your answer here'
                                    type='input'
                                    autoComplete='off'
                                    value={
                                        this.state.game_properties.problem
                                            .user_input
                                    }
                                    ref={(input) => {
                                        this.userInput = input;
                                    }}
                                    onChange={this.answerChangeHandler}
                                    // onKeyPress={this.enterPressHandler}
                                    onSubmit={this.submitHandler}
                                    disabled={
                                        this.state.game_properties
                                            .answerFieldState.value
                                    }
                                />
                            </Form.Group>
                            <Button
                                id='checkButton'
                                type='button'
                                disabled={
                                    this.state.game_properties.checkButtonState
                                        .value
                                }
                                className={
                                    'btn btn-lg ' +
                                    (this.state.game_properties.problem
                                        .status === 'correct'
                                        ? 'btn-success'
                                        : this.state.game_properties.problem
                                              .status === 'incorrect'
                                        ? 'btn-danger'
                                        : 'btn-primary')
                                }
                                onClick={this.checkButtonHandler}>
                                {this.state.game_properties.problem.status ===
                                'correct'
                                    ? 'Correct'
                                    : this.state.game_properties.problem
                                          .status === 'incorrect'
                                    ? 'Incorrect'
                                    : 'Check'}
                            </Button>
                            <div>
                                <FormErrors
                                    formErrors={
                                        this.state.game_properties
                                            .answerFieldErrors
                                    }
                                />
                                <GameChart
                                    chartData={
                                        this.state.game_properties.chartData
                                    }
                                />
                            </div>
                            <br />
                            <div className='text-left'>
                                <Button
                                    type='button'
                                    className='btn btn-dark'
                                    onClick={() =>
                                        this.props.history.push('/logged-out')
                                    }>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // if not logged in show login button.
                        <div className='text-left'>
                            <Button
                                type='button'
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
