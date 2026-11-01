import { GoogleLogin } from "@react-oauth/google"
import { Form, useActionData, useNavigation, useSubmit } from "react-router"

export default function Login() {
  const submit = useSubmit()
  const actionData = useActionData()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === "submitting"

  const handleGoogleSuccess = (credentialResponse) => {
    const credential = credentialResponse.credential

    if (!credential) return

    const formData = new FormData()
    formData.append("credential", credential)

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
    })
  }

  const handleGoogleError = () => {
    console.error("Google authentication failed")
  }

  return (
    <div>
      <h1>Welcome to BookLeaf</h1>

      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </Form>

      <p>OR</p>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      {isSubmitting && <p>Signing you in...</p>}

      {actionData?.message && <p role="alert">{actionData.message}</p>}
    </div>
  )
}
