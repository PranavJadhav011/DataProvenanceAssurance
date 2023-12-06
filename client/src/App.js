import './App.css';
import Navigation from './components/Navigation';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Home from './components/Home';
import Signup from './components/Signup';
import CheckProv from './components/CheckProv';
import AddFile from './components/AddFile';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';

function App() {
  return (
    <>
      <h1 className='Heading'>Data Provenance Assurance</h1>
      <BrowserRouter>
      <Navigation/>
      <Routes>

        <Route element={<PrivateComponent/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/add' element={<AddFile/>}/>
        <Route path='/check' element={<CheckProv/>}/>
        {/* <Route path='/logout' element={<Home/>}/> */}
        </Route>

        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
