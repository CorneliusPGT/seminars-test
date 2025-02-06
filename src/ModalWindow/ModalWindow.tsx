import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SeminarsType } from "../Seminars/Seminars"
import './ModalWindow.css'
import { SubmitHandler, useForm } from "react-hook-form"


type PropsType = { modalState: 'delete' | 'edit', seminar: SeminarsType, setOpenModal: Dispatch<SetStateAction<boolean>>, saveSeminar: (id: number, data: SeminarsType) => void, deleteSeminar: (id: number) => void }



export const ModalWindow: React.FC<PropsType> = ({ modalState, seminar, setOpenModal, deleteSeminar, saveSeminar }) => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        setValue
    } = useForm<SeminarsType>({
        defaultValues: seminar
    });

    const [previewPic, setPreviewPic] = useState<string>(seminar.photo)

    const onSubmit = (data: SeminarsType) => {
        saveSeminar(seminar.id, data);
    };

    //Обработка полученного файла, ибо нужно получить именно url фотографии

    const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewPic(imageUrl);
            setValue("photo", imageUrl);
        }
    };

    //Отключение возможности прокручивания экрана при открытом модальном окне

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [])

    return <div className="modal-background">
        <div className="modal-container">
            {modalState === 'delete' && <>
                <button className="x-button" onClick={() => { setOpenModal(false) }}>
                    X
                </button>
                <div className="modal-title">
                    <h1>Вы подтверждаете удаление?</h1>
                </div>
                <div className="modal-footer">
                    <button onClick={() => {
                        deleteSeminar(seminar.id);
                    }}>Да</button>
                    <button onClick={() => { setOpenModal(false) }}>Нет</button>
                </div>
            </>}
            {modalState === 'edit' && <>
                <button onClick={() => { setOpenModal(false) }}>
                    X
                </button>
                <div className="modal-title">
                    <h1>Редактирование</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="dateTime">
                        <input type="text" {...register('time')} />
                        <input type="text"  {...register('date')} />
                    </div>
                    <input type="text" {...register('title')} />
                    <input type="text"  {...register('description')} />
                    <div>
                        <img className="form-pic" src={previewPic} alt="Выбранное изображение" />
                        <input type="file" accept="image/*" onChange={handlePicChange} />
                    </div>
                    <div className="modal-footer">
                        <button disabled={isSubmitting}>Сохранить</button>
                        <button onClick={() => setOpenModal(false)}>Отменить</button>
                    </div>
                </form>

            </>}
        </div>
    </div>
}


