import { Button, Card, Col, Row } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import Lottie from 'react-lottie';
import polarbearAnimation from '../../resources/animations/polarbear.json';
import { Direction, TriviaSteps } from '../../utils/Enums';


interface WelcomeProps {
    stepper: (isPressed: boolean, receivedFrom: TriviaSteps, navigationTo: Direction) => void;
}

class Welcome extends React.Component<WelcomeProps, {}> {
    render() {
        return (
            <Row gutter={12}>
                <Col span={24} style={{ textAlign: "center" }}>
                    <Card style={{ borderRadius: "32px" }}>
                        <Row>
                            <Lottie
                                options={
                                    {
                                        loop: true,
                                        autoplay: true,
                                        animationData: polarbearAnimation,
                                    }
                                }
                                isClickToPauseDisabled={true}
                                height="25%"
                                width="25%" />
                            <Title>Trivia Game</Title>
                        </Row>
                        <Row>
                            <Text>Play the ultimate online trivia quiz. Categories include general knowledge, dictionary, entertainment, history, food & drink, geography, science & nature.</Text>
                        </Row>
                        <Row style={{ marginTop: "24px" }}>
                            <Button type="primary" onClick={() => {
                                this.props.stepper(true, TriviaSteps.Welcome, Direction.Next)
                            }}>Get started</Button>
                        </Row>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Welcome;