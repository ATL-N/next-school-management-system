import React, { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DisplayTimetable = ({
  classesData,
  semesterData,
  selectedClassId,
  selectedSemesterId,
  timetable,
  periods,
  daysOfWeek,
  handleClassChange,
  handleSemesterChange,
  displayPrintBtn = true,
}) => {
    const [selectedClass, setSelectedClass] = useState(true);


  useEffect(() => {
setSelectedClass(classesData.find((c) => c.class_id === parseInt(selectedClassId)));
// console.log("selectedClass", selectedClass, selectedClassId, classesData);

  }, [selectedClassId])

   

  const generatePDF = () => {
     const doc = new jsPDF({
       format: "a4",
       orientation: "landscape",
       unit: "mm",
     });

    // Add title
    // const selectedClass = classesData.find(
    //   (c) => c.id === selectedClassId
    // );
    doc.setFontSize(18);
    doc.text(`Timetable for ${selectedClass.class_name}`, 14, 15);

    // Prepare table data
    const tableData = daysOfWeek.map((day) => {
      return [
        day,
        ...periods.map((period) => {
          const entry = timetable[day]?.[period.number];
          return entry
            ? `${entry.subjectName}\n${entry.teacherName}`
            : "-";
        }),
      ];
    });

    // Prepare table headers
    const tableHeaders = [
      "Day / Period",
      ...periods.map(
        (period) =>
          `Period ${period.number}\n${period.startTime} - ${period.endTime}`
      ),
    ];

    // Generate table
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 25,
      styles: { fontSize: 14, cellPadding: 1 },
      columnStyles: { 0: { cellWidth: 20 } },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index > 0) {
          const cellHeight = data.row.height;
          const cellWidth = data.column.width;
          const cellX = data.cell.x;
          const cellY = data.cell.y;

          // Draw the border
          doc.setDrawColor(0);
          doc.setLineWidth(0.1);
          doc.line(cellX, cellY, cellX + cellWidth, cellY); // Top
          doc.line(
            cellX,
            cellY + cellHeight,
            cellX + cellWidth,
            cellY + cellHeight
          ); // Bottom
          doc.line(cellX, cellY, cellX, cellY + cellHeight); // Left
          doc.line(
            cellX + cellWidth,
            cellY,
            cellX + cellWidth,
            cellY + cellHeight
          ); // Right
        }
      },
    });

    // Open PDF in a new tab and trigger print dialog
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl, "_blank");

    newWindow.onload = () => {
      newWindow.print();
    };
  };


  return (
    <div className="space-y-6 text-cyan-800">
      {displayPrintBtn && (
        
        <>
          <h2 className="text-2xl font-bold text-cyan-700">View Timetable</h2>
         
          <div className="w-full flex justify-stretch">
            <div className="w-full mb-4 mr-6">
              <label
                htmlFor="class-select"
                className="block text-sm font-medium text-cyan-700"
              >
                Select Class
              </label>
              <select
                id="class-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-cyan-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="">Select a class</option>
                {classesData?.map((class_) => (
                  <option key={class_.class_id} value={class_.class_id}>
                    {class_.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full mb-4">
              <label
                htmlFor="semester-select"
                className="block text-sm font-medium text-cyan-700"
              >
                Select Term
              </label>
              <select
                id="semester-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-cyan-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                value={selectedSemesterId}
                onChange={handleSemesterChange}
              >
                <option value="">Select a term</option>
                {semesterData?.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {`${semester?.semester_name}(${semester?.start_date})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {selectedClassId && selectedSemesterId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <colgroup>
                <col className="w-1/6" />
                {periods.map((period) => (
                  <col
                    key={period.number}
                    className={`w-${Math.floor(5 / periods.length)}/6`}
                  />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-cyan-700 text-white">
                  <th className="p-2 border border-cyan-600">Day / Period</th>
                  {periods.map((period) => (
                    <th
                      key={period.number}
                      className="p-2 border border-cyan-600"
                    >
                      <div className="flex items-center justify-center space-x-2 flex-col">
                        <span>Period {period.number}</span>
                        <span className="text-xs">
                          {period.startTime} - {period.endTime}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => (
                  <tr key={day} className="border-b">
                    <td className="p-2 font-bold border border-cyan-200">
                      {day}
                    </td>
                    {periods.map((period) => {
                      const entry = timetable[day]?.[period.number];
                      return (
                        <td
                          key={`${day}-${period.number}`}
                          className="p-2 border border-cyan-200"
                        >
                          {entry ? (
                            <div className="flex flex-col space-y-1">
                              <span className="font-semibold">
                                {entry.subjectName}
                              </span>
                              <span className="text-sm">
                                {entry.teacherName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {entry.roomName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayPrintBtn && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 flex items-center"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayTimetable;
