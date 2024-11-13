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


export const getUserProfile = async(url, data) => {
    try {
        const response = await axios.get(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async(url, data) => {
    console.log(data);
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelAppointment = async (url, data) => {
    try {

        const response = await axios.post(url, data);
        return response.data;

    } catch (error) {
        console.error(`Error while posting data in ${url}:`, error);
        throw error;
    }
}
