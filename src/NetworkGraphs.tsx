import {Chart} from "./Chart";
import {useEffect, useState} from "react";
import {cleanLocalStorage, getNameAndAddress} from "./localstorage";

const SERVER_ADDRESS_REQ_DATA_ENDPOINT = 'http://10.0.0.33:8000/data'
const INTERVAL_MS = 2000

type GraphsProps = {
  changeScreen: () => void
}

export function NetworkGraphs({ changeScreen }: GraphsProps) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  async function onDisconnect() {
    const {name, address} = getNameAndAddress()
    try {
      await window.Main.disconnect(name, address)
    } catch (e) {

    }
    cleanLocalStorage()
    changeScreen()
  }

  useEffect(() => {
    const id = setInterval(() => {
      fetch(SERVER_ADDRESS_REQ_DATA_ENDPOINT)
        .then(res => res.json())
        .then(json => {
          setLoading(false)
          setData(json)
        })
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <div>
        {loading && <p>Loading...</p>}
        {
          Object.keys(data).map(hostname => {
            return (
              <Chart
                name={hostname}
                data={data[hostname]}
              />
            )
          })
        }
      </div>
      <br/>
      <button onClick={onDisconnect}>Disconnect</button>
    </div>
  )
}
