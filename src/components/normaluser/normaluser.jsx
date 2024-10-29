import React from 'react'
import './normaluser.css'
import { useState } from 'react';
import MachinesNormal from '../modal/normalUser/machinesNormal';

const normaluser = () => {
    const [openModal, setOpenModal] = useState(false);
    //const [openModalnormal, setOpenModalnormal] = useState(false);
  
    return (
      <div className="flex-container">
        <div className="flex-item">
          <p>
            Machine
          </p>
          <button onClick={() => setOpenModal(true)}>
          Acesse
          </button>
        </div>
        <MachinesNormal isOpen={openModal} onClose={() => setOpenModal(!openModal)} />
      </div>
    )
}

export default normaluser
