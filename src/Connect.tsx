import {useRef, useState} from "react";
import {setNameAndAddress} from "./localstorage";
import { ChildProcess } from 'child_process'

type ConnectProps = {
  changeScreen: () => void
}

export function Connect({ changeScreen }: ConnectProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onConnect() {
    const name = nameRef.current!.value
    const address = addressRef.current!.value

    setLoading(true)
    const isOpen = await window.Main.testConnection(address)
    setLoading(false)
    if (!isOpen) {
      setError('Couldn\'t connect. try again later.')
      return
    }

    setNameAndAddress(name, address)
    await window.Main.startPinging(import.meta.env.DEV, name, address)
    changeScreen()
  }

  return (
    <div className="form">
      <div style={{gap: '0.5rem', display: 'flex'}}>
        <label>Server Address</label>
        <input style={{flex: 1}} ref={addressRef}/>
      </div>
      <div style={{gap: '0.5rem', display: 'flex'}}>
        <label style={{ color: "gray" }}>Your Name</label>
        <input style={{flex: 1}} ref={nameRef}/>
      </div>
      <button onClick={onConnect}>Connect</button>
      {loading && <p>Loading...</p>}
      <p style={{ color: "red" }}>{error}</p>
    </div>
  )
}
