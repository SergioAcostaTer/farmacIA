import {
  HomeIcon,
  SearchIcon,
  SyringeIcon,
  MoonIcon,
  SunIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Check if there is navigation history
    setCanGoBack(window.history.length > 1);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Back Button (Only if history exists) */}
              {canGoBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-md transition-colors cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--hover-bg)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}

              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2 text-[var(--text-primary)] text-xl font-semibold transition-all duration-200 ease-in-out hover:text-[var(--text-secondary)]"
              >
                <span>FarmacIA</span>
                <SyringeIcon className="h-5 w-5 inline-block -mt-1" />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => navigate("/home")}
              >
                <HomeIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => navigate("/home?overlay=open")}
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                {theme === "light" ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center bg-[var(--bg-primary)]">
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} FarmacIA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
