import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import ProfileImg from '../../../public/img/profile.png'
import useDarkMode from '@/hooks/useDarkMode';
import { useEffect, useRef, useState } from 'react';
import DeleteProfileDialog from '../ui/DeleteModal';

const Header: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const { logout, isLoggedIn, isProfileCreated } = useAuth();

  const dropdownRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.removeAttribute("open");
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    const dropdown = document.getElementById('profile-dropdown') as HTMLDetailsElement;
    if (dropdown?.open) dropdown.removeAttribute('open');
  };

  return (
    <>
      <DeleteProfileDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
      <nav className="shadow bg-background border-b border-br-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                className="h-8 w-auto"
                width={200}
                height={60}
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="TalentDeck Logo"
              />
              <span className="ml-2 font-bold text-lg text-foreground">TalentDeck</span>
            </Link>

            <div className="flex items-center space-x-4">

              <Link href="/talents" className="hidden relative h-11 sm:flex items-center justify-center rounded-md w-40 overflow-hidden border border-foreground/50 text-foreground shadow-md transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-md before:bg-primary before:duration-300 before:ease-out hover:text-white hover:shadow-primary/50 hover:before:h-40 hover:before:w-40 hover:before:opacity-80">
                <span className="relative z-10">Browse Talents</span>
              </Link>

              <button
                onClick={toggleDarkMode}
                className="h-10 w-10 mr-2 sm:mr-4 rounded-lg p-1 cursor-pointer focus:outline-0"
              >
                {darkMode ? (
                  <svg className="fill-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                ) : (
                  <svg className="fill-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd" clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>

              {isLoggedIn ? (
                <details id="profile-dropdown" className="relative group" ref={dropdownRef}>
                  <summary className="cursor-pointer flex items-center list-none focus:outline-none">
                    <Image
                      className="h-8 w-8 rounded-full border border-br-primary shadow"
                      width={60}
                      height={60}
                      src={ProfileImg}
                      alt="Profile"
                    />
                  </summary>

                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border">
                    {isProfileCreated ? (
                      <Link href='/profile/view'>
                        <span
                          onClick={handleClose}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                        >
                          My Profile
                        </span>
                      </Link>
                    ) : (
                      <Link href="/profile/create">
                        <span
                          onClick={handleClose}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                        >
                          Create Profile
                        </span>
                      </Link>
                    )}

                    {isProfileCreated && (
                      <button className="w-full text-left cursor-pointer" onClick={() => {
                        handleClose();
                        setShowDeleteDialog(true);
                      }}>
                        <span
                          className="block w-full px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                        >
                          Delete Profile
                        </span>
                      </button>
                    )}

                    <Link href="/profile/edit">
                      <span
                        onClick={handleClose}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                      >
                        Edit Profile
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        handleClose();
                      }}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </details>
              ) : (
                <Link href="/login">
                  <span className="text-sm 2xl:text-base font-medium px-4 py-2.5 rounded-md text-foreground hover:text-foreground bg-btn-secondary hover:bg-secondary transition cursor-pointer">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );

};


export default Header;
