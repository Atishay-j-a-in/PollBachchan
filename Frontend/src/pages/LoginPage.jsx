import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import AuthLayout from '../components/AuthLayout'
import * as authApi from '../api/authApi'
import useAuth from '../hooks/useAuth'

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromLocation = location.state?.from
  const redirectTo = fromLocation 
    ? `${fromLocation.pathname}${fromLocation.search}` 
    : '/dashboard'
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated && !location.state?.from) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate, location.state?.from])

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError('')
        const data = await authApi.login(value)
        login({ user: { name: data?.name }, accessToken: data?.accessToken })
        navigate(redirectTo, { replace: true })
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed.')
      }
    },
  })

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue creating and tracking polls."
      footer={
        <p className="text-center text-[14px] text-[#a9a9a9]">
          New here?{' '}
          <Link className="text-white underline" to="/signup" state={location.state}>
            Create an account
          </Link>
        </p>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        {error ? (
          <p className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-[13px] text-red-300">
            {error}
          </p>
        ) : null}
        <form.Field
          name="email"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]"
                htmlFor={field.name}
              >
                Email
              </label>
              <input
                className="rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                id={field.name}
                name={field.name}
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]"
                htmlFor={field.name}
              >
                Password
              </label>
              <input
                className="rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                id={field.name}
                name={field.name}
                type="password"
                placeholder="Enter your password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        />
        <button
          className="mt-2 rounded-full border border-white bg-white px-6 py-3 text-[14px] uppercase tracking-[1px] text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
          type="submit"
        >
          Log In
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
