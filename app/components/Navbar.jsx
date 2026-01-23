"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  BookOpen,
  GraduationCap,
  Globe,
  ShoppingBag,
  User,
  Home,
} from "lucide-react";

import { useSession, signOut } from "next-auth/react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { student: ctxUser, setStudent } = useAuth?.() ?? {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- Responsive check ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- Scroll shadow ---------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- Sync session ---------------- */
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setStudent?.(session.user);
    } else if (status === "unauthenticated") {
      setStudent?.(null);
    }
  }, [status, session, setStudent]);

  const user = session?.user ?? ctxUser ?? null;

  const getInitials = () =>
    user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "AZ";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setStudent?.(null);
    router.push("/");
  };

  /* ---------------- Mobile menu items ---------------- */
  const mobileItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Globe },
    { label: "Our Coaches", href: "/teachers", icon: GraduationCap },
    { label: "About us", href: "/about", icon: GraduationCap },
    { label: "Fee structure", href: "/feestrcture", icon: GraduationCap },
  ];

  // Add extra items for non-logged in users on mobile
  if (!user) {
    mobileItems.push(
      { label: "Coach on Azroute", href: "/auth/teacher/login", icon: BookOpen },
      { label: "Shop", href: "/shop", icon: ShoppingBag }
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Azroute.jpeg"
            alt="Azroute"
            width={isMobile ? 110 : 130}
            height={isMobile ? 30 : 36}
            priority
            className="object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <NavLink href="/explore" icon={Globe} text="Explore" />
          <NavLink href="/teachers" icon={GraduationCap} text="Our Coaches" />
          <NavLink href="/about" icon={GraduationCap} text="About us" />
          <NavLink href="/feestrcture" icon={GraduationCap} text="Fee structure" />

          {!user && (
            <>
              <NavLink
                href="/auth/teacher/login"
                icon={BookOpen}
                text="Coach on Azroute"
              />
              <NavLink href="/shop" icon={ShoppingBag} text="Shop" />
            <NavLink href="/news&blogs" icon={ShoppingBag} text="News&blogs "/>
            </>
          )}
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 px-2 hover:bg-gray-50"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 ring-1 ring-blue-500 ring-offset-2">
                    <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
                  </Avatar>
                  {!isMobile && <ChevronDown className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
             <Button
  variant="ghost"
  onClick={() => router.push("/auth/student/login")}
  className="px-4 text-sm whitespace-nowrap"
>
  Log in
</Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded-full px-4 lg:px-6"
                onClick={() => router.push("/auth/student/signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 ring-1 ring-blue-500">
                <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
              </Avatar>
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-full max-w-[320px] p-0 overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-1 ring-blue-500">
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Menu */}
                  <div className="px-4 py-4 space-y-1">
                    {mobileItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-4 p-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
                        >
                          <item.icon className="h-5 w-5 text-blue-600" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    
                    <div className="border-t my-2 pt-2">
                      <SheetClose asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-4 p-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
                        >
                          <User className="h-5 w-5 text-blue-600" />
                          <span>Profile</span>
                        </Link>
                      </SheetClose>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors w-full text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth/student/login")}
                className="px-3"
              >
                Log in
              </Button>
              
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-full max-w-[300px] p-0">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b">
                    <Image
                      src="/Azroute.jpeg"
                      alt="Azroute"
                      width={110}
                      height={30}
                      className="object-contain"
                    />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Menu */}
                  <div className="px-4 py-6 space-y-1">
                    {mobileItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-4 p-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
                        >
                          <item.icon className="h-5 w-5 text-blue-600" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="p-5 border-t bg-gray-50">
                    <SheetClose asChild>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
                        onClick={() => router.push("/auth/student/signup")}
                      >
                        Get Started Free
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

/* ---------------- Reusable desktop nav link ---------------- */
function NavLink({ href, icon: Icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap text-sm lg:text-base px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {text}
    </Link>
  );
}