import { FaUser, FaLock } from "react-icons/fa"

import { useState, useEffect } from "react"

import { auth, db } from "../../fireBase/FireBase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs, collection } from "firebase/firestore";
import { get, ref } from "firebase/database";
import Excluir from "../modal/util/excluir";

import "./Login.css"
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [name, setusername] = useState("")
  const [password, setpassword] = useState("")
  const navigate = useNavigate();
  const [users, setuser] = useState([]);


  const handleSubmit = async (event) => {
    event.preventDefault()
    const user = users.filter((e) => e.name == name).map((e) => e.type)
    const userState = users.filter((e) => e.name == name).map((e) => e.state)
    const userId = users.filter((e) => e.name == name).map((e) => e.id)

    const type = user[0]
    const state = userState[0]
    const id = userId[0]
    console.log(type)
    try {
      if (state == true) {
        await signInWithEmailAndPassword(auth, name, password)
        navigate('/UpDate-Password', { state: { name, password, id } })
      } else {
        await signInWithEmailAndPassword(auth, name, password)
        if (type == 'adm') {
          navigate('/user-master', { state: { name, password } })
        } else {
          //navigate('/user-master')
          navigate('/normal-user')
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(db, 'user'));
        const userList = [];

        snapshot.forEach(doc => {
          userList.push({
            id: doc.key, // Para Realtime Database, use `doc.key` em vez de `doc.id`
            ...doc.val(), // Use `doc.val()` para obter os dados
          });
        });

        setuser(userList);
      } catch (error) {
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h1>Acesse o sistema</h1>
        <div className="input-field">
          <input type="email" placeholder='E-mail' onChange={(e) => setusername(e.target.value)} />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input type="password" placeholder='Password' onChange={(e) => setpassword(e.target.value)} />
          <FaLock className="icon" />
        </div>

        <button>log in</button>

      </form>
    </div>
  )
}

export default Login
