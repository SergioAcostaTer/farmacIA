import {
  HomeIcon,
  SearchIcon,
  InfoIcon,
  SyringeIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Effect to update theme in localStorage and apply to the document body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Save theme preference in localStorage
  }, [theme]);

  // Function to toggle theme
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
            <div className="flex items-center">
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
                style={{
                  color: "var(--text-secondary)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--hover-bg)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <HomeIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{
                  color: "var(--text-secondary)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--hover-bg)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{
                  color: "var(--text-secondary)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--hover-bg)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <InfoIcon className="h-5 w-5" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md transition-colors cursor-pointer"
                style={{
                  color: "var(--text-secondary)",
                }}
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
