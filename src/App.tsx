
import { Container } from 'react-bootstrap';
import './App.scss';
import Main from './components/Main/MainComponent';

function App() {
  return (
      <Container fluid 
      className="custom-global-bg global-text-color" 
      style={{"height": '100%'}}>
          <Main />
      </Container>
  );
}

export default App;
