import { MessageModel } from "models/MessageModel";

export default function Message(
  { message, isMine }: { message: MessageModel, isMine: boolean }
) {
  return (
    <div
      className={`
        px-6 py-3 m-1
        max-w-[48%]
        rounded-md
        bg-gray-900 text-gray-300
        opacity-90
        shadow-md

        ${isMine ? "self-end" : "self-start"}
      `}
    >
      <div className="flex flex-col items-start">
        <p className="text-2xl font-bold">
          {message.author.name}
        </p>
        <p className="opacity-60 text-sm">
          {message.createdAt.toTimeString().slice(0, 5)}
        </p>
        <p className="text-lg text-light-blue">
          {message.content}
        </p>
      </div>
    </div>
  )
}