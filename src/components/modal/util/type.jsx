import React from 'react'
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";

const type = ({isOpen, onClose, name, id}) => {

    const [users, setuser] = useState([]);
    const [filtredType, setfiltredType] = useState('')

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
                 setuser(usersArray.filter(e => e.name == name).map(e => e.type)); // Atualiza o estado com a lista de usuários
              });
            } catch (error) {
              console.error("Erro ao buscar usuários:", error);
            }
          }
        };
        fetchUsers();
      }, [isOpen]);

      /*useEffect(() => {
        setfiltredType(users.filter(e => e.name == name).map(e => e.type))
      }, [users, name]);*/

      const resetType = async () => {
        const db = getDatabase()
        try {
        const userRef = ref(db, "user/" + id)
        if (users == 'adm') {
            await update(userRef, {type: 'normal'})
        } else {
            await update(userRef, {type: 'adm'}) 
        }
        onClose();
        } catch (e) {
            console.log(e)
        }
      }

    if(!isOpen) return null;
  return (
    <div className='backGorund'>
      <div className='modal'>
        <p>você deseja redefinir o tipo do usuário {name} para {users == 'normal' ? 'adm' : 'normal'}?</p>
        <div className="input-button">
        <button onClick={resetType}>Sim</button>
        <button className="close" onClick={onClose}>Não</button>
        </div>
      </div>
    </div>
  )
}

export default type
