export const SignInPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">

      <span>
        <input className="input mr-2 text-center" placeholder="Sign in using email..." />
        <button
          className="btn"
          onClick={() => signIn('email')}
        >
          Sign In
        </button>
      </span>

      <div className="divider">OR</div>

      <button
        className="btn"

        onClick={() => signIn('github')}
      >
        {githubIcon}
        <span>{!session ? 'Sign In' : 'Sign Out'}</span>
      </button>
    </div>
  )
}