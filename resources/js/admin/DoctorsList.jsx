import React, { useEffect, useRef, useState } from 'react';
import { getDoctorData, updateDoctorData } from '../apis/doctor';
import { adminAssets } from '../assets/assets';
import { showToast } from '../utils/toast';
import Div from '../common/Div';

const DoctorsList = () => {
    const fileInputRef = useRef(null);
    const [doctors, setDoctors] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [doctorEditData, setDoctorEditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});

    const fetchDoctorsData = async () => {
        try {
            const doctorsData = await getDoctorData('/api/doctor');
            setDoctors(doctorsData.doctors);
        } catch (error) {
            console.error('Error fetching doctor data', error);
        }
    };

    useEffect(() => {
        fetchDoctorsData();
    }, []);


    const doctorEdit = (doctorId) => {
        const selectedDoctor = doctors.find((doc) => doc.id === doctorId);
        setDoctorEditData(selectedDoctor);
        setUpdatedProfile({
            ...selectedDoctor,
            doctor_details: {
                ...selectedDoctor?.doctor_details,
                experience: selectedDoctor?.doctor_details?.experience || '',
            },
        });
        setIsOpen(true);
    };

    const handleModalClose = () => setIsOpen(false);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files.length > 0) {
            const file = files[0];
            const imagePreviewUrl = URL.createObjectURL(file);

            setUpdatedProfile((prevState) => ({
                ...prevState,
                doctor_details: {
                    ...prevState.doctor_details,
                    image: imagePreviewUrl,
                    imageFile: file,
                },
            }));
        } else {
            setUpdatedProfile((prevState) => ({
                ...prevState,
                doctor_details: {
                    ...prevState.doctor_details,
                    [name]: value,
                },
            }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const formData = new FormData();


            formData.append('id', updatedProfile.id);
            formData.append('role_id', updatedProfile.role_id);
            formData.append('name', updatedProfile.name);
            formData.append('email', updatedProfile.email);
            formData.append('phone', updatedProfile.phone);
            formData.append('_method', 'PUT');


            if (updatedProfile.doctor_details) {
                Object.keys(updatedProfile.doctor_details).forEach(key => {
                    formData.append(`doctor_details[${key}]`, updatedProfile.doctor_details[key]);
                });
            }


            if (updatedProfile.appointments) {
                Object.keys(updatedProfile.appointments).forEach(key => {
                    formData.append(`appointments[${key}]`, updatedProfile.appointments[key]);
                });
            }


            const doctorId = updatedProfile.id;
            const updateProfileData = await updateDoctorData(`/api/doctor/${doctorId}`, formData);

            showToast(updateProfileData.message, 'success');
            setUpdatedProfile({});
            setIsOpen(false);
            fetchDoctorsData();
        } catch (error) {
            console.error('Error updating doctor profile', error);
            showToast('Failed to update doctor. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <Div className="m-5 max-h-[90vh] overflow-y-scroll">
                <h1 className="text-lg font-medium">All Doctors</h1>
                <Div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                    {doctors.map((item) => (
                        <Div
                            key={item.id}
                            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
                        >
                            <img
                                src={item?.doctor_details?.image}
                                alt="doctor-img"
                                className="bg-blue-50"
                            />
                            <Div className="p-4">
                                <p className="text-gray-900 text-lg font-medium capitalize">
                                    {item.name}
                                </p>
                                <p className="text-gray-600 text-sm capitalize">
                                    {item?.doctor_details?.speciality || 'Speciality not available'}
                                </p>
                                <Div className="mt-2 flex items-center gap-1 text-sm justify-between">
                                    <span className="flex items-center gap-1">
                                        <input type="checkbox" readOnly checked />
                                        <p>Available</p>
                                    </span>
                                    <button
                                        onClick={() => doctorEdit(item.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-xl"
                                    >
                                        Edit
                                    </button>
                                </Div>
                            </Div>
                        </Div>
                    ))}
                </Div>
            </Div>

            {isOpen && doctorEditData && (
                <Div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
                        <form onSubmit={handleFormSubmit}>
                            <Div className="flex items-center gap-4 mb-8 text-gray-500">
                                <label htmlFor={`doc-img-${doctorEditData.id}`}>
                                    <img
                                        className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
                                        src={
                                            updatedProfile?.doctor_details?.image ||
                                            adminAssets.upload_area
                                        }
                                        alt="Doctor"
                                    />
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    id={`doc-img-${doctorEditData.id}`}
                                    hidden
                                    onChange={handleInputChange}
                                    ref={fileInputRef}
                                />
                                <p>
                                    Upload doctor <br /> picture
                                </p>
                            </Div>

                            <Div className="flex-1 flex flex-col gap-1">
                                <p>Doctor Name</p>
                                <input
                                    className="border rounded px-3 py-2"
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={updatedProfile.name || ''}
                                    onChange={handleInputChange}
                                    required
                                    readOnly
                                />
                            </Div>

                            <Div className="flex-1 flex flex-col gap-1">
                                <p>Experience</p>
                                <select
                                    className="border rounded px-2 py-2"
                                    name="experience"
                                    value={updatedProfile?.doctor_details?.experience || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Experience</option>
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Years">2 Years</option>
                                    <option value="3 Years">3 Years</option>
                                    <option value="4 Years">4 Years</option>
                                    <option value="5 Years">5 Years</option>
                                    <option value="6 Years">6 Years</option>
                                    <option value="8 Years">8 Years</option>
                                    <option value="9 Years">9 Years</option>
                                    <option value="10 Years">10 Years</option>
                                </select>
                            </Div>

                            <Div className="flex-1 flex flex-col gap-1">
                                <p>Fees</p>
                                <input
                                    className="border rounded px-3 py-2"
                                    type="number"
                                    placeholder="Doctor fees"
                                    name="fees"
                                    value={updatedProfile?.doctor_details?.fees || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Div>

                            <Div className="flex-1 flex flex-col gap-1">
                                <p>Availability</p>
                                <Div className="flex items-center justify-between gap-3">
                                    <Div className="form-check form-check-inline flex items-center gap-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="availability"
                                            value="1"
                                            checked={updatedProfile?.doctor_details?.availability === '1'}
                                            onChange={handleInputChange}
                                        />
                                        <label>Available</label>
                                    </Div>
                                    <Div className="form-check form-check-inline flex items-center gap-1">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="availability"
                                            value="0"
                                            checked={updatedProfile?.doctor_details?.availability === '0'}
                                            onChange={handleInputChange}
                                        />
                                        <label>Not Available</label>
                                    </Div>
                                </Div>
                            </Div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-1"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Update'}
                            </button>
                        </form>
                        <button
                            className="mt-4 w-full py-2 border rounded"
                            onClick={handleModalClose}
                        >
                            Close
                        </button>
                    </Div>
                </Div>
            )}
        </>
    );
};

export default DoctorsList;
