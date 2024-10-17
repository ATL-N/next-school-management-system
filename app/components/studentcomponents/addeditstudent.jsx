// components/AddStudentForm.js
"use client";

import React from "react";
import { useParams } from "next/navigation";

import {
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSchool,
  FaMoneyBill,
  FaUpload,
  FaNotesMedical,
  FaAllergies,
  FaSyringe,
  FaHeartbeat,
} from "react-icons/fa";
import Addeditparent from "../parentcomponent/addeditparent";
import Studentparentrelationship from "../studentparentrelationship";
import {
  SelectField,
  InputField,
  TextAreaField,
} from "../inputFieldSelectField";

const Addeditstudent = ({
  formData,
  parentsData,
  classesData,
  handleSubmit,
  handleChange,
  imagePreview,
  onCancel,
  id,
  isDetails = false,
}) => {

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const get20YearsAgoString = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    return date.toISOString().split("T")[0];
  };

  const title = id
    ? `Edit ${formData.first_name}(${formData.student_id}) is`
    : "Add new Student";

  function extractParentData(parents) {
    return parents.map((parent) => ({
      parent_id: parent.parent_id,
      parent_name: `${parent.last_name.trim()} ${parent.other_names.trim()} (${
        parent.phone
      })`,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-cyan-700 mb-8 text-center">
        {title}
      </h2>

      {/* Image Upload Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Student preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaUser size={48} />
            </div>
          )}
        </div>
        {!isDetails && (
          <>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleChange}
              isReadOnly={isDetails}
              className="hidden"
            />
            <label
              htmlFor="photo"
              className="cursor-pointer bg-cyan-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-cyan-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500 transition-colors flex items-center"
            >
              <FaUpload className="mr-2" />
              Upload Student Image
            </label>
          </>
        )}
      </div>

      <div className="space-y-8">
        {/* Student Information */}
        <section>
          <h3 className="text-2xl font-semibold text-cyan-600 mb-6 border-b border-cyan-200 pb-2">
            Student Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name *"
              name="first_name"
              icon={<FaUser />}
              value={formData.first_name}
              onChange={handleChange}
              isReadOnly={isDetails}
            />
            <InputField
              label="Last Name *"
              name="last_name"
              icon={<FaUser />}
              value={formData.last_name}
              onChange={handleChange}
              isReadOnly={isDetails}
            />
            <InputField
              label="Other Names"
              name="other_names"
              icon={<FaUser />}
              value={formData.other_names}
              onChange={handleChange}
              isReadOnly={isDetails}
              isRequired={false}
            />

            <InputField
              label="Date of Birth *"
              name="date_of_birth"
              type="date"
              icon={<FaCalendarAlt />}
              value={formData.date_of_birth}
              onChange={handleChange}
              isReadOnly={isDetails}
              max={get20YearsAgoString()}
            />

            <SelectField
              label="Gender *"
              name="gender"
              icon={<FaVenusMars />}
              value={formData.gender}
              onChange={handleChange}
              isReadOnly={isDetails}
              options={[
                { value: "", label: "Select Gender" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
            />
            <SelectField
              label="Student Class *"
              name="class_id"
              icon={<FaSchool />}
              value={formData.class_id}
              onChange={handleChange}
              isReadOnly={isDetails}
              options={[
                { value: "", label: "Select current class" },
                ...classesData?.map((class_) => ({
                  value: class_.class_id,
                  label: class_.class_name,
                })),
              ]}
            />

            <InputField
              label="Current Fees Owed *"
              name="amountowed"
              type="number"
              icon={<FaMoneyBill />}
              value={formData.amountowed}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="GHC"
            />

            <InputField
              label="Phone *"
              name="phone"
              type="tel"
              icon={<FaPhone />}
              value={formData.phone}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="+1234567890"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              icon={<FaEnvelope />}
              value={formData.email}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="john@example.com"
              isRequired={false}
            />
            <InputField
              label="Enrollment Date *"
              name="enrollment_date"
              type="date"
              icon={<FaCalendarAlt />}
              value={formData.enrollment_date}
              onChange={handleChange}
              isReadOnly={isDetails}
              max={getTodayString()}
            />

            <InputField
              label="National ID NO."
              name="national_id"
              type="text"
              icon={<FaCalendarAlt />}
              value={formData.national_id}
              onChange={handleChange}
              isReadOnly={isDetails}
              isRequired={false}
            />
            <InputField
              label="Birth Certificate ID *"
              name="birth_cert_id"
              type="text"
              icon={<FaCalendarAlt />}
              value={formData.birth_cert_id}
              onChange={handleChange}
              isReadOnly={isDetails}
              isRequired={false}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 pt-3">
            <TextAreaField
              label="Address *"
              name="residential_address"
              icon={<FaNotesMedical className="text-gray-400" />}
              placeholder="Ghana Post GPS, 123 Main St, Town/City, Region, Country"
              onChange={handleChange}
              isReadOnly={isDetails}
              value={formData.residential_address}
            />
          </div>
        </section>
        <section>
          <h3 className="text-2xl font-semibold text-cyan-600 mb-6 border-b border-cyan-200 pb-2">
            Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Health Insurance ID *"
              name="health_insurance_id"
              type="text"
              icon={<FaCalendarAlt />}
              value={formData.health_insurance_id}
              onChange={handleChange}
              isReadOnly={isDetails}
              isRequired={false}
            />

            <SelectField
              label="Blood Group"
              name="blood_group"
              icon={<FaHeartbeat />}
              value={formData.blood_group}
              onChange={handleChange}
              isReadOnly={isDetails}
              isRequired={false}
              options={[
                { value: "", label: "Select Blood Group" },
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
            />

            <TextAreaField
              label="Medical Conditions"
              name="medical_conditions"
              icon={<FaNotesMedical className="text-gray-400" />}
              value={formData.medical_conditions}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="Enter medical conditions"
            />

            <TextAreaField
              label="Allergies"
              name="allergies"
              icon={<FaAllergies className="text-gray-400" />}
              value={formData.allergies}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="Enter allergies"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <TextAreaField
              label="Vaccination Status"
              name="vaccination_status"
              icon={<FaSyringe className="text-gray-400" />}
              value={formData.vaccination_status}
              onChange={handleChange}
              isReadOnly={isDetails}
              placeholder="Enter vaccination status details"
            />
          </div>
        </section>

        {/* Parent Information */}
        <section>
          <h3 className="text-2xl font-semibold text-cyan-600 mb-6 border-b border-cyan-200 pb-2">
            Parent Information
          </h3>

          {[1, 2].map((parentIndex) => (
            <div key={parentIndex} className="mb-8">
              <h4 className="text-lg font-medium text-cyan-600 mb-4">
                Parent {parentIndex}
              </h4>
              <SelectField
                label={`Select Parent ${parentIndex}`}
                isRequired={false}
                name={`parent${parentIndex}_selection`}
                value={formData[`parent${parentIndex}_selection`]}
                onChange={handleChange}
                isReadOnly={isDetails}
                options={[
                  { value: "", label: "Select Existing Parent (Optional)" },
                  ...extractParentData(parentsData)?.map((parent) => ({
                    value: parent.parent_id,
                    label: parent.parent_name,
                  })),
                ]}
              />

              {formData[`parent${parentIndex}_selection`] && !id ? (
                <>
                  <p className="mt-2 text-sm text-red-500">
                    <h1>
                      Parent {parentIndex} information retrieved from system.
                      Select the relationship with the student{" "}
                    </h1>
                  </p>
                  <Studentparentrelationship
                    formData={formData}
                    handleChange={handleChange}
                    parentIndex={parentIndex - 1}
                    isDetails={isDetails}
                  />
                </>
              ) : (
                <Addeditparent
                  formData={formData}
                  handleChange={handleChange}
                  parentIndex={parentIndex - 1}
                  isDetails={isDetails}
                />
              )}
            </div>
          ))}
        </section>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
        >
          Close
        </button>
        {!isDetails && (
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
          >
            Add Student
          </button>
        )}
      </div>
    </form>
  );
};

export default Addeditstudent;
