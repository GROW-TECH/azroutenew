"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export default function StudentAttendancePage() {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]); // ✅ for download

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [dayStats, setDayStats] = useState({
    totalDays: 0,
    markedDays: 0,
    present: 0,
    absent: 0,
    excused: 0,
    unexcused: 0,
    compensation: 0,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.email) return;

    const fetchAttendance = async () => {
      setLoading(true);

      try {
        /* ================= STUDENT ================= */
        const { data: student, error: studentErr } = await supabase
          .from("student_list")
          .select("id")
          .eq("email", session.user.email)
          .single();

        if (studentErr || !student) {
          console.error("Student fetch error:", studentErr);
          setAttendanceRows([]);
          setChartData([]);
          setLoading(false);
          return;
        }

        /* ================= DATE RANGE ================= */
        const startDate = `${selectedMonth}-01`;
        const endDate = new Date(
          new Date(startDate).getFullYear(),
          new Date(startDate).getMonth() + 1,
          0
        )
          .toISOString()
          .slice(0, 10);

        /* ================= ATTENDANCE ================= */
        const { data: attendance, error: attErr } = await supabase
          .from("coach_student_attendance")
          .select("date, status")
          .eq("student_id", student.id)
          .gte("date", startDate)
          .lte("date", endDate);

        if (attErr) {
          console.error("Attendance fetch error:", attErr);
          setAttendanceRows([]);
          setChartData([]);
          setLoading(false);
          return;
        }

        setAttendanceRows(attendance || []);

        /* ================= COUNT ================= */
        const counts = {
          present: 0,
          absent: 0,
          excused: 0,
          unexcused: 0,
          compensation: 0,
        };

        (attendance || []).forEach((row) => {
          if (row?.status && counts[row.status] !== undefined) {
            counts[row.status]++;
          }
        });

        const year = Number(selectedMonth.split("-")[0]);
        const month = Number(selectedMonth.split("-")[1]);
        const totalDaysInMonth = new Date(year, month, 0).getDate();

        /* ================= SET DAY STATS ================= */
        setDayStats({
          totalDays: totalDaysInMonth,
          markedDays: attendance?.length || 0,
          present: counts.present,
          absent: counts.absent,
          excused: counts.excused,
          unexcused: counts.unexcused,
          compensation: counts.compensation,
        });

        /* ================= BAR CHART DATA (%) ================= */
        const safePercent = (n) =>
          totalDaysInMonth ? Math.round((n / totalDaysInMonth) * 100) : 0;

        setChartData([
          { name: "Present", value: safePercent(counts.present) },
          { name: "Absent", value: safePercent(counts.absent) },
          { name: "Excused", value: safePercent(counts.excused) },
          { name: "Unexcused", value: safePercent(counts.unexcused) },
          { name: "Compensation", value: safePercent(counts.compensation) },
        ]);
      } catch (e) {
        console.error("fetchAttendance error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [status, session, selectedMonth]);

  /* ================= DOWNLOAD CSV ✅ FIXED ================= */
  const downloadCSV = () => {
    try {
      if (!attendanceRows || attendanceRows.length === 0) {
        alert("No attendance data to download");
        return;
      }

      const headers = ["Date", "Status"];

      const rows = attendanceRows.map((r) => {
        const date = r?.date ? String(r.date).slice(0, 10) : ""; // ✅ yyyy-mm-dd
        const status = r?.status ? String(r.status) : "";
        return [date, status];
      });

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replaceAll('"', '""')}"`) // ✅ csv safe
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${selectedMonth}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url); // ✅ IMPORTANT (memory + proper cleanup)
    } catch (e) {
      console.error("CSV download failed:", e);
      alert("CSV download failed");
    }
  };

  if (status !== "authenticated") {
    return <p className="text-center mt-10">Please login...</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">
        📊 Monthly Attendance Summary (%)
      </h2>

      {/* ================= MONTH PICKER ================= */}
      <div className="flex justify-center gap-3 mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1"
        />

        {/* ✅ DOWNLOAD BUTTON */}
        <button
          type="button"
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          ⬇ Download CSV
        </button>
      </div>

      {/* ================= DAY CALCULATION ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-center mb-5">
        <div className="bg-gray-100 p-2 rounded">
          📅 Total Days<br />
          <b>{dayStats.totalDays}</b>
        </div>
        <div className="bg-blue-100 p-2 rounded">
          📝 Marked Days<br />
          <b>{dayStats.markedDays}</b>
        </div>
        <div className="bg-green-100 p-2 rounded">
          ✅ Present<br />
          <b>{dayStats.present}</b>
        </div>
        <div className="bg-red-100 p-2 rounded">
          ❌ Absent<br />
          <b>{dayStats.absent}</b>
        </div>
        <div className="bg-yellow-100 p-2 rounded">
          🟡 Excused<br />
          <b>{dayStats.excused}</b>
        </div>
        <div className="bg-purple-100 p-2 rounded">
          🎯 Compensation<br />
          <b>{dayStats.compensation}</b>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `${v}%`}
                style={{ fill: "#111827", fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
