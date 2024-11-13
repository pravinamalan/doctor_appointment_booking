import axios from "axios";
import Cookies from "js-cookie";

const getCookie = (name) => {
    return Cookies.get(name);
}

const jwtToken = getCookie('token');

const config = {
    headers: {
        'Accept': 'application/json',
        'Authorization': `${jwtToken}`,
        'Content-type': 'multipart/form-data'
    }
}

export const getRequest = async (url,data) => {
    try {

        const response = await axios.get(url, data, config);
        return response.data;

    } catch (error) {
        console.error(`Error while getting data in ${url}:`, error);
        throw error;
    }
}

export const add = async(url, data) => {
    try {
        const response = await axios.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const update = async(url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

