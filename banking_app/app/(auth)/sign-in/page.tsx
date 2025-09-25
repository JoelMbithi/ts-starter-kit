
import AuthForm from '@/components/AuthForm/AuthForm'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const SignIn = async () => {
  const loggedUser = await getLoggedInUser()
 

  
  return (
    <section className='flex-center size-full max-sm:px-6'>
       <AuthForm type='sign-in' />
    </section>
  )
}

export default SignIn
