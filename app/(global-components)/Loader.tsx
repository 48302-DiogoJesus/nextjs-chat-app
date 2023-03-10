export default function Loader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <div
        className="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-gray-500 align-[-0.125em] text-primary opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        />
      </div>
      <div>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  )
}