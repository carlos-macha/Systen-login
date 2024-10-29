import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, update } from 'firebase/database';

const upDatePassword = () => {

    const [newpassword, setpassword] = useState('')
    const [passwordRepeat, setpasswordRepeat] = useState('')
    const location = useLocation();
    const navigate = useNavigate();
    const { name, password, id } = location.state || {};
    const authGet = getAuth();
    const user = authGet.currentUser;

    const updatePasswordMethod = async () => {
        if (newpassword == passwordRepeat && newpassword !== '') {
          const db = getDatabase()
          const userRef = ref(db, `user/${id}`)
          console.log(name, password)
          try {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential)
            // Atualiza para a nova senha
          await updatePassword(user, newpassword);
          await update(userRef, {password: newpassword, state: false})
          navigate("/")
          } catch (e) {
            //console.log(e)
          }
        } else {
          console.log('senhas divergentes')
          alert('senhas divergentes')
        }
    }

    const handleSubmit = async (event) => {
      event.preventDefault()
      await updatePasswordMethod()
    }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h1>Redefinir senha</h1>
        <div className="input-field">
            <input type="password" placeholder='nova senha' onChange={(e) => setpassword(e.target.value)}/>
        </div>
        <div className="input-field">
            <input type="password" placeholder='Repita a senha' onChange={(e) => setpasswordRepeat(e.target.value)} />
        </div>

        <button onClick={updatePasswordMethod}>salvar</button>

      </form>
    </div>
  )
}

export default upDatePassword
