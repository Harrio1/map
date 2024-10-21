import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FieldComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Получение данных из API
        axios.get('http://localhost:8000/api/fields')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const handleSubmit = () => {
        // Отправка данных на API
        axios.post('http://localhost:8000/api/fields', { /* ваши данные */ })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error sending the data!', error);
            });
    };

    return (
        <div>
            <h1>Data from Laravel API</h1>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            <button onClick={handleSubmit}>Send Data</button>
        </div>
    );
};

export default FieldComponent;

