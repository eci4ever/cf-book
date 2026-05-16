import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCurrentSession } from '#/feature/auth/session'
import { Button } from '#/components/ui/button'
import { LogOut } from 'lucide-react'
import { authClient } from '#/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/app')({
    beforeLoad: async () => {
        const session = await getCurrentSession()

        if (!session) {
            throw redirect({
                to: "/login",
                replace: true,
            })
        }

        return { session }
    },
    component: RouteComponent,
})

function RouteComponent() {

    const navigate = useNavigate()
    // const { session } = Route.useRouteContext()
    const [isSigningOut, setIsSigningOut] = useState(false)

    async function handleLogout() {
        setIsSigningOut(true)

        try {
            await authClient.signOut()
            await navigate({ to: "/login", replace: true })
        } finally {
            setIsSigningOut(false)
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Build Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    {/* Right: Search + Icons + New Button */}
                    <div className="flex items-center gap-4 ml-auto px-4">

                        {/* Divider */}
                        <div className="hidden h-6 w-px bg-border sm:block" />

                        {/* New Button */}
                        <Button
                            variant="ghost"
                            size="lg"
                            className="px-4 font-medium"
                            onClick={handleLogout}
                            disabled={isSigningOut}
                        >
                            <LogOut className="size-4" />
                            {isSigningOut ? "Logging out..." : "Logout"}
                        </Button>
                    </div>
                </header>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
