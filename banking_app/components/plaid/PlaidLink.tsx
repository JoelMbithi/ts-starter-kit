"use client"

import { PlaidLinkProps } from '@/types'
import { PlaidLinkOnSuccess, usePlaidLink, PlaidLinkOptions } from 'react-plaid-link'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { createLinkToken } from '@/lib/actions/auth.actions'

const PlaidLinkComponent = ({ user, variant = 'primary' }: PlaidLinkProps) => {
  const [token, setToken] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const createToken = async () => {
      const data = await createLinkToken(user)
      setToken(data.linkToken)
    }
    createToken()
  }, [user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
    // TODO: exchange public token with backend
    console.log('Plaid connected for user', user, 'with token:', public_token)
    router.push('/')
  }, [user, router])

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <>
      {variant === 'primary' ? (
        <Button
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => open()}
          disabled={!ready || !token}
        >
          Connect Bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button>Connect your bank account</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  )
}

export default PlaidLinkComponent
