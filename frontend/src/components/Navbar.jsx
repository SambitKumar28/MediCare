import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaCalendarAlt,
  FaHospital,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaUserMd,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContextValue";
import API from "../services/api";

const baseLinks = [
  { name: "Home", path: "/" },
  { name: "Doctors", path: "/doctors" },
];

const authenticatedBaseLinks = [{ name: "Doctors", path: "/doctors" }];

const getRoleLinks = (role) => {
  if (role === "patient") {
    return [
      {
        name: "Appointments",
        path: "/appointments",
        icon: FaCalendarAlt,
      },
    ];
  }

  if (role === "doctor") {
    return [
      {
        name: "Profile",
        path: "/doctor/profile",
        icon: FaUserMd,
      },
      {
        name: "Schedule",
        path: "/doctor/appointments",
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        name: "Dashboard",
        path: "/admin/doctors",
        icon: FaHospital,
      },
    ];
  }

  return [];
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  const navLinks = useMemo(
    () =>
      user
        ? [...authenticatedBaseLinks, ...getRoleLinks(user.role)]
        : baseLinks,
    [user]
  );

  const profilePath =
    user?.role === "doctor"
      ? "/doctor/profile"
      : user?.role === "admin"
      ? "/admin/doctors"
      : "/appointments";

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    const handleBookingNotification = () => {
      fetchNotifications();
    };

    const timerId = window.setTimeout(fetchNotifications, 0);
    window.addEventListener("booking-notification", handleBookingNotification);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("booking-notification", handleBookingNotification);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/doctors?search=${encodeURIComponent(query)}` : "/doctors");
    setMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setProfileMenu(false);
    setMobileMenu(false);
    setNotificationMenu(false);
    navigate("/login");
  };

  const markNotificationsRead = async () => {
    if (!user || unreadCount === 0) return;

    try {
      const res = await API.put("/notifications/read");
      setNotifications(res.data.notifications);
    } catch {
      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true }))
      );
    }
  };

  const toggleNotifications = () => {
    setNotificationMenu((isOpen) => {
      if (!isOpen) {
        markNotificationsRead();
      }
      return !isOpen;
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Brand homePath={user ? "/doctors" : "/"} />

          <SearchForm
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            className="hidden lg:block"
          />

          <DesktopNav links={navLinks} />

          <div className="flex items-center gap-3">
            {user && (
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                isOpen={notificationMenu}
                onToggle={toggleNotifications}
              />
            )}

            {!user ? (
              <GuestActions />
            ) : (
              <ProfileMenu
                user={user}
                profilePath={profilePath}
                isOpen={profileMenu}
                onToggle={() => setProfileMenu((isOpen) => !isOpen)}
                onClose={() => setProfileMenu(false)}
                onLogout={handleLogout}
              />
            )}

            <button
              type="button"
              onClick={() => setMobileMenu((isOpen) => !isOpen)}
              className="md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenu}
        links={navLinks}
        user={user}
        profilePath={profilePath}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onClose={() => setMobileMenu(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

const Brand = ({ homePath }) => (
  <Link to={homePath} className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
      <FaHospital className="text-xl" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-slate-800">MediCare</h1>
      <p className="text-xs text-slate-500">Doctor Appointment System</p>
    </div>
  </Link>
);

const SearchForm = ({ value, onChange, onSubmit, className = "" }) => (
  <form onSubmit={onSubmit} className={`flex-1 max-w-md ${className}`}>
    <div className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search health issue or doctors..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-teal-500"
      />
    </div>
  </form>
);

const DesktopNav = ({ links }) => (
  <nav className="hidden items-center gap-2 md:flex">
    {links.map((link) => {
      const Icon = link.icon;

      return (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `px-4 py-2 font-medium transition ${
              isActive ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
            }`
          }
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon />}
            {link.name}
          </span>
        </NavLink>
      );
    })}
  </nav>
);

const NotificationBell = ({ notifications, unreadCount, isOpen, onToggle }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="relative rounded-full p-3 hover:bg-slate-100"
      aria-label="Notifications"
    >
      <FaBell className="text-slate-600" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>

    {isOpen && (
      <div className="absolute right-0 top-14 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b px-4 py-3">
          <p className="font-bold text-slate-800">Notifications</p>
        </div>

        {notifications.length === 0 ? (
          <p className="px-4 py-5 text-sm font-semibold text-slate-500">
            No booking notifications yet.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((item) => (
              <div key={item._id} className="border-b px-4 py-3 last:border-b-0">
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

const GuestActions = () => (
  <div className="hidden items-center gap-3 md:flex">
    <Link to="/login" className="font-medium text-slate-600 hover:text-teal-600">
      Login
    </Link>
    <Link
      to="/register"
      className="rounded-full bg-teal-600 px-6 py-2 text-white transition hover:bg-teal-700"
    >
      Register
    </Link>
  </div>
);

const ProfileMenu = ({
  user,
  profilePath,
  isOpen,
  onToggle,
  onClose,
  onLogout,
}) => (
  <div className="relative hidden sm:block">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
    >
      <FaUserCircle className="text-3xl text-teal-600" />
      <div className="hidden text-left md:block">
        <p className="font-semibold text-slate-800">{user?.name}</p>
        <p className="text-xs capitalize text-slate-500">{user?.role}</p>
      </div>
    </button>

    {isOpen && (
      <div className="absolute right-0 top-16 w-60 rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b p-4">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>

        <Link
          to={profilePath}
          onClick={onClose}
          className="block px-4 py-3 hover:bg-slate-50"
        >
          My Profile
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50"
        >
          <span className="flex items-center gap-2">
            <FaSignOutAlt />
            Logout
          </span>
        </button>
      </div>
    )}
  </div>
);

const MobileMenu = ({
  isOpen,
  links,
  user,
  profilePath,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClose,
  onLogout,
}) => (
  <div
    className={`fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="flex items-center justify-between border-b p-5">
      <h2 className="text-lg font-bold">Menu</h2>
      <button type="button" onClick={onClose} aria-label="Close menu">
        <FaTimes />
      </button>
    </div>

    <div className="flex flex-col gap-4 p-5">
      <SearchForm
        value={searchQuery}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClose}
          className="rounded-lg px-3 py-2 hover:bg-slate-100"
        >
          {link.name}
        </NavLink>
      ))}

      {!user ? (
        <>
          <Link to="/login" onClick={onClose}>
            Login
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="rounded-lg bg-teal-600 py-3 text-center text-white"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <Link to={profilePath} onClick={onClose}>
            My Profile
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg bg-red-50 py-3 text-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
);

export default Navbar;
