import axios from "axios"

export const useSendData = () => {

    let data = {};
    let status = 0;
    let error = null;

    return async (url, method, params, body) => {

        await axios(url, {
            method: method,
            data: body,
            params: params
        })
        .then((response) => {
            data = response.data;
            status = response.status;
        })
        .catch((err) => {
            error = err;
            status = err.response.status;
        });

        return {data, status, error};
    }
}