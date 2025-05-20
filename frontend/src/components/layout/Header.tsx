import { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', !darkMode);
    }
  };
  const handleClose = () => {
    const dropdown = document.getElementById('profile-dropdown') as HTMLDetailsElement;
    if (dropdown?.open) dropdown.removeAttribute('open');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="TalentDeck Logo"
            />
            <span className="ml-2 font-bold text-lg text-gray-800 dark:text-white">TalentDeck</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Browse Talents */}
            <Link href="/search">
              <span className="text-sm font-medium px-4 py-2.5 rounded-md bg-light text-dark transition hover:bg-[#7E21D4] hover:text-white cursor-pointer">
                Browse Talents
              </span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full px-1 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
              />
            </button>

            {/* Profile Dropdown */}
            <details
              id="profile-dropdown"
              className="relative group"
            >
              <summary className="cursor-pointer flex items-center list-none focus:outline-none">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Profile"
                />
              </summary>

              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700">
                <Link href="/talent/your-username">
                  <span
                    onClick={handleClose}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    View Profile
                  </span>
                </Link>
                <Link href="/profile/edit">
                  <span
                    onClick={handleClose}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Edit Profile
                  </span>
                </Link>
                <button
                  onClick={() => {
                    console.log('Logging out...');
                    handleClose();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
