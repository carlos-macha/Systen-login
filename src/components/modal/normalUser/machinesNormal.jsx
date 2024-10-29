import React, { useState, useEffect } from 'react'
import { db, auth } from '../../../fireBase/FireBase';
import { ref, get } from 'firebase/database';
import Planilha from '../util/planilha';

const machinesNormal = ({ isOpen, onClose }) => {

  const [idmachine, setidmachine] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [ mac, setmac] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.email);

      } else {
        setCurrentUser(null);

      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = async () => {
      const refColecao = ref(db, 'machine');
      try {
        const snapshot = await get(refColecao)
        const allMachines = snapshot.val()
        const filteredMachines = Object.keys(allMachines)
          .map((key) => allMachines[key]) // Cria um array com os valores (máquinas)
          .filter((machine) =>
            Array.isArray(machine.users) && machine.users.includes(currentUser) // Filtra por user
          );
        setidmachine(filteredMachines)
      } catch (e) {
        console.log(e)
      }

    }
    user();
  }, [isOpen])

  if (!isOpen) return null;
  return (
    <div className='backGorund'>
      <div className='modal'>
        <hr />
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>mac</th>
                <th>IP</th>
                <th>State</th>
                <th>planilha</th>
              </tr>
            </thead>
            <tbody>
              {idmachine.map(machine => (
                <tr key={machine.mac}>
                  <td>{machine.mac}</td>
                  <td>{machine.ip}</td>
                  <td>{machine.state}</td>
                  <td><button onClick={() => {setOpenModal(true); setmac(machine.mac)}}>visualizar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <button className="close" onClick={onClose} >Fechar</button>
        <Planilha isOpen={openModal} onClose={() => setOpenModal(!openModal)} mac={mac}/>
      </div>
    </div>
  )
}

export default machinesNormal
