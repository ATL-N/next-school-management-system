// pages/dashboard/financial/components/FinancialReports.js
'use client'
import React, { useState } from "react";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaDownload,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const FinancialReports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [timeFrame, setTimeFrame] = useState("monthly");

  const revenueData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
  ];

  const expenseData = [
    { name: "Salaries", value: 4000 },
    { name: "Utilities", value: 3000 },
    { name: "Supplies", value: 2000 },
    { name: "Maintenance", value: 2780 },
    { name: "Other", value: 1890 },
  ];

  const profitData = [
    { name: "Jan", revenue: 4000, expenses: 3500, profit: 500 },
    { name: "Feb", revenue: 3000, expenses: 2800, profit: 200 },
    { name: "Mar", revenue: 2000, expenses: 1800, profit: 200 },
    { name: "Apr", revenue: 2780, expenses: 2500, profit: 280 },
    { name: "May", revenue: 1890, expenses: 1700, profit: 190 },
    { name: "Jun", revenue: 2390, expenses: 2100, profit: 290 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const renderChart = () => {
    switch (reportType) {
      case "revenue":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "expenses":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "profit":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
              <Line type="monotone" dataKey="profit" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting financial report...");
  };

  return (
    <div className="p-4 text-cyan-700">
      <h2 className="text-2xl font-bold mb-4">Financial Reports</h2>
      <div className="mb-4 flex justify-between">
        <div>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mr-2 p-2 border rounded"
          >
            <option value="revenue">Revenue</option>
            <option value="expenses">Expenses</option>
            <option value="profit">Profit</option>
          </select>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="p-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
        >
          <FaDownload className="inline-block mr-2" />
          Export Report
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow">{renderChart()}</div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <p>
          This {timeFrame} report shows the {reportType} trends for the school.
          {reportType === "revenue" &&
            " The highest revenue was recorded in January."}
          {reportType === "expenses" &&
            " The largest expense category is Salaries."}
          {reportType === "profit" &&
            " The profit margin has been consistent over the months."}
        </p>
      </div>
    </div>
  );
};

export default FinancialReports;
