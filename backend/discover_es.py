import requests

hosts = ["127.0.0.1", "localhost", "0.0.0.0", "host.docker.internal"]
port = 9200

for host in hosts:
    url = f"http://{host}:{port}"
    try:
        print(f"Checking {url}...")
        resp = requests.get(url, timeout=2)
        print(f"SUCCESS: {url} -> {resp.status_code}")
    except Exception as e:
        print(f"FAILED: {url} -> {e}")
