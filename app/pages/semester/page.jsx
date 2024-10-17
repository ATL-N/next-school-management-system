"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaPlus,
  FaCalendarCheck,
  FaChartBar,
  FaLock,
} from "react-icons/fa";
import StatCard from "../../components/statcard";
import Modal from "../../components/modal/modal";
import Addeditsemester from "./add/addsemester";
import CustomTable from "../../components/listtableForm";
import { fetchData } from "../../config/configFile";
import { useSession } from "next-auth/react";
import DeleteUser from "../../components/deleteuser";
import ConfirmModal from "../../components/modal/confirmModal";
import LoadingPage from "../../components/generalLoadingpage";

const SemesterManagement = () => {
  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [semesterStats, setSemesterStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const authorizedRoles = ["admin", "head teacher"];
    const authorizedPermissions = ["add semester", "view staff"];

    if (session?.user?.roles?.some((role) => authorizedRoles.includes(role))) {
      setIsAuthorised(true);
    } else {
      setIsAuthorised(false);
    }
  }, [session]);

  function weekdaysRemaining(endDate, startDate = new Date()) {
    const endDateObject = new Date(endDate);
    const startDateObject = new Date(startDate);

    let weekdaysCount = 0;

    // Loop through each day between the startDate and endDate
    while (startDateObject <= endDateObject) {
      const dayOfWeek = startDateObject.getDay(); // 0 is Sunday, 6 is Saturday

      // Count only weekdays (1 to 5 = Monday to Friday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        weekdaysCount++;
      }

      // Move to the next day
      startDateObject.setDate(startDateObject.getDate() + 1);
    }

    return weekdaysCount;
  }

  function getWeekdaysInRange(startDate, endDate) {
    const weekdays = [];
    let currentDate = new Date(startDate);

    while (currentDate >= new Date(endDate)) {
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        // Weekdays are 1-5 (Monday to Friday)
        weekdays.push(new Date(currentDate));
        console.log("weekdays111", weekdays);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("weekdays", weekdays);
    return weekdays.length;
  }

  useEffect(() => {
    fetchSemesters();
    fetchSemesterStats();
  }, []);

  const fetchSemesters = async () => {
    // Replace with actual API call
    try {
      setIsLoading(true);
      const data = await fetchData(`/api/semester/all`, "", false);
      setSemesters(data);
    } catch (error) {
      console.log("error fetching semester", error);
    } finally {
      setIsLoading(false);
    }
  };

  const headerNames = ["id", "name", "start date", "end date", "status"];

  const fetchSemesterStats = async () => {
    // Replace with actual API call
    const data = [
      { name: "Fall 2023", courseCount: 25, studentCount: 500 },
      { name: "Spring 2024", courseCount: 30, studentCount: 550 },
      // Add more stats as needed
    ];
    setSemesterStats(data);
  };

  const handleAddSemester = () => {
    if (!isAuthorised) {
      setModalContent(
        <div className="flex items-center text-cyan-700">
          You are not authorised to be on this page
        </div>
      );
      setShowModal(true);
    } else {
      setModalContent(
        <div>
          <Addeditsemester
            onCancel={() => {
              setShowModal(false);
            }}
          />
        </div>
      );
      setShowModal(true);
    }
  };

  const handleEditSemester = async (semester_id) => {
    if (!isAuthorised) {
      setModalContent(
        <div className="flex items-center text-cyan-700">
          You are not authorised to be on this page
        </div>
      );
      setShowModal(true);
    } else {
      setIsLoading(true);
      try {
        // const [semesterdata] = await Promise.all([
        //   fetchData(`/api/semester/semesterdetails/${semester_id}`, "", true),
        // ]);

        const semdata = semesters.filter((sem) => sem.id === semester_id);

        setModalContent(
          <div>
            <Addeditsemester
              id={semester_id}
              semesterdata={semdata[0]}
              onCancel={() => {
                setShowModal(false);
                fetchSemesters();
              }}
            />
          </div>
        );
      } catch (err) {
      } finally {
        setShowModal(true);
        setIsLoading(false);
      }
    }
  };

  const handleDeleteSemester = async (semester_id) => {
    if (!isAuthorised) {
      setModalContent(
        <div className="flex items-center text-cyan-700">
          You are not authorised to perform this action
        </div>
      );
      setShowModal(true);
    } else {
      try {
        setIsLoading(true);
        setModalContent(
          <div>
            <DeleteUser
              userData={semester_id}
              onClose={() => setShowModal(false)}
              onDelete={async () => {
                const toastId2 = toast.loading("Processing your request...");

                const subjectdata = {
                  user_id: session.user?.id,
                };

                try {
                  const response = await fetch(
                    `/api/semester/deleteSemester/${semester_id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(subjectdata),
                    }
                  );

                  if (!response.ok) {
                    // throw new Error(
                    //   id ? "Failed to delete staff" : "Failed to add staff"
                    // );

                    toast.update(toastId2, {
                      render: "Failed to delete staff!!.",
                      type: "error",
                      isLoading: false,
                      autoClose: 2000,
                    });
                  }

                  // Add API call to delete staff
                  await fetchSemesters();
                  // toast.success("Staff deleted successfully...");
                  toast.update(toastId2, {
                    render: "Staff deleted successfully...",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                  });
                  setShowModal(false);
                  // alert("staff deleted successfully!");
                } catch (error) {
                  console.error("Error deleting staff:", error);
                  // toast.error("An error occurred. Please try again.");
                  toast.update(toastId2, {
                    render: "An error occurred. Please try again.",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                  });

                  // alert("An error occurred. Please try again.");
                }
              }}
            />
          </div>
        );
      } catch (error) {
        console.log(error);
      } finally {
        setShowModal(true);
        setIsLoading(false);
      }
    }
  };

  const handleCloseSemester = async (semester_id) => {
    if (!isAuthorised) {
      setModalContent(
        <div className="flex items-center text-cyan-700">
          You are not authorised to perform this action
        </div>
      );
      // setShowModal(true);
    } else {
      try {
        setIsLoading(true);
        setIsModalOpen(true);
      } catch (error) {
        console.log(error);
      } finally {
        // setShowModal(true);
        setIsLoading(false);
      }
    }
  };

  const handleBulkPromote = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    const toastId = toast.loading("Processing...");

    const userData = {
      user_id: session?.user?.id,
    };

    try {
      const url = "/api/grading/bulkpromotion";
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.error || "Failed to promote students and complete semester";
        // throw new Error(errorMessage);
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }

      // console.log("Operation completed successfully:", result);

      toast.update(toastId, {
        render:
          result.message ||
          `Semester Closed successfully. If this is a promotional term, make sure to promote the students if neccessary before closing this term!..`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      // Optionally, update your local state or trigger a re-fetch of data here
      // For example:
      fetchSemesterStats();
      fetchSemesters();
      return;
    } catch (error) {
      console.error("Error:", error);
      toast.update(toastId, {
        render: error.message || "An error occurred",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <LoadingPage />;
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBulkPromote}
        title={"Close Active Semester"}
        message={
          "Are you sure you want to Close the current active semester?. This action confirms all student promotions and cant be reversed!!. Would you like to continue?"
        }
      />

      <div className="pb-16 text-cyan-600">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Semester Management
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<FaCalendarAlt />}
            title="Total Semesters"
            value={semesters?.length}
          />
          <StatCard
            icon={<FaCalendarCheck />}
            title="Active Semester"
            value={
              semesters?.filter((sem) => sem.status === "active")[0]
                ?.semester_name || "No active semester"
            }
          />
          <StatCard
            icon={<FaChartBar />}
            title="Week Days Remaining"
            value={
              weekdaysRemaining(
                semesters?.filter((sem) => sem.status === "active")[0]?.end_date
              ) || "calculating..."
            }
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-700">
              Semester List
            </h2>
            {isAuthorised && (
              <>
                <button
                  onClick={handleCloseSemester}
                  className="p-2 bg-red-700 text-white rounded hover:bg-red-600 flex items-center"
                >
                  <FaLock
                    className="mr-2"
                    title="End current active semester"
                  />{" "}
                  Close Semester
                </button>

                <button
                  onClick={handleAddSemester}
                  className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add New Semester
                </button>
              </>
            )}
          </div>

          <div className="overflow-x-auto tableWrap">
            {semesters.length > 0 ? (
              <CustomTable
                data={semesters}
                headerNames={headerNames}
                maxTableHeight="40vh"
                height="20vh"
                handleDelete={handleDeleteSemester}
                handleEdit={handleEditSemester}
                displaySearchBar={false}
                displayDetailsBtn={false}
                itemDetails="subject id."
                displaybtnlink="/pages/subjects/details/"
              />
            ) : (
              <div>
                <p>no semester added to the system yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default SemesterManagement;
