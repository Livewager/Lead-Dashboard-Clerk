import { SignIn } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your leads dashboard
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl',
              headerTitle: 'text-white text-2xl font-bold',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-white/10 hover:bg-white/15 border border-white/20 text-white',
              socialButtonsBlockButtonText: 'text-white font-medium',
              formFieldLabel: 'text-gray-200 font-medium',
              formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20',
              formButtonPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white normal-case text-base font-semibold',
              footerActionLink: 'text-cyan-400 hover:text-cyan-300 font-medium',
              footerActionText: 'text-gray-400',
              dividerLine: 'bg-white/20',
              dividerText: 'text-gray-400',
            }
          }}
        />
      </div>
    </div>
  )
}
