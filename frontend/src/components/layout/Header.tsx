import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import ProfileImg from '../../../public/img/profile.png'
import useDarkMode from '@/hooks/useDarkMode';
import API from '@/lib/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  username?: string;
  profileCreated?: boolean;
}

const Header: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { logout, isLoggedIn, isProfileCreated, setUser, user } = useAuth();
  const router = useRouter();


  const handleClose = () => {
    const dropdown = document.getElementById('profile-dropdown') as HTMLDetailsElement;
    if (dropdown?.open) dropdown.removeAttribute('open');
  };

  const deleteProfileHandler = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your profile? This cannot be undone."
    );
    if (!confirm) return;

    try {
      const res = await API.delete("/profile");

      if (res.status === 200) {
        toast.success("Profile deleted successfully.");

        const updatedUser: User = {
          ...(user as User),
          profileCreated: false,
        };

        delete updatedUser.username;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        router.push("/profile/create");
      } else {
        throw new Error("Unexpected error");
      }
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Failed to delete profile. Please try again.");
    }
  };

  return (
    <nav className="bg-dark shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              className="h-8 w-auto"
              width={200}
              height={60}
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="TalentDeck Logo"
            />
            <span className="ml-2 font-bold text-lg text-white">TalentDeck</span>
          </Link>

          <div className="flex items-center space-x-4">

            <Link href="/talents">
              <span className="hidden sm:block text-sm 2xl:text-base font-medium text-[#2D004E] px-4 py-2.5 rounded-md bg-white transition hover:bg-[#7E21D4] hover:text-white cursor-pointer ">
                Browse Talents
              </span>
            </Link>

            <button onClick={toggleDarkMode}
              className="h-10 w-10 mr-2 sm:mr-4 rounded-lg p-1 cursor-pointer focus:outline-0">
              {darkMode ? (
                <svg className="fill-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              ) : (
                <svg className="fill-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <details
                id="profile-dropdown"
                className="relative group"
              >
                <summary className="cursor-pointer flex items-center list-none focus:outline-none">
                  <Image
                    className="h-8 w-8 rounded-full"
                    width={60}
                    height={60}
                    src={ProfileImg}
                    alt="Profile"
                  />
                </summary>

                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700">
                  {isProfileCreated ? (
                    <Link href='/profile/view'>
                      <span
                        onClick={handleClose}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-background-hover dark:hover:bg-background-hover cursor-pointer"
                      >
                        My Profile
                      </span>
                    </Link>
                  ) : (
                    <Link href="/profile/create">
                      <span
                        onClick={handleClose}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-background-hover dark:hover:bg-background-hover cursor-pointer"
                      >
                        Create Profile
                      </span>
                    </Link>
                  )}
                  {isProfileCreated &&
                    <button className='w-full text-left cursor-pointer' onClick={() => deleteProfileHandler()}>
                      <span
                        onClick={handleClose}
                        className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-background-hover dark:hover:bg-background-hover cursor-pointer"
                      >
                        Delete Profile
                      </span>
                    </button>
                  }
                  <Link href="/profile/edit">
                    <span
                      onClick={handleClose}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-background-hover dark:hover:bg-background-hover cursor-pointer"
                    >
                      Edit Profile
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    className="w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-background-hover dark:hover:bg-background-hover"
                  >
                    Logout
                  </button>
                </div>
              </details>
            ) : (
              <Link href="/login">
                <span className="text-sm 2xl:text-base font-medium px-4 py-2.5 rounded-md text-white transition hover:bg-[#7E21D4] hover:text-white cursor-pointer">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
