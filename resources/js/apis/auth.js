import axios from 'axios';

export const adminLogin = async(url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminLogout = async(url) => {
    try {
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const userRegister = async(url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const userLogin = async(url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async(url) => {
    try {
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};
