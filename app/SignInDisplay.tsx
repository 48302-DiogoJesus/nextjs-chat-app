"use client"

import { signIn } from "next-auth/react"
import { useRef } from "react"
import { launchModal } from "@/(modals)/Modal"
import { Email } from "models/commonSchemas"
import { githubIcon } from "_resources/icons"

export default function SignInDisplay({ onSignInActivated }: { onSignInActivated: () => void }) {
  const emailInputRef = useRef<HTMLInputElement | null>(null)

  const emailSignIn = () => {
    const email = emailInputRef.current!.value
    const parsedMail = Email.safeParse(email)
    if (!parsedMail.success) {
      launchModal({
        title: "Invalid Email",
        content: "Please enter a valid email address",
      })
      return
    }

    signIn('email', { email })
    onSignInActivated()
  }

  const githubSignIn = () => {
    signIn('github')
    onSignInActivated()
  }

  return (
    <div className="flex flex-col gap-4">

      <span>
        <input
          ref={emailInputRef}
          className="input mr-2 text-center"
          placeholder="Sign in using email..."
          type="email"

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              emailSignIn()
            }
          }}
        />
        <button
          className="btn"
          onClick={emailSignIn}
        >
          Sign In
        </button>
      </span>

      <div className="divider">OR</div>

      <button
        className="btn"
        onClick={githubSignIn}
      >
        {githubIcon}
        <span>Sign In</span>
      </button>
    </div>
  )
}