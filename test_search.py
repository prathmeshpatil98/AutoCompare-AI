import requests
import json
import sys

try:
    print("Sending search request...", file=sys.stderr)
    resp = requests.post(
        'http://127.0.0.1:8000/api/v1/search/',
        json={'query': 'mahindra xuv in gujrat'},
        timeout=10
    )
    print(f"Status: {resp.status_code}")
    print(json.dumps(resp.json(), indent=2))
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
