import React from 'react';
import Questions from '../Questions/Questions';
import Welcome from '../Welcome/Welcome';
import { TriviaSteps, Direction } from '../../utils/Enums';

interface TriviaAppProps { }

interface TriviaAppState {
    currentStep: TriviaSteps;
}

class TriviaApp extends React.Component<TriviaAppProps, TriviaAppState> {
    constructor(props: TriviaAppProps) {
        super(props);
        this.state = {
            currentStep: TriviaSteps.Welcome
        }
    }

    getCurrentStep = () => {
        const { currentStep } = this.state;

        switch (currentStep) {
            case TriviaSteps.Welcome:
                return <Welcome stepper={this.triviaStepHandler} />
            case TriviaSteps.Questions:
                return <Questions stepper={this.triviaStepHandler} />
        }
    }

    triviaStepHandler = (isPressed: boolean, receivedFrom: TriviaSteps, navigationTo: Direction) => {
        if (isPressed) {
            switch (receivedFrom) {
                case TriviaSteps.Welcome:
                    if (navigationTo === Direction.Next) {
                        this.setState(
                            {
                                currentStep: TriviaSteps.Questions
                            }
                        );
                    }
                    break;
                case TriviaSteps.Questions:
                    if (navigationTo === Direction.Back) {
                        this.setState(
                            {
                                currentStep: TriviaSteps.Welcome
                            }
                        );
                    }
                    break;
            }
        }
    }

    render() {
        return (
            <>
                {this.getCurrentStep()}
            </>
        );
    }
}

export default TriviaApp;