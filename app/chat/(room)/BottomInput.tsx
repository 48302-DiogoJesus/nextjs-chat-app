import { useRef } from "react"

type BottomInputProps = {
  onSendMessage: (message: string) => void,
}

export default function BottomInput(
  { onSendMessage }: BottomInputProps
) {

  const sendMessageInputRef = useRef<HTMLInputElement>(null)

  return (
    <div id="chat-bottom"
      className="flex items-center justify-end"
    >
      <input
        ref={sendMessageInputRef}
        placeholder="Type a message ..."
        className="input w-full"
        onKeyDown={e => {
          if (e.key === "Enter") {
            onSendMessage(sendMessageInputRef.current!.value)
            sendMessageInputRef.current!.value = ""
          }
        }}
      />
      <button
        onClick={() => {
          onSendMessage(sendMessageInputRef.current!.value)
          sendMessageInputRef.current!.value = ""
        }}
        className="
          btn mx-4
          bg-orange-700 text-white
          hover:bg-orange-800 hover:opacity-90
        "
      >
        Send
      </button>
    </div>
  )
}