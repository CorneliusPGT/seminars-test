import axios from "axios";

//В данном случае можно и не использовать instance, но решил всё равно сделать

export const instance = axios.create({
    baseURL: 'http://localhost:3001'
})

export const getSeminarsAPI = () => 
{
    return instance.get('/seminars')
}

export const deleteSeminarAPI = (id: number) => 
{
    return instance.delete(`/seminars/${id}`)
}

export const sendSeminarAPI = (id: number, data) => 
{
    return instance.put(`/seminars/${id}`, data)
}