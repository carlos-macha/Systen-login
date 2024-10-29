import React from 'react'
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './planilha.css'
import * as XLSX from "xlsx";

const planilha = ({ mac, isOpen, onClose }) => {

    const [machine, setmachine] = useState([]);

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
                setmachine(machineArray)
              })
            } catch (e) {
              console.log(e)
            }
          }
        }
        fetchmachines()
      }, [isOpen]);

    const exel = async (mac) => {
        const macFilter = machine.filter((e) => e.mac == mac)
        console.log(macFilter)
        const dados = [
          [macFilter.map((e) => e.pay), macFilter.map((e) => e.buy), macFilter.map((e) => e.date)]
        ];
    
        const cabecalhos = ["tipo", "preço", "data"];
        const planilhaDados = [cabecalhos, ...dados];
    
        const planilha = XLSX.utils.aoa_to_sheet(planilhaDados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, planilha, "machine");
    
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "usuarios.xlsx");
        document.body.appendChild(link);
        link.click();
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
          <th>preço</th>
          <th>pagamanto</th>
          <th>data</th>
        </tr>
      </thead>
      <tbody>
        {machine.filter(e => e.mac == mac).map(dados => (
          <tr key={dados.id}>
            <td>{'R$ ' + dados.buy}</td>
            <td>{dados.pay}</td>
            <td>{dados.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <hr />
        <div className='button'>
            <button onClick={() => exel(mac)}>gerar</button>
        </div>
        <div className='button'>
            <button onClick={onClose} >fechar</button>
        </div>
      </div>
    </div>
  )
}

export default planilha
