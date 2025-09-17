import React from 'react'
import SignUp from './Components/Auth/SignUp/page'
import SignIn from './Components/Auth/SignIn/page'
import AdminDashboard from './Components/DashBoard/page'

function page() {
  return (
    <div>
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <SignUp />
        </div>
      </main>

    </div>
  )
}

export default page