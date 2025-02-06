import React, { useEffect, useState } from 'react'
import { deleteSeminarAPI, getSeminarsAPI, sendSeminarAPI } from '../API/seminarsAPI.ts'
import './Seminars.css'
import { ModalWindow } from '../ModalWindow/ModalWindow.tsx'

export type SeminarsType = {
   "id": number,
   "title": string,
   "description": string,
   "date": string,
   "time": string,
   "photo": string
}


export const Seminars = () => {

   //Не стал использовать какой-либо стейт-менеджер, ибо задача не масштабная, ограничился локальный стейтом

   const [seminars, setSeminars] = useState<SeminarsType[]>([])
   const [modalState, setStateModal] = useState<'delete' | 'edit'>('delete')
   const [openModal, setOpenModal] = useState<boolean>(false)
   const [actualSeminar, setActualSeminar] = useState<SeminarsType>(seminars[0])

   //При рендере происходит получение с сервера данных **seminars**

   useEffect(() => {
      getSeminarsAPI().then((res) => setSeminars(res.data))
   }, [])

   //Удаление семинара
   const deleteSeminar = (id: number) => {
      deleteSeminarAPI(id).then(() => {
         setSeminars(seminars.filter((seminar: SeminarsType) => seminar.id !== id));
         setOpenModal(false)
      }).catch((error) => console.error(error))
   }

   //Сохранение изменений семинара

   const saveSeminar = async (id: number, data: SeminarsType) => {
      try {
         await sendSeminarAPI(id, data);
         const response = await getSeminarsAPI();
         setSeminars(response.data);
         setOpenModal(false)
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div>
         {openModal && <ModalWindow saveSeminar={saveSeminar} modalState={modalState} setOpenModal={setOpenModal} seminar={actualSeminar} deleteSeminar={deleteSeminar} />}
         {seminars?.map((s: SeminarsType, i: number) => <div className='block'><div>
            <h2 className='single-title'>{`${i + 1}. ${s.title}`}</h2>
            <p className="single-text">{s.description}</p>
            <div className='date'>
               <h4>{s.time}</h4>
               <h4>{s.date}</h4>
            </div>
            <img src={`${s.photo}`} alt="" />
         </div>
            <div className='buttons'>
               <button onClick={() => {
                  setActualSeminar(s)
                  setStateModal('edit');
                  setOpenModal(!openModal)
               }} className="change">изменить</button>
               <button onClick={() => {
                  setActualSeminar(s)
                  setStateModal('delete');
                  setOpenModal(!openModal)
               }} className='delete'>удалить</button>
            </div>
         </div>)}

      </div>
   )
}