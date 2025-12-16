export const dynamic = "force-dynamic";
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useToast } from "@/app/components/ui/use-toast";

import {
  Search,
  Loader2,
  Calendar,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  MapPin
} from "lucide-react";

// ========================= CONSTANTS =========================
const ITEMS_PER_PAGE = 12;
const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

// ========================= COURSE CARD =========================
function CourseCard({ course, onClick }) {
  if (!course) return null;

  const {
    title,
    level,
    rating = 0,
    description,
    enrolledStudents = 0,
    totalDuration = 0,
    price = 0,
    teacher,
    lastUpdated,
  } = course;

  const teacherName = teacher?.name || 'Azroute Coach';
  const department = teacher?.department || '';

  return (
    <Card
      className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group border border-slate-100"
      onClick={onClick}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {level && (
              <Badge variant="outline" className="text-xs uppercase tracking-wide">
                {level}
              </Badge>
            )}
            {rating > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-base line-clamp-2">{title}</h3>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-3">
            {enrolledStudents > 0 && (
              <span className="inline-flex items-center">
                <Users className="h-3 w-3 mr-1" /> {enrolledStudents}
              </span>
            )}

            {totalDuration > 0 && (
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {Math.ceil(totalDuration / 60)}h
              </span>
            )}
          </div>

          {lastUpdated && (
            <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">{teacherName}</span>
          {department && (
            <span className="text-xs text-muted-foreground">{department}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

// ========================= EVENT CARD (NO IMAGE) =========================
function EventCard({ event, onClick }) {
  if (!event) return null;

  const {
    title,
    featured,
    type,
    description,
    startDate,
    location,
  } = event;

  return (
    <Card
      className="h-full hover:shadow-md transition-all cursor-pointer group border border-slate-100"
      onClick={onClick}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {type && (
            <Badge variant="outline" className="text-xs uppercase tracking-wide">{type}</Badge>
          )}

          {startDate && (
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(startDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-base line-clamp-2">{title}</h3>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        {location && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" /> {location}
          </div>
        )}

        {featured && (
          <Badge className="mt-2 text-[10px]">Featured</Badge>
        )}
      </div>
    </Card>
  );
}

// ========================= PAGE =========================
export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]); // <---- NEW
  const [isMounted, setIsMounted] = useState(false);
  const isFirstLoad = useRef(true);
  const debounceTimer = useRef(null);

  const params = new URLSearchParams(searchParams?.toString() || '');

  const [state, setState] = useState({
    activeTab: params.get('type') || 'courses',
    items: [],
    filters: {
      search: params.get('search') || '',
      level: params.get('level') || 'all',
      eventType: params.get('eventType') || 'all',
      timeframe: params.get('timeframe') || 'upcoming',
      sort: params.get('sort') || 'popular'
    },
    pagination: {
      currentPage: parseInt(params.get('page') || '1'),
      totalPages: 1
    }
  });

  // ---------------- Mount ----------------
  useEffect(() => {
    setIsMounted(true);
    return () => debounceTimer.current && clearTimeout(debounceTimer.current);
  }, []);

  // ---------------- Load Event Types from DB ----------------
  useEffect(() => {
    async function loadTypes() {
      const res = await fetch('/api/explore-event-types');
      const data = await res.json();
      if (res.ok) setEventTypes(data.types);
    }
    loadTypes();
  }, []);

  // ---------------- Fetch Data ----------------
  const fetchData = useCallback(async () => {
    if (!isMounted) return;

    try {
      const queryParams = new URLSearchParams({
        type: state.activeTab,
        ...state.filters,
        page: state.pagination.currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString()
      });

      const res = await fetch(`/api/explore?${queryParams}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setState(prev => ({
        ...prev,
        items: data.items || [],
        pagination: {
          ...prev.pagination,
          totalPages: data.pagination?.totalPages || 1
        }
      }));

    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    }
  }, [isMounted, state.activeTab, state.filters, state.pagination.currentPage]);

  // ---------------- URL + Fetch Trigger ----------------
  useEffect(() => {
    if (!isMounted) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchData();
      return;
    }

    debounceTimer.current && clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const newParams = new URLSearchParams();
      newParams.set('type', state.activeTab);

      Object.entries(state.filters).forEach(([key, value]) => {
        if (value && value !== 'all') newParams.set(key, value);
      });

      router.push(`/explore?${newParams.toString()}`, { scroll: false });
      fetchData();
    }, 300);

  }, [state.activeTab, state.filters, state.pagination.currentPage]);

  // ---------------- Handlers ----------------
  const handleTabChange = value =>
    setState(prev => ({
      ...prev,
      activeTab: value,
      pagination: { currentPage: 1 }
    }));

  const handleFilterChange = (key, value) =>
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      pagination: { currentPage: 1 }
    }));

  const handlePageChange = page =>
    setState(prev => ({
      ...prev,
      pagination: { currentPage: page }
    }));

  // ---------------- Render ----------------
  const renderContent = () => {
    if (!state.items.length) {
      return (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold mt-4">No results found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {state.items.map(item =>
          state.activeTab === 'courses'
            ? <CourseCard key={item.id} course={item} onClick={() => router.push(`/courses/${item.id}`)} />
            : <EventCard key={item.id} event={item} onClick={() => router.push(`/events/${item.id}`)} />
        )}
      </div>
    );
  };

  // ---------------- Loader ----------------
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ========================= UI =========================
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Explore</h1>
        <p className="text-muted-foreground text-lg">Discover courses & events.</p>
      </div>

      <Tabs value={state.activeTab} onValueChange={handleTabChange} className="space-y-8">

        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={`Search ${state.activeTab}...`}
              value={state.filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>

          <Select
            value={state.filters.sort}
            onValueChange={v => handleFilterChange('sort', v)}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
           
          </Select>
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap gap-4">
          {/* LEVEL (COURSES ONLY) */}
          {state.activeTab === 'courses' && (
            <Select
              value={state.filters.level}
              onValueChange={v => handleFilterChange('level', v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>

                {COURSE_LEVELS.map(lvl => (
                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* EVENT FILTERS */}
          {state.activeTab === 'events' && (
            <>
              <Select
                value={state.filters.eventType}
                onValueChange={v => handleFilterChange('eventType', v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={state.filters.timeframe}
                onValueChange={v => handleFilterChange('timeframe', v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* CONTENT */}
        <TabsContent value="courses">{renderContent()}</TabsContent>
        <TabsContent value="events">{renderContent()}</TabsContent>

        {/* PAGINATION */}
        {state.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={state.pagination.currentPage === 1}
              onClick={() => handlePageChange(state.pagination.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>

            {Array.from({ length: state.pagination.totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={state.pagination.currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              disabled={state.pagination.currentPage === state.pagination.totalPages}
              onClick={() => handlePageChange(state.pagination.currentPage + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
}

