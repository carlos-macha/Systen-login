import React, { useEffect, useState } from "react";
import Excluir from "../util/excluir";
import '../../../fireBase/FireBase';
import './ModalUser.css';
import ResetPassword from "../util/resetPassword";
import Type from "../util/type";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, push, ref, set, onValue } from "firebase/database";

function ModalUser({ isOpen, onClose }) {
  const [documentos, setDocumentos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalType, setOpenModalType] = useState(false);
  const [OpenModalPassword, setOpenModalPassword] = useState(false)
  const [username, setname] = useState('')
  const [name, setusername] = useState("")
  const [password, setpassword] = useState("12345678")
  const [passwordDelet, setpasswordDelet] = useState('')
  const [email, setEmail] = useState('')
  const [id, setid] = useState('')

  useEffect(() => {
    getUsers();
  }, [isOpen]);

  const getUsers = () => {
    const fetchUsers = async () => {
      if (isOpen) {
        const db = getDatabase(); // Obtém a instância do banco de dados
        const usersRef = ref(db, 'user');
        try {
          onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val(); // Obtém os dados
            const usersArray = [];
            for (let id in usersData) {
              usersArray.push({
                id: id,
                ...usersData[id], // Desestrutura os dados do usuário
              });
            }
            setDocumentos(usersArray); // Atualiza o estado com a lista de usuários
          });
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      }
    };

    fetchUsers();
  }

  const clear = () =>{
    setusername('')
    setpassword('')
  }


  const postUser = async () => {
    const db = getDatabase()
    try {
      const auth = getAuth()
      await createUserWithEmailAndPassword(auth, name, '12345678');
      const newUserRef = push(ref(db, 'user'));
      await set(newUserRef,{
        name: name,
        password: '12345678',
        type: 'normal',
        state: true,
      });
      clear()
      getUsers()
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  }

  if (!isOpen) return null;

  return (
    <div className="backGorund">
      <div className="modal">
      <form onSubmit={handleSubmit}>
        <div>
            <div className="input-field-user">
              <input type="email" required placeholder="Email" value={name} onChange={
                (e) => setusername(e.target.value)} autoComplete="new-password" />
            </div>
            <div className="input-button">
              <button type="button" onClick={postUser}>Salvar</button>
              <button onClick={clear}>cansel</button>
            </div>
        </div>
        <hr />  
        <div className="table">
          <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Type</th>
              <th>Redefinir Senha</th>
              <th>Redefinir Tipo</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td> 
                <td>{user.type}</td>
                <td>
                  <button onClick={() => {setOpenModalPassword(true),
                     setpassword(user.password), setEmail(user.name), setid(user.id)}}>Redefinir</button> 
                </td>
                <td>
                  <button onClick={() => {setOpenModalType(true),
                     setname(user.name), setid(user.id)}}>Redefinir</button>
                </td>
                <td>
                  <button onClick={() => {setOpenModal(true);
                     setid(user.id), setname(user.name), setpasswordDelet(user.password)}}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <hr />
        </form>
        <button className="close" onClick={onClose}>Fechar</button>
        <Excluir passwordExcluir={passwordDelet}
         email={username} isOpen={openModal} onClose={() => setOpenModal(!openModal)} id={id} />
        <Type id={id} name={username} isOpen={openModalType} onClose={() => setOpenModalType(!openModalType)}/>
        <ResetPassword email={email} passwordDelet={password}
         isOpen={OpenModalPassword} onClose={() => setOpenModalPassword(!OpenModalPassword)} id={id} />
      </div>
    </div>
    
  );
}

export default ModalUser;
