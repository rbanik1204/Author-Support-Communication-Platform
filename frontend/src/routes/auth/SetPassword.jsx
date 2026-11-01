import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { setPasswordAPI } from "../../services/auth.api"

export default function SetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid invitation link. Token is missing.")
      return
    }

    if (password.length < 12) {
      setError("Password must contain at least 12 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const result = await setPasswordAPI(token, password)

      setSuccess(true)
      console.log(result.message)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main>
        <h1>Password successfully created!</h1>
        <p>Your BookLeaf author account is ready.</p>

        <button onClick={() => navigate("/")}>Go to Login</button>
      </main>
    )
  }

  return (
    <main>
      <h1>Set Your Password</h1>
      <p>Create a password to activate your BookLeaf account.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={12}
            maxLength={72}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={12}
            maxLength={72}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Setting Password..." : "Set Password"}
        </button>
      </form>
    </main>
  )
}
