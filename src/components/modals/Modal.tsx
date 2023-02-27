import { useEffect, useRef, useState } from "react"
import { createEmitter } from 'ts-typed-events';

const ModalId = "simple-modal"
const ModalTriggerId = `${ModalId}-trigger`

type ModalParams = {
  title: string,
  content?: string | React.ReactNode,
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
  const [modalTitle, setModalTitle] = useState<React.ReactNode>(null)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    const modal: HTMLInputElement = window.document.querySelector(`#${ModalId}`)!

    let closeTimeout: NodeJS.Timeout | null = null

    listen.on((event) => {
      if (closeTimeout)
        clearTimeout(closeTimeout)

      if (event.type == EventType.OPEN) {
        const { title, content, showButtons, closeAutomaticAfterSeconds } = event.params!

        setModalTitle(title)
        setModalContent(content)
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
        <label className="bg-gray-700 text-gray-400 modal-box flex flex-col justify-center items-center" htmlFor="">
          <h2 className="title text-2xl font-bold">{modalTitle}</h2>
          <div className="message py-4 w-full text-center">{modalContent}</div>
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