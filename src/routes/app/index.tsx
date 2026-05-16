import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from "@tanstack/react-start/server"

const getCurrentSession = createServerFn({ method: "GET" }).handler(
    async () => {
        const { auth } = await import("@/lib/auth")

        return auth.api.getSession({
            headers: getRequestHeaders(),
        })
    }
)

export const Route = createFileRoute('/app/')({
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
    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </>
    )
}
