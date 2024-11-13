import React, { useRef, useState } from "react";
import { adminAssets } from './../assets/assets';
import { showToast } from "../utils/toast";
import { addDoctorData } from "../apis/doctor";
import Div from "../common/Div";

const AddDoctor = () => {
    const fileInputRef = useRef(null);
    const [doctorProfile, setdoctorProfile] = useState({});
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files.length > 0) {
            const file = files[0];

            const imagePreviewUrl = URL.createObjectURL(file);

            setUpdatedProfile((prevState) => ({
                ...prevState,
                image: imagePreviewUrl,
                imageFile: file
            }));
        } else {
            setUpdatedProfile((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const addDoctor = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const formData = new FormData();
            Object.keys(updatedProfile).forEach((key) => {
                formData.append(key, updatedProfile[key]);
            });
            // console.log(formData);
            // return

            const updateProfileData = await addDoctorData("/api/doctor", formData, {});

            showToast(updateProfileData.message, "success");
            setdoctorProfile(updatedProfile);
            setUpdatedProfile({})
        } catch (error) {
            console.error("Error adding a doctor profile", error);
            showToast(
                "Failed to add doctor. Please try again later.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };
    return (
        <form className="w-full" onSubmit={addDoctor}>
            <p className="mb-3 text-lg font-medium">Add Doctor</p>
            <Div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <Div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img
                            className="w-16 bg-gray-100 rounded-full cursor-pointer"
                            src={updatedProfile.image ? updatedProfile.image : adminAssets.upload_area}
                            alt=""
                        />
                    </label>
                    <input type='file'
                        name='image'
                        accept="image/*"
                        id="doc-img"
                        hidden
                        onChange={handleInputChange}
                        ref={fileInputRef}
                    />
                    <p>
                        Upload doctor <br /> picture
                    </p>
                </Div>
                <Div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    <Div className="w-full lg:flex-1 flex flex-col gap-4">
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Doctor name</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Name"
                                required
                                value={updatedProfile.name || ""}
                                name="name"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Doctor Email</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="email"
                                placeholder="Email"
                                required
                                value={updatedProfile.email || ""}
                                name="email"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Doctor Phone</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="number"
                                placeholder="Phone Number"
                                required
                                value={updatedProfile.phone || ""}
                                name="phone"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Set Password</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="password"
                                placeholder="Password"
                                required
                                value={updatedProfile.password || ""}
                                name="password"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Experience</p>
                            <select className="border rounded px-2 py-2" name="experience" onChange={handleInputChange} required>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </Div>

                    </Div>
                    <Div className="w-full lg:flex-1 flex flex-col gap-4">
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Speciality</p>
                            <select className="border rounded px-2 py-2" name="speciality" onChange={handleInputChange} required>
                                <option value="General physician">
                                    General physician
                                </option>
                                <option value="Gynecologist">
                                    Gynecologist
                                </option>
                                <option value="Dermatologist">
                                    Dermatologist
                                </option>
                                <option value="Pediatricians">
                                    Pediatricians
                                </option>
                                <option value="Neurologist">
                                    Neurologist
                                </option>
                                <option value="Gastroenterologist">
                                    Gastroenterologist
                                </option>
                            </select>
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Degree</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Degree"
                                required
                                value={updatedProfile.degree || ""}
                                name="degree"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Address</p>
                            <textarea
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Address"
                                required
                                value={updatedProfile.address || ""}
                                name="address"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Fees</p>
                            <input
                                className="border rounded px-3 py-2"
                                type="number"
                                placeholder="Doctor fees"
                                required
                                value={updatedProfile.fees || ""}
                                name="fees"
                                onChange={handleInputChange}
                            />
                        </Div>
                        <Div className="flex-1 flex flex-col gap-1">
                            <p>Availability</p>
                            <Div className="flex items-center justify-between gap-3">
                                <Div className="form-check form-check-inline flex items-center gap-1">
                                    <input
                                        className="form-check-input equipment-availability-radio-input equipment-radio radio-one"
                                        type="radio" name="availability" id="inlineRadio1" value={updatedProfile.availability || "1"} onChange={handleInputChange} required/>
                                    <label className="form-check-label" htmlFor="inlineRadio1">Available</label>
                                </Div>
                                <Div className="form-check form-check-inline flex items-center gap-1">
                                    <input className="form-check-input equipment-radio" type="radio"
                                        name="availability" id="inlineRadio2" value={updatedProfile.availability || "0"} onChange={handleInputChange} required/>
                                    <label className="form-check-label" htmlFor="inlineRadio2">Not Available</label>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                </Div>
                <Div>
                        <p className="mt-4 mb-2">About Doctor</p>
                        <textarea
                            className="w-full px-4 pt-2 border rounded"
                            rows="5"
                            placeholder="write about doctor"
                            name="about"
                            onChange={handleInputChange}
                            required
                            value={updatedProfile.about || ""}
                        ></textarea>
                    </Div>
                    <button
                        type="submit"
                        className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
                    >
                        {isLoading ? "Saving" : "Add doctor"}
                    </button>
            </Div>
        </form>
    );
};

export default AddDoctor;
