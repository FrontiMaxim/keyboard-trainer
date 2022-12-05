import axios from "axios"

export const useSendData = () => {

    let data = {};
    let status = 400;
    let error = null;

    return async (url, method, params, body) => {

        const response = await axios(url, {
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
        });

        return {data, status, error};
    }
}