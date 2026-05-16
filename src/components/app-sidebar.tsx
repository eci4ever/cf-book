import * as React from "react"
import {
  Bot,
  Command,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

const data = {
  navMain: [
    {
      title: "Admin",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      adminOnly: true,
      items: [
        {
          title: "Users",
          url: "/app/user",
        }
      ],
    },
    {
      title: "Books",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Library",
          url: "/app/book",
        }
      ],
    }
  ]
}

type AppSidebarSession = {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { session: AppSidebarSession }) {
  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? "",
    role: session.user.role ?? "",
  }
  const navMain = data.navMain.filter((item) => {
    return user.role === "admin" || !item.adminOnly
  })

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/app">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
