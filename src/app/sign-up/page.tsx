import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Join Clinic Concierge
          </h1>
          <p className="text-gray-400">
            Start claiming premium leads for your beauty clinic
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-sm normal-case',
              card: 'bg-black/20 backdrop-blur-sm border border-white/10',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border border-white/20',
              formFieldInput: 'bg-white/10 border border-white/20 text-white',
              footerActionLink: 'text-green-400 hover:text-green-300',
            }
          }}
        />
      </div>
    </div>
  )
}
