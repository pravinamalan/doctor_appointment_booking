import React, { useEffect, useState } from "react";

import { createContext } from "react";
// import { doctors } from '../assets/assets';
import { getDoctorData } from "../apis/doctor";
import { getRequest } from "../apis/api_call";

export const AppContext = createContext();

/* eslint-disable react/prop-types */
const AppContextProvider = (props) => {
    const [doctors,setDoctors] = useState([])
    const [role,setRole] = useState('');
    const fetchDoctorsData = async () =>{
        try {
            const doctorsData = await getDoctorData('/api/doctor');
            setDoctors(doctorsData.doctors);

        } catch (error) {
            console.error("Error fetching doctor data", error);
        }
    }

    const fetchRoles = async() => {
        try {
            const rolesData = await getRequest('/api/get-role');
            setRole(rolesData.role);
        } catch (error) {
            console.error("Error fetching roles data", error);
        }
    }
    useEffect(() => {
        fetchDoctorsData();
        // fetchRoles();
    }, []);

    const currencySymbol = '$'

    const value = {
        doctors,currencySymbol,role
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
/* eslint-enable react/prop-types */

export default AppContextProvider;
