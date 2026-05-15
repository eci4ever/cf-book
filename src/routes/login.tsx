import { createFileRoute } from '@tanstack/react-router'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form';

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthShell>
            <LoginForm />
        </AuthShell>
    )
}
