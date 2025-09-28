import { PlaidLinkProps } from '@/types'
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';
import { PlaidLinkOptions } from 'react-plaid-link'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'

import { useRouter } from 'next/navigation'
import { createLinkToken } from '@/lib/actions/auth.actions';

const plaidlink = ({user, variant}: PlaidLinkProps) => {
  const [token, setToke] = useState('')
  const router = useRouter()

  useEffect(() => {
    const createToken = async () => {
      const data = await createLinkToken(user)  
      setToke(data.linkToken)
    }
  },[user])

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: String ) => {

   /*  await exchangePublicToken({
      publicToken: public_token,
      user,
    }) */
   router.push('/')
  },[user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <>
      {variant === 'primary'  ? (
        <Button className='w-full bg-blue-500 text-white hover:bg-blue-600'
        onClick={() => open()}
        disabled={!ready}
        >
          Connect bank 
        </Button>
      ) : variant=== 'ghost' ? (
        <Button >
          Connect your bank account
        </Button>
      ): (
        <Button>
          Connect Bank
        </Button>
      )}
    </>
  )
}

export default plaidlink
