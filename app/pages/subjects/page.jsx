// pages/dashboard/subjects/index.js
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaInfoCircle,
  FaGraduationCap,
  FaChalkboardTeacher,
} from "react-icons/fa";
import DeleteUser from "../../components/deleteuser";
import StatCard from "../../components/statcard";
import Modal from "../../components/modal/modal";
import CustomTable from "../../components/listtableForm";
import AddnewSubject from "./add/addsubject";
import { fetchData } from "../../config/configFile";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/generalLoadingpage";

const SubjectManagement = () => {
  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAuthorised, setIsAuthorised] = useState(false);
  const [isDelSubAuthorised, setIsDelSubAuthorised] = useState(false);

  useEffect(() => {
    const authorizedRoles = ["admin", "head teacher"];
    const authorizedPermissions = ["view subjects"];

    if (
      session?.user?.permissions?.some((permission) =>
        authorizedPermissions.includes(permission)
      )
    ) {
      setIsAuthorised(true);
    } else {
      setIsAuthorised(false);
    }

    const authorizedDelSubPermissions = ["delete subject"];

    if (
      session?.user?.permissions?.some((permission) =>
        authorizedDelSubPermissions.includes(permission)
      )
    ) {
      setIsDelSubAuthorised(true);
    } else {
      setIsDelSubAuthorised(false);
    }
  }, [session]);

  const headerNames = ["id", "Subject Name"];

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    fetchSubjects();
    // fetchSubjectStats();
  }, []);

  const fetchSubjects = async (searchQuery1 = "") => {
    // const toastId = toast.loading("Fetching subjects...");

    try {
      setIsLoading(true);
      // setError(null);
      const data = await fetchData("/api/subjects/allsubjects", "", false);

      setSubjects(data);
      // return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    fetchSubjects(e.target.value);
  };

  const handleAddSubject = async () => {
    try {
      setModalContent(
        <AddnewSubject
          setShowModal={setShowModal}
          onCancel={() => {
            setShowModal(false);
            fetchSubjects();
          }}
        />
      );
    } catch (err) {
      console.log("Error fetching teacher data:", err);
    } finally {
      setShowModal(true);
    }
  };

  const handleEditSubject = async (subject_id) => {
    console.log("subject_id2", subject_id);
    setIsLoading(true);
    try {
      const [subjectdata] = await Promise.all([
        fetchData(`/api/subjects/subjectdetails/${subject_id}`, "", true),
      ]);
      setModalContent(
        <div>
          <AddnewSubject
            id={subject_id}
            subjectdata={subjectdata}
            onCancel={() => {
              setShowModal(false);
            }}
          />
        </div>
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const handleDeleteSubject = async (subject_id) => {
    if (!isDelSubAuthorised) {
      setModalContent(
        <div className="flex items-center">
          You are not authorised to be on this page
        </div>
      );
      setShowModal(true);
    } else {
      try {
        setIsLoading(true);
        setModalContent(
          <div>
            <DeleteUser
              userData={subject_id}
              onClose={() => setShowModal(false)}
              onDelete={async () => {
                const toastId2 = toast.loading("Processing your request...");

                const subjectdata = {
                  user_id: session.user?.id,
                };

                try {
                  const response = await fetch(
                    `/api/subjects/deleteSubject/${subject_id}`,
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
                    //   id ? "Failed to delete subject" : "Failed to add subject"
                    // );

                    toast.update(toastId2, {
                      render: "Failed to delete subject!!.",
                      type: "error",
                      isLoading: false,
                      autoClose: 2000,
                    });
                  }

                  // Add API call to delete subject
                  await fetchSubjects();
                  // toast.success("subject deleted successfully...");
                  toast.update(toastId2, {
                    render: "subject deleted successfully...",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                  });
                  // alert("subject deleted successfully!");
                } catch (error) {
                  console.error("Error deleting subject:", error);
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

  if (status === "loading") {
    return (
      <div className="text-cyan-700">
        <LoadingPage />
      </div>
    );
  }

  if (!isAuthorised) {
    return (
      <div className="flex items-center text-cyan-700">
        You are not authorised to be on this page
      </div>
    );
  }

  return (
    <>
      <div className="pb-16 text-cyan-600">
        <h1 className="text-3xl font-bold mb-6 text-cyan-700">
          Subject Management
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FaBook />}
            title="Total Subjects"
            value={subjects.length}
          />
          <StatCard
            icon={<FaGraduationCap />}
            title="Grade Levels"
            value={new Set(subjects.map((s) => s.grade_level)).size}
          />
          {/* <StatCard
            icon={<FaChalkboardTeacher />}
            title="Departments"
            value={new Set(subjects.map((s) => s.department)).size}
          /> */}

          {/* <StatCard
            icon={<FaBook />}
            title="Active Subjects"
            value={subjects?.filter((s) => s.is_active).length}
          /> */}
        </div>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-cyan-700">
              Subject List
            </h2>
            <button
              onClick={handleAddSubject}
              className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add New Subject
            </button>
          </div>
          <div className="overflow-x-auto tableWrap">
            {subjects.length > 0 ? (
              <CustomTable
                data={subjects}
                headerNames={headerNames}
                maxTableHeight="40vh"
                height="20vh"
                handleDelete={handleDeleteSubject}
                handleEdit={handleEditSubject}
                displaySearchBar={false}
                displayDetailsBtn={false}
                itemDetails="subject id."
                displaybtnlink="/pages/subjects/details/"
              />
            ) : (
              <div>
                <LoadingPage />
              </div>
            )}
          </div>
        </div>
        {/* <div className="bg-white p-4 rounded shadow mb-6 text-cyan-500">
          <h2 className="text-xl font-semibold mb-4 text-cyan-700">
            Subjects by Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="subjects" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalContent}</Modal>
      )}
    </>
  );
};

export default SubjectManagement;
