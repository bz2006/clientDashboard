import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from '../../Components/Modal';
import { caseDescOptions } from '../../DataHelpers/caseOptions';
import { useAuth } from '../../contexts/AuthContext';
import LoadingOverlay from '../../Components/Loader';


function ChangePassword({ open, onClose }) {

    const [Language, setLanguage] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState(false)

    const { decryptData } = useAuth();

    console.log(decryptData());

    const id = decryptData().id
    const Change = (e) => {
        e.preventDefault();
        localStorage.setItem("lng", Language)
        onClose()
    }

    const VerifyPassword = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post("/api-trkclt/verify-password", { userid: id, password: currentPassword });

            if (response.status === 200) {
              //  message.success("Current Password Verified")
                setConfirmPassword(true)
            } else {
               // message.error("Invalid Current Password")
            }

        } catch (error) {
            //message.error("Invalid Current Password")
            console.error("Error adding Contact:", error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (confirmPassword === true) {
            try {
                const response = await axios.post(`/api-trkclt/update-user/${id}`, {password: newPassword});

                if (response.status === 200) {
                  //  message.success("Password Updated Successfully")
                    setCurrentPassword("")
                    setNewPassword("")
                    setCurrentPassword(false)
                    onClose()
                }
            } catch (error) {
               // message.error("Error while Updating Password")
                console.error('Error saving batch:', error.response?.data?.message || error.message);
            }
        } else {
           // message.error("Please Verify Your Current Password")
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose} size={"xl"}>

                <div className="text-gray-900 dark:text-gray-200">
                    <h2 className="text-2xl font-bold mb-6 mt-3 text-center">Change Login Password</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="w-full">
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="cpass"
                            >
                                Current Password
                            </label>
                            <input
                                type="text"
                                id="cpass"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                name="cpass"
                                placeholder="Enter Current Password"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />

                            <button
                                onClick={VerifyPassword}
                                className="bg-green-600 text-white mt-3 px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition duration-200"
                            >
                                Verify
                            </button>
                        </div>


                        <div className="w-full">
                            <label
                                className="block text-sm font-medium mb-2"
                                htmlFor="pass"
                            >
                                New Password
                            </label>
                            <input
                                type="text"
                                id="pass"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                name="pass"
                                placeholder="Enter New Password"
                                disabled={!confirmPassword}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="flex justify-between gap-4 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                            >
                                Change
                            </button>

                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default ChangePassword