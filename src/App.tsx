import 'antd/dist/antd.css';
import React from 'react';
import './App.css';
import TriviaApp from './components/TriviaApp/TriviaApp';
import { Layout } from 'antd';

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <>
      <Layout style={
        {
          minHeight: "100vh",
          backgroundImage: "url(https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/v368-aum-aa-06-memphispattern_2.jpg?auto=format&bg=transparent&con=3&cs=srgb&dpr=1&fm=jpg&ixlib=php-3.1.0&mark=rawpixel-watermark.png&markalpha=90&markpad=13&markscale=10&markx=25&q=75&usm=15&vib=3&w=2048&s=127745c62c7b22128684b4d618bdcded)",
          backgroundSize: "cover"
        }
      }>
        <Header style={{ backgroundColor: "rgba(24, 64, 104, 1.000)", color: "#ffffff" }}>Trivia App - Çağla Nur Demir</Header>
        <Content style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{ margin: "5%" }}>
            <TriviaApp />
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default App;