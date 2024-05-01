import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Recipes from './Recipes';
import Register from './Register';
import Account from './Account';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
