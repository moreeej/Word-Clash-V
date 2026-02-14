import { Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Starting from './pages/Starting';
import Game from './pages/Game';


function App() {
  return (
    <BrowserRouter>
        <Routes>


     
          <Route path="/" element={<Starting />} />
          <Route path="/game" element={<Game />} /> 
          <Route path="*" element={<Starting />} />
      

        </Routes>
    </BrowserRouter>

  );
}

export default App;