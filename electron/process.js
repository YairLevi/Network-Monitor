"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pyProcess = void 0;
const child_process_1 = require("child_process");
const tree_kill_1 = __importDefault(require("tree-kill"));
let i = 0;
class Process {
    childProcess = null;
    constructor() { }
    spawn(isDev, ...args) {
        const scriptPath = isDev ? 'scapy.exe' : 'resources/scapy.exe';
        this.childProcess = (0, child_process_1.spawn)(scriptPath, args);
        this.childProcess.stdout.setEncoding('utf-8');
        this.childProcess.stderr.setEncoding('utf-8');
        this.childProcess.stdout.on('data', (data) => console.log(data));
        this.childProcess.stderr.on('data', (data) => console.log(data));
    }
    shutdown() {
        if (!this.childProcess) {
            return console.log('child is null');
        }
        (0, tree_kill_1.default)(this.childProcess.pid, (err) => console.log(err));
        this.childProcess = null;
    }
}
const process = new Process();
exports.pyProcess = process;
