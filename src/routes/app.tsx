import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
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
import { getCurrentSession } from '#/lib/session'
import { Button } from '#/components/ui/button'
import { LogOut } from 'lucide-react'
import { authClient } from '#/lib/auth-client'
import { Fragment, useState } from 'react'

const breadcrumbLabels: Record<string, string> = {
    "/app": "Dashboard",
    "/app/book": "Library",
    "/app/user": "Users",
}

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
    const location = useLocation()
    const { session } = Route.useRouteContext()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const breadcrumbs = getBreadcrumbs(location.pathname)

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
            <AppSidebar session={session} />
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
                                {breadcrumbs.map((breadcrumb, index) => {
                                    const isCurrentPage = index === breadcrumbs.length - 1

                                    return (
                                        <Fragment key={breadcrumb.href}>
                                            {index > 0 ? <BreadcrumbSeparator /> : null}
                                            <BreadcrumbItem>
                                                {isCurrentPage ? (
                                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={breadcrumb.href}>
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                        </Fragment>
                                    )
                                })}
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

function getBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean)
    const appIndex = segments.indexOf("app")
    const appSegments = appIndex >= 0 ? segments.slice(appIndex) : segments

    return appSegments.map((segment, index) => {
        const href = `/${appSegments.slice(0, index + 1).join("/")}`

        return {
            href,
            label: breadcrumbLabels[href] ?? formatBreadcrumbLabel(segment),
        }
    })
}

function formatBreadcrumbLabel(segment: string) {
    return segment
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}
