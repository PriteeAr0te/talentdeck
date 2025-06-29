// components/Footer.tsx
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full fixed bottom-0 bg-background-footer border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-foreground font-medium">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} TalentDeck. Built with
          <span className='px-1.5'><FaHeart className="text-red-500 inline-block" /></span>
          by{' '}
          <a
            href="https://github.com/PriteeAr0te"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Pritee
          </a>
        </div>

        <div className="flex gap-6">
          <Link
            href="https://github.com/PriteeAr0te"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/pritee-reactdev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
