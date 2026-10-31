import { GoogleLogin } from "@react-oauth/google"
import { useActionData, useNavigation, useSubmit } from "react-router"

export default function Login() {
  //use useSubmit, which submits data to the current route's action.
  const submit = useSubmit()
  const actionData = useActionData()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === "submitting"

  const handleGoogleSuccess = (credentialResponse) => {
    const credential = credentialResponse.credential

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

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      {isSubmitting && <p>Signing you in...</p>}

      {actionData?.message && <p>{actionData.message}</p>}
    </div>
  )
}
