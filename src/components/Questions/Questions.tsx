import { Button, Col, Drawer, Icon, Row, Select, Spin, Steps, Card, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import axios from 'axios';
import React from 'react';
import Lottie from 'react-lottie';
import difficultyAnimation from '../../resources/animations/loading.json';
import errorAnimation from '../../resources/animations/error.json';
import successAnimation from '../../resources/animations/success.json';
import congratsAnimation from '../../resources/animations/trophy.json';
import { ApiEndpoints, Difficulty, Direction, QuestionSteps, TriviaSteps } from '../../utils/Enums';
import { QuestionList } from '../../utils/Interfaces';
import Title from 'antd/lib/typography/Title';

interface QuestionsProps {
    stepper: (isPressed: boolean, receivedFrom: TriviaSteps, navigationTo: Direction) => void;
}

interface QuestionsState {
    currentStep: QuestionSteps;
    loading: boolean;
    difficultyLevel: string | undefined;

    questions?: QuestionList;
    currentQuestion?: string;
    currentQuestionAnswers?: Array<string>;
    currentQuestionCorrectAnswer?: string;
    currentQuestionIndex: number;
    isAnswerCorrect?: boolean;
    isInfoRendered: boolean;

    isUserUsedJoker: boolean;
}


class Questions extends React.Component<QuestionsProps, QuestionsState> {
    constructor(props: QuestionsProps) {
        super(props);
        this.state = {
            currentStep: QuestionSteps.SelectDifficulty,
            loading: false,
            difficultyLevel: undefined,
            currentQuestionIndex: 0,
            isInfoRendered: false,
            isUserUsedJoker: false
        }
    }

    getQuestionsFromApi = (endpointUrl: string) => {
        this.setState({
            loading: true
        }, () => {
            axios.get(endpointUrl)
                .then((res) => {
                    this.setState(
                        {
                            questions: res.data,
                            loading: false
                        }, () => {
                            this.nextQuestionSetter();
                        }
                    );
                })
        })
    }

    shuffleArray = (arrayToShuffle: Array<any>) => {
        let x, j, i;
        for (i = arrayToShuffle.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = arrayToShuffle[i];
            arrayToShuffle[i] = arrayToShuffle[j];
            arrayToShuffle[j] = x;
        }

        return arrayToShuffle;
    }

    nextQuestionSetter = () => {
        const { questions, currentQuestionIndex } = this.state;

        let answerOptions: Array<string> = [];


        if (questions && questions.results) {
            answerOptions.push(questions.results[currentQuestionIndex].correct_answer);
            questions.results[currentQuestionIndex].incorrect_answers.forEach((incorrectAnswer) => {
                answerOptions.push(incorrectAnswer);
            });

            this.shuffleArray(answerOptions);

            this.setState({
                currentQuestionAnswers: answerOptions,
                currentQuestionCorrectAnswer: questions.results[currentQuestionIndex].correct_answer,
                currentQuestion: questions.results[currentQuestionIndex].question
            }, () => {
                console.log("Correct answer: " + this.state.currentQuestionCorrectAnswer);
            })
        }

    }

    renderNextQuestion = () => {
        const { currentQuestion, currentQuestionAnswers, currentQuestionCorrectAnswer } = this.state;
        return (
            <>
                <Row>
                    <Text>
                        {currentQuestion}
                    </Text>
                </Row>
                <Row gutter={32} style={{ marginTop: "24px" }}>
                    {currentQuestionAnswers && currentQuestionAnswers.map((answer) => {
                        return (
                            <Col key={answer} className="gutter-row" xs={12} sm={12} md={12} lg={6} xl={6} onClick={() => {
                                if (currentQuestionCorrectAnswer === answer) {
                                    this.setState({
                                        isInfoRendered: true,
                                        isAnswerCorrect: true
                                    })
                                } else {
                                    this.setState({
                                        isInfoRendered: true,
                                        isAnswerCorrect: false
                                    })
                                }
                            }}>
                                <div className="question">
                                    <div className="question-text">
                                        <Text>{answer}</Text>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row >
            </>
        );
    }

    render() {
        const { currentStep, difficultyLevel, loading, isInfoRendered, isAnswerCorrect, currentQuestionIndex, currentQuestionCorrectAnswer, isUserUsedJoker } = this.state;
        return (
            <>
                <Spin spinning={loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                    {currentStep === QuestionSteps.SelectDifficulty ?
                        <Card style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "32px" }}>
                            <Title level={2}>Select the difficulty level</Title>
                            <Lottie
                                options={
                                    {
                                        loop: true,
                                        autoplay: true,
                                        animationData: difficultyAnimation,
                                    }
                                }
                                isClickToPauseDisabled={true}
                                height="50%"
                                width="50%" />
                            <Select
                                onChange={(value) => {
                                    this.setState({
                                        difficultyLevel: value as string
                                    });
                                }}
                                style={{ width: "100%", marginBottom: "32px" }}
                                placeholder="Select a difficulty level"
                            >
                                <Select.Option value={Difficulty.Easy}>{Difficulty.Easy}</Select.Option>
                                <Select.Option value={Difficulty.Medium}>{Difficulty.Medium}</Select.Option>
                                <Select.Option value={Difficulty.Hard}>{Difficulty.Hard}</Select.Option>
                                <Select.Option value={Difficulty.Random}>{Difficulty.Random}</Select.Option>
                            </Select>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                                <div style={{ width: "50%" }}>
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            this.props.stepper(true, TriviaSteps.Questions, Direction.Back)
                                        }}
                                    >Take me back</Button>
                                </div>
                                <div style={{ width: "50%" }}>
                                    <Button
                                        disabled={difficultyLevel ? false : true}
                                        type={difficultyLevel ? "primary" : "dashed"}
                                        onClick={() => {
                                            this.setState({ currentStep: QuestionSteps.Play }, () => {
                                                const { difficultyLevel } = this.state;
                                                let url = ApiEndpoints[difficultyLevel as keyof typeof ApiEndpoints];
                                                this.getQuestionsFromApi(url);
                                            })
                                        }}
                                        style={{
                                            float: "right"
                                        }}
                                    >Start playing</Button>
                                </div>

                            </div>
                        </Card> : null}

                    {this.state.currentStep === QuestionSteps.Play && (
                        <>
                            <Card style={{ padding: "24px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "32px" }}>
                                <Row style={{ marginBottom: "32px" }}>
                                    <Steps size="small" current={currentQuestionIndex}>
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                        <Steps.Step />
                                    </Steps>
                                </Row>
                                <Row style={{ marginBottom: "32px" }}>
                                    <Col span={12} style={{ height: "32px" }}>
                                        <Text style={{ lineHeight: "32px" }}>Current Question: {currentQuestionIndex + 1} / 10</Text>
                                    </Col>
                                    <Col span={12}>
                                        {!isUserUsedJoker && (
                                            <Tooltip title="This bonus eliminates the two wrong answers and you can only use this for once, so be careful." placement="right">
                                                <Button style={{ float: "right" }} onClick={() => {
                                                    const { currentQuestionAnswers, currentQuestionCorrectAnswer } = this.state;
                                                    if (currentQuestionAnswers && currentQuestionCorrectAnswer) {
                                                        currentQuestionAnswers.splice(currentQuestionAnswers.indexOf(currentQuestionCorrectAnswer), 1);

                                                        currentQuestionAnswers.pop();
                                                        currentQuestionAnswers.pop();
                                                        currentQuestionAnswers.push(currentQuestionCorrectAnswer);

                                                        this.shuffleArray(currentQuestionAnswers);

                                                        this.setState({
                                                            isUserUsedJoker: true
                                                        })
                                                    }
                                                }}>I feel lucky</Button>
                                            </Tooltip>
                                        )}
                                    </Col>
                                </Row>

                                {this.renderNextQuestion()}
                            </Card>
                        </>
                    )}


                    <Drawer
                        title={isAnswerCorrect ? "The answer was correct!" : "The answer was wrong!"}
                        placement="bottom"
                        closable={false}
                        visible={isInfoRendered}
                        height="50%"
                        style={{ textAlign: "center" }}
                    >
                        {currentQuestionIndex !== 9 && (
                            <Row style={{ marginBottom: "32px" }}>
                                <Lottie
                                    options={
                                        {
                                            loop: false,
                                            autoplay: true,
                                            animationData: isAnswerCorrect ? successAnimation : errorAnimation,
                                        }
                                    }
                                    isClickToPauseDisabled={true}
                                    height="10%"
                                    width="10%" />
                            </Row>
                        )}

                        {isAnswerCorrect !== undefined && currentQuestionIndex === 9 && (
                            <>
                                <Row style={{ marginBottom: "32px" }}>
                                    <Lottie
                                        options={
                                            {
                                                loop: isAnswerCorrect,
                                                autoplay: true,
                                                animationData: isAnswerCorrect ? congratsAnimation : errorAnimation,
                                            }
                                        }
                                        isClickToPauseDisabled={true}
                                        height={isAnswerCorrect ? "20%" : "10%"}
                                        width={isAnswerCorrect ? "20%" : "10%"} />
                                </Row>

                                {isAnswerCorrect && (
                                    <>
                                        <Row style={{ marginBottom: "32px" }}>
                                            <Text>Congrats! You have answered all the questions correctly If you want to play again, press the button below.</Text>
                                        </Row>
                                        <Row>
                                            <Button type="primary" onClick={() => {
                                                this.setState({
                                                    currentQuestionCorrectAnswer: undefined,
                                                    currentQuestionIndex: 0,
                                                    currentQuestionAnswers: undefined,
                                                    currentStep: QuestionSteps.SelectDifficulty,
                                                    isInfoRendered: false,
                                                    isAnswerCorrect: undefined,
                                                    isUserUsedJoker: false
                                                })
                                            }}>Play one more time</Button>
                                        </Row>
                                    </>
                                )}
                            </>
                        )}
                        {isAnswerCorrect !== undefined && isAnswerCorrect === true && currentQuestionIndex !== 9 && (
                            <Row style={{ marginBottom: "32px" }} >
                                <Button type="primary" onClick={() => {
                                    this.setState({
                                        isInfoRendered: false,
                                        isAnswerCorrect: undefined,
                                        currentQuestionIndex: this.state.currentQuestionIndex + 1
                                    }, () => {
                                        this.nextQuestionSetter();
                                    })
                                }}>Next Question</Button>
                            </Row>
                        )}

                        {isAnswerCorrect !== undefined && isAnswerCorrect === false && (
                            <>
                                {currentQuestionIndex === 9 && (
                                    <Row style={{ marginBottom: "16px" }}>
                                        <Text>You were almost there!</Text>
                                    </Row>
                                )}
                                <Row style={{ marginBottom: "32px" }}>
                                    <Text >The correct answer was <b>{currentQuestionCorrectAnswer}</b></Text>
                                </Row>
                                <Row style={{ marginBottom: "32px" }}>
                                    <Button type="danger" onClick={() => {
                                        this.setState({
                                            currentQuestionCorrectAnswer: undefined,
                                            currentQuestionIndex: 0,
                                            currentQuestionAnswers: undefined,
                                            currentStep: QuestionSteps.SelectDifficulty,
                                            isInfoRendered: false,
                                            isAnswerCorrect: undefined,
                                            isUserUsedJoker: false
                                        })
                                    }}>Play one more time</Button>
                                </Row>
                            </>
                        )}
                    </Drawer>
                </Spin>
            </>
        );
    }
}

export default Questions;