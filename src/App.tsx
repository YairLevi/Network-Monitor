import {useEffect, useState} from "react";
import {Connect} from "./Connect";
import {NetworkGraphs} from "./NetworkGraphs";
import {getNameAndAddress} from "./localstorage";

function App() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    window.Main.on('cleanup-python-process', () => {
      window.Main.shutdownPython()
      window.Main.send('close')
    })
  }, []);

  useEffect(() => {
    (async function(){
      const { name, address } = getNameAndAddress()
      if (!name || !address) {
        return
      }

      await window.Main.startPinging(import.meta.env.DEV, name, address)
      setIsConnected(true)
    })()

  }, []);

  return (
    <div className="app">
      {
        isConnected
          ? <NetworkGraphs changeScreen={() => setIsConnected(false)}/>
          : <Connect changeScreen={() => setIsConnected(true)}/>
      }
    </div>
  )
}

export default App
