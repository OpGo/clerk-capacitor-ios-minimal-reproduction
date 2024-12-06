import * as React from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { useHistory, Link } from 'react-router-dom'
import './SignIn.css'

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const history = useHistory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('SignInForm: handleSubmit called')

    if (!isLoaded) {
      console.warn('SignInForm: Clerk is not loaded')
      setLoading(false)
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      console.log('SignInForm: signInAttempt', signInAttempt)

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        console.log('SignInForm: Sign in successful, redirecting to /app/success')
        history.replace('/app/success')
      } else {
        console.error('SignInForm: Sign in failed')
        setError('Sign in failed. Please try again.')
      }
    } catch (err: any) {
      console.error('SignInForm: Error during sign in', err)
      setError(err.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signin-container">
      <h1>Sign in</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Enter email address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={email}
            disabled={loading}
            autoComplete="email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Enter password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
            disabled={loading}
            autoComplete="current-password"
            className="form-input"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !email || !password}
          className="submit-button"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  )
}