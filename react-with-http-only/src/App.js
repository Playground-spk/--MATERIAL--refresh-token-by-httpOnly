import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from './config/axios';

function App() {
  const [data,setData] = useState('')
  const [cookie,setCookie] =useState(document.cookie)


  const login = async()=>{
      const result = await axios.post('/login')

      localStorage.setItem('token',result.data.token)
  }

  const fetchData = async ()=>{
    try {
      
      const result = await axios.get('/data')
      setData(result.data)
      setCookie(document.cookie)
    } catch (error) {
       console.log(error?.reponse?.data)
    }

  }
  return (
    <div className="App">
     <button onClick={login}>login</button>

     <button onClick={fetchData}>fetchdata</button>
  <div>{data}</div>
  <div>{cookie}</div>
    </div>
  );
}

export default App;
