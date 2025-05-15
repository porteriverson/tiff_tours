import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

type loginInputs = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginInputs>()

  const onSubmit: SubmitHandler<loginInputs> = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
    } else {
      setErrorMsg('')
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-black dark:text-white"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-blue-500"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

        <div className="text-right">
          <Link to="/reseter" className="text-blue-500 text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="text-center text-sm mt-2">
          <p>Don't have an account?</p>
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Link to="/">Back to Home</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
