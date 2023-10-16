import {ChildProcess, spawn} from "child_process";
import treeKill from "tree-kill";

class Process {
  childProcess: ChildProcess = null

  constructor() {}

  spawn(isDev: boolean, ...args: any) {
    const scriptPath = isDev ? 'scapy.exe' : 'resources/scapy.exe'
    this.childProcess = spawn(scriptPath, args)

    this.childProcess.stdout.setEncoding('utf-8')
    this.childProcess.stderr.setEncoding('utf-8')
    this.childProcess.stdout.on('data', (data) => console.log(data))
    this.childProcess.stderr.on('data', (data) => console.log(data))
  }

  shutdown() {
    if (!this.childProcess) {
      return console.log('child is null')
    }
    treeKill(this.childProcess.pid, (err) => console.log(err))
    this.childProcess = null
  }
}

const process = new Process()
export { process as pyProcess }
