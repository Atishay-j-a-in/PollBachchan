import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import AuthLayout from '../components/AuthLayout'
import { useState } from 'react'
import * as authApi from '../api/authApi'

const SignupPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setError('')
        await authApi.register(value)
        navigate('/login', { state: location.state })
      } catch (err) {
        setError(err.response?.data?.message || 'Signup failed.')
      }
    },
  })

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your first poll in minutes."
      footer={
        <p className="text-center text-[14px] text-[#a9a9a9]">
          Already have an account?{' '}
          <Link className="text-white underline" to="/login" state={location.state}>
            Log in
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
          name="name"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label
                className="text-[12px] uppercase tracking-[1.4px] text-[#a9a9a9]"
                htmlFor={field.name}
              >
                Name
              </label>
              <input
                className="rounded-full border border-[#1b1b1b] bg-transparent px-5 py-3 text-[14px] text-white outline-none transition focus:border-white"
                id={field.name}
                name={field.name}
                type="text"
                placeholder="Your name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        />
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
                placeholder="Create a password"
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
          Sign Up
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignupPage
