import React, { useState, useEffect } from 'react'
import { ref, getDatabase, remove, onValue, update } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import { auth } from '../../../fireBase/FireBase';
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import './excluir.css'

const excluir = ({ email, id, passwordExcluir, isOpen, onClose }) => {
  const location = useLocation();
  const { name, password } = location.state || {};
  const [machine, setMachine] = useState([])

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
            setMachine(machineArray)
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
    fetchmachines()
  }, [isOpen]);

  const delet = async (id, email) => {

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, passwordExcluir)
      const user = auth.currentUser
      deleteUser(user)
      const userRef = ref(getDatabase(), `user/${id}`);

      await remove(userRef);
      await signInWithEmailAndPassword(auth, name, password)

      const db = getDatabase();
      //const machineRef = ref(db, `machine`);

      const updates = {};
      machine.forEach((machine) => {
        const usersList = machine.users || [];
        const filteredUsers = usersList.filter((userEmail) => userEmail !== email);
        
        // Atualiza a lista de usuários da máquina
        updates[`machine/${machine.id}/users`] = filteredUsers;
      });

      // Executa a atualização em uma única chamada
      await update(ref(db), updates);


      

      onClose();
    } catch (e) {
      console.log("Erro ao deletar usuário:", e);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="backGorund">
      <div className="modal">
        <p>você deseja excluir essa conta?</p>
        <div className='button'>
          <button onClick={() => delet(id, email)}>Sim</button>
          <button onClick={onClose} >Não</button>
        </div>
      </div>
    </div>
  )
}

export default excluir
