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

export const getDoctorData = async(url, params) => {
    try {
        const response = await axios.get(url, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const addDoctorData = async(url, params) => {
    try {
        const response = await axios.post(url, params, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDoctorData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatedoctorProfileData = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDoctorAppointments = async(url, params) => {
    try {
        const response = await axios.get(url, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}
