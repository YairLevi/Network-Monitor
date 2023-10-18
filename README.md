# Network Monitor

This app provides LAN users to share and view other users' network bandwidth usage.
Why would you need such a thing? I come from a big family, and sometimes we want to download something...
But we have only 40Mbps. Kinda sad, but it works pretty fine, I guess.
Anyway, when one person downloads something, they'll lie about it, and hide it, while we suffer from lags and bottlenecks in our network usage.
Sometimes it even incited fights and arguments.
So, this way, we know what's the situation of usage around the house, and whether someone actually downloads something, or the internet just has a bad day :)

## Dependancies
To send network data, I use a python script which I turned into an executable (to avoid having users to install python).
It uses `scapy`, which is dependant on `WinPcap`.
You can use `NPcap` if you want, as `WinPcap` is depracated.
I still haven't tried it on Mac or Linux, so for the meantime, this is what I know for windows.
If you can build the app on a Mac, and install `NPcap` or some alternative to make `scapy` work, congrats.

## Usage
Run the server from somewhere, change the address to meet your network.
Then, build the app using `npm run dist`, and enjoy.

![placeholder-image](https://github.com/YairLevi/Network-Monitor/blob/main/Capture.PNG)
