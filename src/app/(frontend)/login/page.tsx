import { AuthForm } from '@/components/petsos/AuthForm'
import { loginAction } from '../auth-actions'

export default function LoginPage() {
  return <AuthForm action={loginAction} mode="login" />
}
