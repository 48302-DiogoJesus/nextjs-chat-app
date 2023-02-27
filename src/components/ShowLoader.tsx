import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from "./Loader";

type LoaderCtx = {
  setIsLoading: (isLoading: boolean, message?: string) => void
}

const LoaderCtx = createContext<LoaderCtx>({ setIsLoading: () => { } })

export function useLoader() {
  return useContext(LoaderCtx);
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)
  const router = useRouter()

  useEffect(() => { setIsLoading(false) }, [router.asPath])

  if (isLoading)
    return <div className="m-20">
      <Loader message={loadingMessage ? loadingMessage : "Loading..."} />
    </div>

  return <LoaderCtx.Provider value={{
    setIsLoading: (value, message) => {
      setIsLoading(value)
      setLoadingMessage(message)
    }
  }}>
    {children}
  </LoaderCtx.Provider>
}