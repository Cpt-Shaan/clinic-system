import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = {
  patient: [
    { to: "/",           label: "Dashboard" },
    { to: "/book",       label: "Book Appointment" },
    { to: "/history",    label: "History" },
    { to: "/prescription", label: "Prescriptions" },
  ],
  doctor: [
    { to: "/",                   label: "Dashboard" },
    { to: "/doctor-appointments", label: "Schedule" },
    { to: "/create-prescription", label: "Issue Rx" },
    { to: "/billing-report",      label: "Billing" },
  ],
};

const ROLE_BADGE = {
  patient: { label: "Patient",  color: "badge-green" },
  doctor:  { label: "Physician", color: "badge-gold"  },
};

function Navbar({ role, user, onLogout }) {
  const location = useLocation();
  const links = NAV_LINKS[role] ?? [];
  const badge = ROLE_BADGE[role];

  return (
    <nav
      className="sticky top-0 z-50 animate-fade-in"
      style={{
        background:
          "linear-gradient(180deg, rgba(7,26,14,0.97) 0%, rgba(3,15,7,0.92) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-themeBorder)",
        boxShadow:
          "0 1px 0 var(--color-themeBorder), 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-transform group-hover:scale-110"
            style={{
              background:
                "linear-gradient(135deg, var(--color-themeYellow), var(--color-themeYellowLight))",
              boxShadow: "0 2px 12px var(--color-themeYellowGlow)",
            }}
          >
            ⚕️
          </div>
          <span
            className="font-display font-600 text-lg tracking-tight"
            style={{ color: "var(--color-textPrimary)" }}
          >
            Trinity<span style={{ color: "var(--color-themeYellow)" }}>Clinic</span>
          </span>
        </Link>

        {/* ── Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => {
            const isActive =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                className="relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive
                    ? "var(--color-themeYellow)"
                    : "var(--color-textSecondary)",
                  background: isActive
                    ? "var(--color-themeYellowGlow)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(212,160,23,0.2)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-textPrimary)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--color-textSecondary)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--color-themeYellow)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right: Badge + User ── */}
        <div className="flex items-center gap-3">
          {badge && (
            <span className={`badge ${badge.color} hidden sm:inline-flex`}>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    role === "doctor"
                      ? "var(--color-themeYellow)"
                      : "var(--color-themeAction)",
                }}
              />
              {badge.label}
            </span>
          )}

          {/* Avatar / logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-ghost text-xs px-3 py-2"
              title="Sign out"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <div
        className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {links.map(({ to, label }) => {
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                color: isActive ? "#000" : "var(--color-textSecondary)",
                background: isActive
                  ? "var(--color-themeYellow)"
                  : "rgba(255,255,255,0.05)",
                border: isActive
                  ? "none"
                  : "1px solid var(--color-themeBorder)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;