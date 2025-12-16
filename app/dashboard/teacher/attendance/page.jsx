"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

/* Helpers */
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const formatDate = (date) => date.toISOString().split("T")[0];

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveMode, setLeaveMode] = useState(false);

  const today = new Date();
  const todayStr = formatDate(today);

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptySlots = Array(firstDay).fill(null);

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    formatDate(new Date(year, month, i + 1))
  );

  /* LOAD ATTENDANCE */
  useEffect(() => {
    const loadAttendance = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const start = formatDate(new Date(year, month, 1));
      const end = formatDate(new Date(year, month + 1, 0));

      const { data } = await supabase
        .from("coach_attendance")
        .select("date, status, leave_status")
        .eq("coach_id", auth.user.id)
        .gte("date", start)
        .lte("date", end);

      const map = {};
      data?.forEach(row => {
        map[row.date] = row;
      });

      setAttendance(map);
    };

    loadAttendance();
  }, [month, year]);

  const isFutureDate = selectedDate
    ? new Date(selectedDate) > new Date(todayStr)
    : false;

  const markAttendance = async (status) => {
    if (!selectedDate) return;

    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return setLoading(false);

    await supabase.from("coach_attendance").upsert({
      coach_id: auth.user.id,
      date: selectedDate,
      status,
      leave_reason: status === "leave" ? leaveReason : null,
      leave_status: status === "leave" ? "pending" : null,
    });

    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        status,
        leave_status: status === "leave" ? "pending" : null,
      },
    }));

    setLeaveMode(false);
    setLeaveReason("");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold">Attendance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between flex-row">
            <Button size="icon" variant="ghost" onClick={() => setMonth(m => m - 1)}>
              <ChevronLeft />
            </Button>
            <CardTitle>{monthNames[month]} {year}</CardTitle>
            <Button size="icon" variant="ghost" onClick={() => setMonth(m => m + 1)}>
              <ChevronRight />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {weekDays.map(d => <div key={d} className="text-center">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {emptySlots.map((_, i) => <div key={i} />)}

              {days.map(date => {
                const row = attendance[date];
                let color = "bg-gray-100";

                if (row?.status === "present") color = "bg-emerald-500 text-white";
                if (row?.status === "absent") color = "bg-red-500 text-white";

                if (row?.status === "leave") {
                  color =
                    row.leave_status === "approved"
                      ? "bg-yellow-400 text-black"
                      : "bg-yellow-200 text-black border border-dashed border-yellow-600";
                }

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setLeaveMode(false);
                      setLeaveReason("");
                    }}
                    className={`h-9 rounded-md text-xs font-medium ${color}`}
                  >
                    {date.split("-")[2]}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ACTION CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {selectedDate && (
              <>
                <p className="text-sm font-medium">{selectedDate}</p>

                <div className="flex gap-2">
                  <Button
                    disabled={isFutureDate}
                    onClick={() => markAttendance("present")}
                  >
                    Present
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={isFutureDate}
                    onClick={() => markAttendance("absent")}
                  >
                    Absent
                  </Button>

                  <Button variant="outline" onClick={() => setLeaveMode(true)}>
                    Leave
                  </Button>
                </div>

                {leaveMode && (
                  <>
                    <textarea
                      value={leaveReason}
                      onChange={e => setLeaveReason(e.target.value)}
                      placeholder="Leave reason"
                      className="w-full border rounded-md p-2 text-sm"
                    />
                    <Button
                      disabled={!leaveReason}
                      onClick={() => markAttendance("leave")}
                    >
                      Submit Leave (Admin Approval)
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
