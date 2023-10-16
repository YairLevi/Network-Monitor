import json
import platform
import socket
import sys
import time

import requests
from scapy.all import sniff

total_bytes_received = 0

start = time.time()



def packet_handler(packet):
    global total_bytes_received, start

    if time.time() - start < 1:
        total_bytes_received += len(packet)
        return

    start = time.time()
    print(f"Bytes received: {total_bytes_received}")

    url = f'http://{sys.argv[1]}:8000/ping'

    # Data to send in JSON format
    data_to_send = {
        "data": total_bytes_received,
        "name": sys.argv[2]
    }

    # Convert the data to JSON format
    json_data = json.dumps(data_to_send)

    # Set the headers to indicate that you are sending JSON data
    headers = {'Content-Type': 'application/json'}

    try:
    # Send the POST request with JSON data
        requests.post(url, data=json_data, headers=headers)
    except Exception:
        print("Error. trying again in 20 seconds.")
        time.sleep(20)
    total_bytes_received = len(packet)


print(f"FROM: {platform.node()}")
sniff(prn=packet_handler)
