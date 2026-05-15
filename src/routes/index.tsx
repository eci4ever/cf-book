import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Feather, Search, Plus } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Feather className="h-5 w-5 text-black -rotate-45" strokeWidth={2.5} />
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Docs
            </a>
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Components
            </a>
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Blocks
            </a>
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Charts
            </a>
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Directory
            </a>
            <a href="#" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              Create
            </a>
          </div>
        </div>

        {/* Right: Search + Icons + New Button */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="w-48 pl-9 pr-4 py-2 h-9 rounded-full border-gray-200 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* GitHub Stars */}
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>114k</span>
          </a>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* Theme Toggle (placeholder - moon icon) */}
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* New Button */}
          <Button className="rounded-lg bg-black text-white hover:bg-gray-800 px-4 h-9 text-sm font-medium gap-1.5">
            <Plus className="h-4 w-4" />
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
        {/* Badge */}
        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-black hover:bg-gray-200 transition-colors mb-8"
        >
          New preset commands
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-6">
          Building Blocks for the Web
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-black font-normal leading-relaxed max-w-2xl mb-10">
          Clean, modern building blocks.
          <br className="hidden md:block" />
          Works with all React frameworks. Open Source.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            className="rounded-xl bg-black text-white hover:bg-gray-800 px-6 h-12 text-base font-medium"
          >
            Browse Blocks
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-xl text-black hover:bg-gray-100 px-6 h-12 text-base font-medium"
          >
            View Components
          </Button>
        </div>
      </main>
    </div>
  );
}
