import { useEffect, useState } from 'react'

type useDarkModeReturn = [boolean, () => void];

const useDarkMode = (): useDarkModeReturn => {
const [darkMode, setDarkMode] = useState<boolean>(false);

useEffect(() => {
    const setTheme = localStorage.getItem('darkMode');
    const isDark = setTheme === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark)
}, [])

const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode)
}

  return [darkMode, toggleDarkMode];
}

export default useDarkMode