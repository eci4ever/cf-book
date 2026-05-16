import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GalleryVerticalEnd, Search, Plus } from 'lucide-react';

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="min-h-screen bg-muted text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-muted">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold leading-none text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" aria-hidden="true" />
            </span>
            <span>ADTEC JTM.</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
              Docs
            </Link>
            <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
              Components
            </Link>
          </div>
        </div>

        {/* Right: Search + Icons + New Button */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-9 w-48 rounded-full bg-transparent py-2 pl-9 pr-4 text-sm"
            />
          </div>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-border sm:block" />

          {/* New Button */}
          <Button asChild className="h-9 gap-1.5 px-4 text-sm font-medium">
            <Link to="/login">
              <Plus className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 pb-16 pt-28 text-center">

        {/* Heading */}
        <h1 className="mb-5 max-w-3xl text-4xl font-semibold leading-tight text-foreground">
          Building Blocks for the Web
        </h1>

        {/* Subheading */}
        <p className="mb-8 max-w-2xl text-base font-normal leading-7 text-muted-foreground">
          Clean, modern building blocks.
          <br className="hidden md:block" />
          Works with all React frameworks. Open Source.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="px-4 font-medium"
          >
            Browse Blocks
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="px-4 font-medium"
          >
            View Components
          </Button>
        </div>
      </main>
    </div>
  );
}
