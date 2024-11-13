import React, { useEffect, useRef, useState } from "react";
import { adminAssets, assets } from "./../assets/assets";
import { getToken } from "../utils/auth";
import { getUserProfile, updateUserProfile } from "../apis/user";
import { showToast } from "../utils/toast";
import Div from "../common/Div";

const MyProfile = () => {
    const fileInputRef = useRef(null);
    const [userProfile, setUserProfile] = useState({});
    const [updatedProfile, setUpdatedProfile] = useState({});
    const token = getToken("token");
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const getMyProfileData = async () => {
        try {
            const profile = await getUserProfile("/api/user-profile");

           
            const profileWithDefaults = {
                ...profile.profile,
                user_details: {
                    ...profile.profile.user_details,
                    address: profile.profile.user_details?.address || "",
                    dob: profile.profile.user_details?.dob || "",
                    gender: profile.profile.user_details?.gender || "",
                },
            };

            setUserProfile(profileWithDefaults);
            setUpdatedProfile(profileWithDefaults);
        } catch (error) {
            console.error("Error fetching my profile", error);
        }
    };
    useEffect(() => {
        if (token) {
            getMyProfileData();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files.length > 0) {
            const file = files[0];
            const imagePreviewUrl = URL.createObjectURL(file);

            setUpdatedProfile((prevState) => ({
                ...prevState,
                image: imagePreviewUrl,
                imageFile: file,
            }));
        } else {
            setUpdatedProfile((prevState) => ({
                ...prevState,
                user_details: {
                    ...prevState.user_details,
                    [name]: value,
                },
                [name]:
                    name !== "address" && name !== "dob" && name !== "gender"
                        ? value
                        : prevState[name],
            }));
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            Object.keys(updatedProfile).forEach((key) => {
                formData.append(key, updatedProfile[key]);
            });

            const updateProfileData = await updateUserProfile(
                "/api/update-user-profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            showToast(updateProfileData.message, "success");
            setUserProfile(updatedProfile);
            setIsEdit(false);
        } catch (error) {
            console.error("Error updating profile", error);
            showToast(
                "Failed to update profile. Please try again later.",
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
        <Div className="max-w-lg flex flex-col gap-2 text-sm">
            <label htmlFor="image">
                <Div className="inline-block relative cursor-pointer">
                    <img
                        className="w-36 rounded opacity-75"
                        src={
                            updatedProfile.user_details?.image
                                ? updatedProfile.user_details?.image
                                : adminAssets.upload_area
                        }
                        alt="user-profile"
                    />
                    {isEdit && (
                        <Div
                            className="absolute bottom-12 right-12"
                            onClick={handleImageClick}
                        >
                            <img
                                src={assets.upload_icon}
                                alt="Upload"
                                className="w-10 bottom-12 right-12"
                            />
                        </Div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        hidden
                        onChange={handleInputChange}
                    />
                </Div>
            </label>
            <br />
            {isEdit ? (
                <input
                    className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
                    name="name"
                    type="text"
                    value={updatedProfile.name || ""}
                    onChange={handleInputChange}
                />
            ) : (
                <p className="font-medium text-3xl text-neutral-800 mt-4 capitalize">
                    {userProfile.name}
                </p>
            )}
            <hr className="bg-zinc-400 h-[1px] border-none" />
            <Div>
                <p className="uppercase text-neutral-500 underline mt-3">
                    Contact Information
                </p>
                <Div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium">Email Id:</p>
                    <p className="text-blue-500">{userProfile.email}</p>
                    <p className="font-medium">Phone:</p>
                    {isEdit ? (
                        <input
                            className="bg-gray-100 max-w-52"
                            type="text"
                            name="phone"
                            value={updatedProfile.phone || ""}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p className="text-blue-400">{userProfile?.phone}</p>
                    )}
                    <p className="font-medium">Address:</p>
                    {isEdit ? (
                        <textarea
                            className="bg-gray-100"
                            type="text"
                            name="address"
                            value={updatedProfile.user_details?.address || ""}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p className="text-gray-500">
                            {updatedProfile.user_details?.address}
                        </p>
                    )}
                </Div>
            </Div>
            <Div>
                <p className="text-neutral-500 underline mt-3">
                    BASIC INFORMATION
                </p>
                <Div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3">
                    <p className="font-medium">Gender:</p>
                    {isEdit ? (
                        <select
                            className="max-w-20 bg-gray-100"
                            name="gender"
                            onChange={handleInputChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    ) : (
                        <p className="text-gray-500">
                            {updatedProfile.user_details?.gender}
                        </p>
                    )}
                    <p className="font-medium">Birthday:</p>
                    {isEdit ? (
                        <input
                            className="max-w-28 bg-gray-100"
                            name="dob"
                            type="date"
                            value={updatedProfile.user_details.dob || ""}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p className="text-gray-500">
                            {updatedProfile.user_details?.dob}
                        </p>
                    )}
                </Div>
            </Div>
            <Div className="mt-10">
                {isEdit ? (
                    <Div className="flex gap-2">
                        <button
                            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                            onClick={handleUpdateProfile}
                        >
                            {isLoading ? "Saving..." : "Save Information"}
                        </button>
                        <button
                            className="border border-red-600 px-8 py-2 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300"
                            onClick={() => setIsEdit(false)}
                        >
                            Cancel
                        </button>
                    </Div>
                ) : (
                    <button
                        className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit
                    </button>
                )}
            </Div>
        </Div>
    );
};

export default MyProfile;
