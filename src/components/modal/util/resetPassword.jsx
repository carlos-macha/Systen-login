import React, { useEffect } from 'react'
import { signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword, getAuth } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import { update, getDatabase, ref } from 'firebase/database';

const resetPassword = ({ isOpen, onClose, id, email, passwordDelet }) => {

    
    const location = useLocation();
    const { name, password } = location.state || {};

    useEffect(() => {
        console.log(id)
    }, [isOpen])

    if (!isOpen) return null;

    const setPassword = async () => {
        const db = getDatabase()
        const userRef = ref(db, `user/${id}`)
        const newPassword = '12345678'

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, passwordDelet)
            const credential = EmailAuthProvider.credential(email, passwordDelet);
            const user = auth.currentUser;
            await reauthenticateWithCredential(user, credential)
                .then(() => {
                    // Atualiza para a nova senha
                    return updatePassword(user, newPassword);
                })
            await update(userRef, { password: '12345678', state: true })
            signInWithEmailAndPassword(auth, name, password)
            onClose()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='backGorund'>
            <div className='modal'>
                <p>você deseja redefinir a senha do usuário?</p>
                <div className="input-button">
                    <button onClick={setPassword}>Sim</button>
                    <button className="close" onClick={onClose}>Não</button>
                </div>
            </div>
        </div>
    )
}

export default resetPassword
