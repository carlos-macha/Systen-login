import React, { useState, useEffect } from "react";
import ModalUser from "../modal/usermaste/ModalUser";
import Normal_user from "../modal/usermaste/machine";
import './UserMaster.css'
import { getDatabase, ref, onValue } from 'firebase/database';


const UserMaster = () => {

  const [openModal, setOpenModal] = useState(false);
  const [openModalnormal, setOpenModalnormal] = useState(false);

  return (
    <div className="flex-container">
      <div className="flex-item">
        <p>
          User
        </p>
        <button onClick={() => setOpenModal(true)}>
          Acesse
        </button>
      </div>
      <div className="flex-item">
        <p>
          Machine
        </p>
        <button onClick={() => setOpenModalnormal(true)}>
        Acesse
        </button>
      </div>
      <div>
      <ModalUser isOpen={openModal} onClose={() => setOpenModal(!openModal)}/>
      </div>
      <div>
        <Normal_user isOpen={openModalnormal} onClose={() => setOpenModalnormal(!openModalnormal)}/>
      </div>
    </div>
  )
}

export default UserMaster

