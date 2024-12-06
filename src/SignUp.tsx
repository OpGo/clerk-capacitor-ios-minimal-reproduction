'use client'

import * as React from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { useHistory, Link } from 'react-router-dom'
import './SignUp.css'

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const history = useHistory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isLoaded) {
      setLoading(false)
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setVerifying(true)
    } catch (err: any) {
      setError(`An error occurred during sign up: ${err.message || 'Unknown error'}\nDetails: ${JSON.stringify(err, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isLoaded) {
      setLoading(false)
      return
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        history.replace('/app/success')
      } else {
        setError('Verification failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="signup-container">
        <h1>Verify your email</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleVerify} className="signup-form">
          <div className="form-group">
            <label htmlFor="code">Enter your verification code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              value={code}
              disabled={loading}
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code}
            className="submit-button"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <h1>Sign up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Enter email address</label>
          <input
            onChange={(e) => setEmailAddress(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={emailAddress}
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
            autoComplete="new-password"
            className="form-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !emailAddress || !password}
          className="submit-button"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      <div className="signin-link">
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}