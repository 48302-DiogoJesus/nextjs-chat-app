import { useEffect, useRef, useState } from "react"
import { createEmitter } from 'ts-typed-events';

const ModalId = "simple-modal"
const ModalTriggerId = `${ModalId}-trigger`

type ModalParams = {
  title: string,
  message?: string,
  showButtons?: boolean,
  closeAutomaticAfterSeconds?: number
}

enum EventType { OPEN, CLOSE }
type EventData = {
  type: EventType,
  params?: ModalParams
}
const { emit, event: listen } = createEmitter<EventData>();

export function launchModal(params: ModalParams) {
  emit({ type: EventType.OPEN, params: params })
}

export function closeModal() {
  emit({ type: EventType.CLOSE })
}

// This needs to be placed in the document body
export function SimpleModal() {

  const modalTriggerElem = useRef<HTMLInputElement>(null)
  const [showButtons, setShowButtons] = useState<boolean>(false)

  useEffect(() => {
    const modal: HTMLInputElement = window.document.querySelector(`#${ModalId}`)!
    const modalTitle: HTMLInputElement = modal.querySelector(".title")!
    const modalMessage: HTMLInputElement = modal.querySelector(".message")!

    let closeTimeout: NodeJS.Timeout | null = null

    listen.on((event) => {
      if (closeTimeout)
        clearTimeout(closeTimeout)

      if (event.type == EventType.OPEN) {
        const { title, message, showButtons, closeAutomaticAfterSeconds } = event.params!

        modalTitle.innerText = title
        modalMessage.innerText = message ?? ''
        setShowButtons(showButtons ?? true)
        if (closeAutomaticAfterSeconds) {
          closeTimeout = setTimeout(closeModal, closeAutomaticAfterSeconds * 1000)
        }
        // open
        modalTriggerElem.current!.checked = true
      }
      else if (event.type == EventType.CLOSE) {
        // close
        modalTriggerElem.current!.checked = false
      }
    })

    return () => {
      // Not that important (The modal should be at the top level so only unmounts when user leaves)
      listen.offAll()
      if (closeTimeout)
        clearTimeout(closeTimeout)
    }
  }, [])

  return (
    <>
      <input ref={modalTriggerElem} type="checkbox" id={ModalTriggerId} className="modal-toggle" />
      <label id={ModalId} htmlFor={ModalTriggerId} className="modal cursor-pointer">
        <label className="modal-box flex flex-col justify-center items-center" htmlFor="">
          <h3 className="title text-xl font-bold"></h3>
          <p className="message py-4"></p>

          {
            showButtons &&
            <div id="buttons" className="pt-2 flex items-center justify-end">
              <button
                className="btn self-end bg-orange-800 hover:bg-orange-700"
                onClick={() => { modalTriggerElem.current!.checked = false }}
              >
                Close
              </button>
            </div>
          }
        </label>
      </label>
    </>
  )
}