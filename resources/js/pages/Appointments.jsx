import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { getToken } from '../utils/auth';
import { showToast } from '../utils/toast';
import { add } from '../apis/api_call';
import {  getDoctorAppointments } from '../apis/doctor';
import Div from '../common/Div';
const Appointments = () => {

  const { docId } = useParams();
  const token = getToken('token');
  const navigate = useNavigate()
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [docInfo, setDocInfo] = useState(null);

  const [docSlot, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const [loading, setLoading] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc.id == docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // Getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      if(currentDate.getDay() === 0) continue

      // Setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 60 ? 60 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // for 12-hour format
        });

        // Add slots to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    // console.log(docSlot);
  }, [docSlot]);

//   const getDoctorAppointmentData = async () =>{
//     const getDoctorAppointment = await getDoctorAppointments ('/api/doctor-appointment')
//   }
  const bookAppointment = async () =>{
    if(!token){
        showToast("Login to book appointment", "warning");
        navigate('/login')
    }else{

        try {
            setLoading(true);

            const selectedDateElement = document.querySelector('.slot-date.bg-primary');
            if (!selectedDateElement) {
              showToast("Please select a date", "warning");
              return;
            }

            const selectedDate = selectedDateElement.children[1].innerText;

            const slotDateObject = docSlot[slotIndex][0].datetime;
            const day = selectedDate.padStart(2, '0');
            const month = (slotDateObject.getMonth() + 1).toString().padStart(2, '0');
            const year = slotDateObject.getFullYear();

            const slotDate = `${year}-${month}-${day}`;

            const selectedTimeElement = document.querySelector('.slot-time.bg-primary');
            const slotTime = selectedTimeElement ? selectedTimeElement.innerText : null;

            if (!slotDate || !slotTime) {
                showToast("Please select a  time slot", "warning");
              return;
            }
            const data = {
                doc_id: docId,
                slot_date: slotDate,
                slot_time: slotTime
            };

            const appointmentData = await add('/api/book-appointment',data,{})
            showToast(appointmentData.message, "success");
            navigate('/my-appointments')
        } catch (error) {
            console.error("Error booking an appointment", error);
            if(error.status ==400){
                showToast(error.response.data.message,'error')
            }else{

                showToast("Failed to book an appointment. Please try again later.","error")
            }
        }finally {
            setLoading(false);
        }

    }
  }
  return docInfo && (
    <Div>
      <Div className='flex flex-col sm:flex-row gap-4'>
        <Div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo?.doctor_details?.image} alt="" />
        </Div>
        <Div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <Div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo?.doctor_details?.degree} - {docInfo?.doctor_details?.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo?.doctor_details?.experience}</button>
          </Div>
          <Div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo?.doctor_details?.about}</p>
          </Div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>
              {currencySymbol}{docInfo?.doctor_details?.fees}</span>
          </p>
        </Div>
      </Div>

      {/* BOOKING SLOTS */}
      <Div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <Div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlot.length && docSlot.map((item,index)=>(
              <Div onClick={()=> setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary slot-date text-white' : 'border border-gray-200'}`}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </Div>
            ))
          }
        </Div>
        <Div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlot.length && docSlot[slotIndex].map((item,index)=>(
              <p  onClick={()=> setSlotTime(item.time)} key={index} className={`text-small font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary slot-time text-white' : 'text-gray-400 border border-gray-300'}`}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </Div>
        <button onClick={()=>bookAppointment()} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'> {loading ? "Loading..." : "Book an appointment"}</button>
      </Div>

      {/* Listing related doctors */}
      <RelatedDoctors docId ={docId} speciality={docInfo.speciality}/>
    </Div>
  )
}

export default Appointments
