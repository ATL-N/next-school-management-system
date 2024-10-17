// pages/dashboard/settings/backup-restore.js
"use client";

import React, { useState, useEffect } from "react";
import { FaDownload, FaUpload, FaHistory } from "react-icons/fa";
import LoadingPage from "../../../components/generalLoadingpage";

const BackupRestoreSettings = () => {
  // const [backupHistory, setBackupHistory] = useState([
  //   { id: 1, date: "2023-07-15 10:30:00", size: "250 MB" },
  //   { id: 2, date: "2023-07-01 09:15:00", size: "248 MB" },
  //   { id: 3, date: "2023-06-15 11:00:00", size: "245 MB" },
  // ]);

 const [backupHistory, setBackupHistory] = useState([]);

 useEffect(() => {
   fetchBackups();
 }, []);

 const fetchBackups = async () => {
   const response = await fetch("/api/backup?action=list");
   const backups = await response.json();
   setBackupHistory(backups);
 };

 const handleBackup = async () => {
   try {
     const response = await fetch("/api/backup", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ action: "create" }),
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || "Backup failed");
     }

     const result = await response.json();
     console.log("Backup created:", result.message);

     await fetchBackups(); // Refresh the list
   } catch (error) {
     console.error("Backup failed:", error);
     // Handle error (e.g., show an error message to the user)
   }
 };

 const handleDownload = async (fileName) => {
   try {
     const response = await fetch(
       `/api/backup?action=download&file=${fileName}`
     );
     if (!response.ok) throw new Error("Download failed");

     const blob = await response.blob();
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = fileName;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     window.URL.revokeObjectURL(url);
   } catch (error) {
     console.error("Download failed:", error);
     // Handle error
   }
 };

 const handleRestore = async (e) => {
   const file = e.target.files[0];
   if (file) {
     try {
       const formData = new FormData();
       formData.append("file", file);

       const response = await fetch("/api/restore", {
         method: "POST",
         body: formData,
       });

       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || "Restore failed");
       }

       const result = await response.json();
       console.log("Restore completed:", result.message);
       // Optionally, you can add user feedback here (e.g., show a success message)
     } catch (error) {
       console.error("Restore failed:", error);
       // Handle error (e.g., show an error message to the user)
     }
   }
 };

  return (
    <div className="pb-16 text-cyan-600">
      <h1 className="text-3xl font-bold mb-6 text-cyan-700">
        System Backup and Restore
      </h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-cyan-700">Backup</h2>
        <p className="mb-4">Create a backup of your entire system data.</p>
        <button
          onClick={handleBackup}
          className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center"
        >
          <FaDownload className="mr-2" /> Create Backup
        </button>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-cyan-700">
          Restore
        </h2>
        <p className="mb-4">Restore your system from a previous backup file.</p>
        <label className="p-2 bg-cyan-700 text-white rounded hover:bg-cyan-600 flex items-center inline-block cursor-pointer">
          <FaUpload className="mr-2" /> Select Backup File
          <input type="file" onChange={handleRestore} className="hidden" />
        </label>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-cyan-700">
          Backup History
        </h2>
        {backupHistory.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Size</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {backupHistory.map((backup) => (
                <tr key={backup.id} className="border-b">
                  <td className="p-2">{backup.date}</td>
                  <td className="p-2">{backup.size}</td>
                  <td className="p-2">
                    <button
                      onClick={handleDownload}
                      className="text-cyan-700 hover:text-cyan-600"
                    >
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <LoadingPage />
        )}
      </div>
    </div>
  );
};

export default BackupRestoreSettings;
