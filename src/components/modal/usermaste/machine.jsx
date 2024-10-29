
import React, { useEffect, useState } from "react";
import './normalUser.css'
import { db } from "../../../fireBase/FireBase";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import Planilha from "../util/planilha";


const normal_user = ({ isOpen, onClose }) => {

  const [documentos, setDocumentos] = useState([]);
  const [users, setuser] = useState([]);
  const [setusers, setListUser] = useState('');
  const [setmachine, setListMachine] = useState('');
  const [ mac, setmac] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
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
            setuser(usersArray); // Atualiza o estado com a lista de usuários
          });
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      }
    };

    fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    const fetchmachines = async () => {
      if (isOpen) {
        const db = getDatabase()
        const machineRef = ref(db, 'machine')
        try {
          onValue(machineRef, (snapshot) => {
            const machineData = snapshot.val()
            const machineArray = []
            for (let id in machineData) {
              machineArray.push({
                id: id,
                ...machineData[id]
              })
            }
            setDocumentos(machineArray)
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetchmachines()
  }, [isOpen]);

  const Adduser = async (mac) => {

    const user = setusers
    const machines = documentos.filter((e) => e.mac === mac).map((id) => id.id)
    const id = machines[0]
    console.log(id)

    const listRef = ref(db, `machine/${id}/users`);
    try {
      const snapshot = await get(listRef);
      if (snapshot.exists()) {
        const currentList = snapshot.val();

        // Verifica se o item já existe na lista
        if (!currentList.includes(user)) {
          const updatedList = [...currentList, user];
          await set(listRef, updatedList);
          console.log('Item adicionado com sucesso');
        }
      } else {
        // Se não existir uma lista, cria uma nova com o item
        await set(listRef, [user]);
        console.log('Nova lista criada e item adicionado');
      }
    } catch (error) {
      console.error('Erro ao adicionar item à lista', error);
    }
  }


  const deletuser = async (mac) => {

    const user = setusers
    const machines = documentos.filter((e) => e.mac === mac).map((id) => id.id)
    const id = machines[0]
    console.log(id)

    const listRef = ref(db, `machine/${id}/users`);
    try {
      const snapshot = await get(listRef);
      if (snapshot.exists()) {
        const currentList = snapshot.val();
        const updatedList = currentList.filter(item => item !== user);
        await set(listRef, updatedList);
      }
    } catch (error) {
      console.error('Erro ao adicionar item à lista', error);
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault()
  }

  if (!isOpen) return null;
  return (
    <div className="backGorund">
      <div className="modal">
        <hr />
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>mac</th>
                <th>IP</th>
                <th>State</th>
                <th>Visualizar</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map(machine => (
                <tr key={machine.id}>
                  <td>{machine.mac}</td>
                  <td>{machine.ip}</td>
                  <td>{machine.state}</td>
                  <td><button onClick={() => {setOpenModal(true); setmac(machine.mac)}}>visualizar</button></td>
                  <td>{machine.users !== undefined ? machine.users + ' ' : '' }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div>
            <h2>MACHINES</h2>
            <div className="list">
              <select onChange={(e) => setListMachine(e.target.value)}>
                {documentos.map((machine, index) => (
                  <option key={index} value={machine.mac}>
                    {machine.mac}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2>USERS</h2>
              <div className="list">
              <select onChange={(e) => setListUser(e.target.value)}>
                {users.map((user, index) => (
                  <option key={index} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            </div>
            <div className="input-button">
              <button className="buttonmachine" onClick={() => Adduser(setmachine)} >add</button>
              <button className="buttonmachine" onClick={() => deletuser(setmachine)}>remuve</button>
            </div>
          </div>
        </form>
        <button className="close" onClick={onClose} >Fechar</button>
        <Planilha isOpen={openModal} onClose={() => setOpenModal(!openModal)} mac={mac}/>
      </div>
    </div>
  )
}

export default normal_user


