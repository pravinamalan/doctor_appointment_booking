import React, { useEffect, useState } from 'react'
import { adminAssets, assets, doctors } from './../assets/assets';
import { getRequest, update } from '../apis/api_call';
import { formatDate } from '../helpers/formatDateTime';
import { getRole } from '../utils/auth';
import Div from '../common/Div';

const Dashboard = () => {
    const [dashboardData,setDashboardData] = useState([]);
    const getDashboardData = async () =>{
        const dashboardData = await getRequest('/api/dashboard');
        setDashboardData(dashboardData)
    }
    useEffect(()=>{
        getDashboardData()
    },[])

    const appointmentAction = async(appointmentId,action) => {

        const data = { appointmentId:appointmentId,action:action };
        const appointmentActionData = await update('/api/appointment-action',data);
        setDashboardData(appointmentActionData)
    }

    const role = getRole('role');

  return (
      <Div>
          <Div className="flex flex-wrap gap-3">
            {
                role !== "Doctor" &&
                <Div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={adminAssets.doctor_icon} alt="dashboard" loading='lazy'/>
                    <Div>
                        <p className="text-xl font-semibold text-gray-600">
                            {dashboardData.doctors}
                        </p>
                        <p className="text-gray-400">Dotors</p>
                    </Div>
                </Div>
            }
              <Div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                  <img
                      className="w-14"
                      src={adminAssets.appointments_icon}
                      alt=""
                  />
                  <Div>
                      <p className="text-xl font-semibold text-gray-600">
                          {dashboardData.appointments}
                      </p>
                      <p className="text-gray-400">Appointments</p>
                  </Div>
              </Div>
              <Div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                  <img
                      className="w-14"
                      src={adminAssets.patients_icon}
                      alt=""
                  />
                  <Div>
                      <p className="text-xl font-semibold text-gray-600">
                          {dashboardData.patients}
                      </p>
                      <p className="text-gray-400">Patients</p>
                  </Div>
              </Div>
          </Div>
          <Div className="bg-white">
              <Div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                  <img src={adminAssets.list_icon} alt="" />
                  <p className="font-semibold">Latest Booking</p>
              </Div>
              <Div className="pt-4 border border-t-0">
                  {dashboardData?.latestBookings
                      ?.slice(0, 5)
                      .map((item, index) => (
                          <Div
                              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                              key={item?.id}
                          >
                              <img
                                  src={item?.user?.user_details?.image ? item?.user?.user_details?.image: adminAssets.upload_area}
                                  alt=""
                                  className="rounded-full w-10"
                              />

                              <Div className="flex-1 text-sm">
                                  <p className="text-gray-800 font-medium">
                                      {item?.user?.name}
                                  </p>
                                  <p className="text-gray-600 ">
                                      Booking on {formatDate(item.slot_date)}
                                  </p>
                              </Div>
                              {item.cancelled == 1 ? (
                                  <p className="text-red-400 text-xs font-medium">
                                      Cancelled
                                  </p>
                              ) : item.is_completed == 1 ? (
                                  <p className="text-green-400 text-xs font-medium">
                                      Completed
                                  </p>
                              ) : (
                                  <Div>
                                      <button
                                          onClick={() =>
                                              appointmentAction(item.id,'completed')
                                          }
                                      >
                                          <img
                                              className="w-8"
                                              src={adminAssets.tick_icon}
                                              alt=""
                                          />
                                      </button>
                                      <button
                                          onClick={() =>
                                              appointmentAction(item.id,'cancelled')
                                          }
                                      >
                                          <img
                                              className="w-8"
                                              src={adminAssets.cancel_icon}
                                              alt=""
                                          />
                                      </button>
                                  </Div>
                              )}
                          </Div>
                      ))}
              </Div>
          </Div>
      </Div>
  );
}

export default Dashboard
