"use client";

import { Button, Card, Form, Input, Textarea } from '@heroui/react'
import { useSession } from '../lib/auth-client'

export default function ContactForm () {

  const { data: session } = useSession();


  return (
    <Form
        id='contact-form'
        className='contact-form space-y-4 max-w-[600px]'>
        <Input
            placeholder='Votre prénom'
            type='text'
            name='name'
            value={session?.user.firstname}
            size="lg"
            required={true}
        />
        <Input
            placeholder='Votre nom'
            type='text'
            name='name'
            value={session?.user.name}
            size="lg"
            required={true}
        />
        <Input
            placeholder='Votre adresse email'
            type='email'
            name='email'
            value={session?.user.email}
            size="lg"
            required={true}
        />
        <Textarea
            maxLength={300}
            placeholder='Votre message'
            name='message'
            required={true}
            size="lg"
            height={500}
        />
        <Button type='submit' className="bg-sky-500 uppercase font-bold text-white">Envoyer</Button>
    </Form>
  )
}
