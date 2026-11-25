import { AuthForm } from '@/components/petsos/AuthForm'
import { signupAction } from '../auth-actions'

export default function SignupPage() {
  return <AuthForm action={signupAction} mode="signup" />
}
