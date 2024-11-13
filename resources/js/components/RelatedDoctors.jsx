import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import Div from '../common/Div';
const RelatedDoctors = ({speciality,docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()
    const [relatedDoctor,setRelatedDoctors] = useState([])
    // console.log(speciality,docId,doctors);

    useEffect(()=>{
        if(doctors.length>0 && speciality){
            const doctorsData = doctors.filter((doc)=>doc.speciality == speciality && doc.id != docId);
            console.log(doctorsData);

            setRelatedDoctors(doctorsData);
        }
    },[doctors,speciality,docId])
    // console.log(relatedDoctor);

  return (
    <Div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Related Doctors</h1>
        <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
        <Div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {
                relatedDoctor.slice(0,5).map((item)=>(
                    <Div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} key={item._id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                        <img src={item?.doctor_details?.image} alt="doctor-img" className='bg-blue-50' />
                        <Div className='p-4'>
                            <Div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                            </Div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item?.doctor_details?.speciality}</p>
                        </Div>
                    </Div>
                ))
            }
        </Div>
        <button onClick={()=>navigate('/doctors')} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    </Div>
  )
}
RelatedDoctors.propTypes = {
    speciality: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
};

export default RelatedDoctors
