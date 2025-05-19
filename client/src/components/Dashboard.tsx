import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/expense/by/user/email/${email}`)
      .then((res) => {
        setExpenses(res.data);

        // group & sum by category
        const grouped = res.data.reduce((acc, { category, amount }) => {
          const value = parseFloat(amount);
          const entry = acc.find((c) => c.category === category.name);
          if (entry) {
            entry.amount += value;
          } else {
            acc.push({ category: category.name, amount: value });
          }
          return acc;
        }, []);
        setChartData(grouped);
      })
      .catch(console.error);
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-700">
            Logged in as: <strong>{email}</strong>
          </p>
        </div>

        {/* Chart Card with fixed-size BarChart */}
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <h2 className="text-2xl font-semibold mb-4">Expenses by Category</h2>
          <div className="overflow-auto">
            <BarChart
              width={Math.min(chartData.length * 100 + 100, 800)}
              height={300}
              data={chartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(val: any) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(val)
                }
              />
              <Legend />
              <Bar dataKey="amount" name="Total (BRL)" fill="#4F46E5" />
            </BarChart>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <h2 className="text-2xl font-semibold mb-4">All Expenses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e: any) => (
                  <tr key={e.id} className="border-b">
                    <td className="px-4 py-2">{e.id}</td>
                    <td className="px-4 py-2">{e.category.name}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(e.amount))}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
