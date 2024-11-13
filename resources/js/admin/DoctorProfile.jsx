import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './../context/AppContext';
import Div from '../common/Div';
import { adminAssets, assets } from '../assets/assets';
import { Img } from '../common/Img';
import Input from '../common/Input';
import P from '../common/P';
import { updatedoctorProfileData } from '../apis/doctor';
import { showToast } from './../utils/toast';

const DoctorProfile = () => {
    const fileInputRef = useRef(null);
    const [doctorProfile, setDoctorProfile] = useState({});
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { doctors, currencySymbol } = useContext(AppContext);

    useEffect(() => {
        setDoctorProfile(doctors[0]);
        setUpdatedProfile(doctors[0]);
    }, [doctors]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files.length > 0) {
            const file = files[0];
            const imagePreviewUrl = URL.createObjectURL(file);

            setUpdatedProfile((prevState) => ({
                ...prevState,
                doctor_details: {
                    ...prevState.doctor_details,
                    image: imagePreviewUrl, // For preview in UI
                    imageFile: file         // Actual file for uploading
                }
            }));
        } else {
            setUpdatedProfile((prevState) => {
                const keys = name.split('.');
                if (keys.length > 1) {
                    return {
                        ...prevState,
                        doctor_details: {
                            ...prevState.doctor_details,
                            [keys[1]]: value
                        }
                    };
                } else {
                    return {
                        ...prevState,
                        [name]: value
                    };
                }
            });
        }
    };

    const handleImageClick = () => {
        console.log('log check');

        fileInputRef.current.click(); // Open file dialog
    };

    const handleUpdateProfile = async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            Object.keys(updatedProfile).forEach((key) => {
                if (key === 'doctor_details') {
                    Object.keys(updatedProfile[key]).forEach((nestedKey) => {
                        formData.append(`doctor_details[${nestedKey}]`, updatedProfile[key][nestedKey]);
                    });
                } else {
                    formData.append(key, updatedProfile[key]);
                }
            });
            formData.append('_method', 'PUT');

            const doctorId = updatedProfile.id;
            const updateProfileData = await updatedoctorProfileData(`/api/doctor/${doctorId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showToast(updateProfileData.message, "success");
            setIsEdit(false);
            setDoctorProfile(updateProfileData.profile);
        } catch (error) {
            console.error("Error updating profile", error);
            showToast("Failed to update profile. Please try again later.", "error");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <Div className='max-w-lg flex flex-col gap-2 text-sm'>
        <label htmlFor="image">
                <Div className='inline-block relative cursor-pointer'>
                    <Img className='w-36 rounded opacity-75'
                         src={updatedProfile?.doctor_details?.image ? updatedProfile?.doctor_details?.image : adminAssets.upload_area}
                         alt="doctor-profile" />
                    {isEdit && (
                        <Div className='absolute bottom-12 right-12' onClick={handleImageClick}>
                            <Img src={assets.upload_icon} alt="Upload" className='w-10 bottom-12 right-12'  />
                        </Div>
                    )}
                    <Input
                        ref={fileInputRef}
                        type='file'
                        name='image'
                        accept="image/*"
                        hidden
                        onChange={handleInputChange}
                    />
                </Div>
            </label>
      <br />
      {
        isEdit ?
        <Input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' name='name' type="text" value={updatedProfile?.name || ""} onChange={handleInputChange} /> :
        <p className='font-medium text-3xl text-neutral-800 mt-4 capitalize'>{doctorProfile?.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <Div>
        <p className='uppercase text-neutral-500 underline mt-3'>Contact Information</p>
        <Div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <P className='font-medium'>Email Id:</P>
          <P className='text-blue-500'>{doctorProfile?.email}</P>
          <P className='font-medium'>Phone:</P>
          {
            isEdit ?
            <input className='bg-gray-100 max-w-52' type="text" name='phone' value={updatedProfile?.phone || ""} onChange={handleInputChange} max={10}/> :
            <P className='text-blue-400'>{doctorProfile?.phone}</P>
          }
          <P className='font-medium'>Address:</P>
          {
            isEdit ?
            <textarea className='bg-gray-100' type="text" name='doctor_details.address' value={updatedProfile?.doctor_details?.address || ""} onChange={handleInputChange} /> :
            <P className='text-gray-500'>{doctorProfile?.doctor_details?.address}</P>
          }
        </Div>
      </Div>
      <Div>
        <P className='text-neutral-500 underline mt-3'>OTHER INFORMATION</P>

        <Div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
        <P>{doctorProfile?.doctor_details?.degree} - {doctorProfile?.doctor_details?.speciality}</P>
        <button className='py-0.5 px-2 border text-xs rounded-full'>{doctorProfile?.doctor_details?.experience}</button>
        </Div>
        <Div>
        <P className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
            About <img src={assets.info_icon} alt="" />
        </P>
        {
            isEdit ?
            <textarea className='text-gray-600 bg-gray-100  max-w-[700px] p-1 w-full' name="doctor_details.about" id="" onChange={handleInputChange} value={updatedProfile?.doctor_details?.about || ""}/>
            :
         <P className='text-sm text-gray-500 max-w-[700px] mt-1'>{doctorProfile?.doctor_details?.about}</P>
        }
        </Div>
        <P className='text-gray-500 font-medium mt-4'>
        Appointment fee:
        {
            isEdit ? <Input type='number' hidden={false} className='text-gray-600 bg-gray-100 max-w-52 p-1' name='doctor_details.fees'  value={updatedProfile?.doctor_details?.fees || ""} onChange={handleInputChange}/> :
            <span className='text-gray-600'> {currencySymbol}{doctorProfile?.doctor_details?.fees}</span>
        }
        </P>
      </Div>
      <Div className='mt-10'>
        {
          isEdit
          ? <div className='flex gap-2'>
            <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300' onClick={handleUpdateProfile}>{isLoading ? "Saving..." : "Save Information"}</button>
            <button className='border border-red-600 px-8 py-2 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300' onClick={()=>setIsEdit(false)}>Cancel</button>
          </div>
          : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300' onClick={()=>setIsEdit(true)}>Edit</button>
        }
      </Div>
    </Div>
  )
}

export default DoctorProfile
