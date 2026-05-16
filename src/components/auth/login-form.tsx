import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState, type ComponentProps } from "react"
import { authClient } from "#/lib/auth-client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event
  ) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    setError(null)
    setIsSubmitting(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || "Unable to login.")
        return
      }

      await navigate({ to: "/app" })
    } catch {
      setError("Unable to login.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="gap-1.5 text-center">
          <CardTitle className="text-xl font-semibold leading-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            Login with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form onSubmit={handleSubmit} className="grid w-full gap-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    disabled={isSubmitting}
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm leading-none underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" className="font-medium" disabled={isSubmitting}>
                    Login
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
