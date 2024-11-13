import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import { getRequest, update } from './../apis/api_call';
import { adminAssets } from '../assets/assets';
import { formatAge, formatDateTime } from '../helpers/formatDateTime';
import { getRole } from './../utils/auth';
import Div from '../common/Div';

const columns = (role,appointmentAction) => {
    let baseColumn = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "80px"
        },
        {
            name: "Patient",
            selector: row => row.user?.name,
            sortable: true,
            width: "200px"
        },
        {
            name: "Age",
            selector: row => formatAge(row.user?.user_details?.dob),
            sortable: true,
            width: "80px"
        },
        {
            name: "Date & Time",
            selector: row => formatDateTime(row.slot_date, row.slot_time),
            sortable: true,
            width: "180px"
        },
        {
            name: "Doctor Name",
            selector: row => row.doctor?.name,
            sortable: true,
            width: "200px"
        },
        {
            name: "Fees",
            selector: row => row.amount,
            sortable: true,
            width: "100px"
        },
        {
            name: "Status",
            cell: (item) => (
              item.cancelled === 1 ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.is_completed === 1 ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <Div className="flex gap-2">
                  <button onClick={() => appointmentAction(item.id, 'completed')}>
                    <img
                      className="w-8"
                      src={adminAssets.tick_icon}
                      alt="Complete"
                    />
                  </button>
                  <button onClick={() => appointmentAction(item.id, 'cancelled')}>
                    <img
                      className="w-8"
                      src={adminAssets.cancel_icon}
                      alt="Cancel"
                    />
                  </button>
                </Div>
              )
            ),
            width: "150px"
        }
    ];
    if (role === 'Doctor') {
        const filteredColumns = baseColumn.filter(col => col.name !== "Doctor Name");

        filteredColumns.splice(5, 0, {
            name: "Payment",
            selector: row => row.payment === 0 ? "Cash" : "Online",
            sortable: true,
            width: "100px"
        });

        return filteredColumns;
    }
    return baseColumn;
}

const AllAppointments = () => {
    const [filterText, setFilterText] = useState("");
    const [appointmentData, setAppointmentData] = useState([]);
    const role = getRole('role');

    const getAllAppointmentData = async () => {
      try {
        const response = await getRequest('/api/appointments');


        if (response?.appointments) {
          setAppointmentData(response.appointments);
        } else {
          console.warn("No appointments found");
        }
      } catch (error) {
        console.error(`Error fetching all the appointments: ${error}`);
      }
    };

    useEffect(() => {
      getAllAppointmentData();
    }, []);

    const filteredData = appointmentData.filter(
      item =>
        item.user?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.user?.email?.toLowerCase().includes(filterText.toLowerCase())
    );
    const appointmentAction = async(appointmentId,action) => {

        const data = { appointmentId:appointmentId,action:action };
        const appointmentActionData = await update('/api/appointment-action',data);
        // setDashboardData(appointmentActionData)
        setAppointmentData(appointmentActionData.allAppointments);
    }
  return (
    <Div className='w-full max-w-6xl'>
        <p className='mb-3 text-lg font-medium'>All Appointments</p>
        <Div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
            <input
            type="text"
            className='p-2 m-2 w-full max-w-[300px] mb-5 border rounded-lg'
            placeholder="Search"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            />

            <DataTable
                columns={columns(role,appointmentAction)}
                data={filteredData}
                pagination
                selectableRows
                highlightOnHover
                className='appointments-table'

            />
        </Div>

    </Div>
  )
}

export default AllAppointments
