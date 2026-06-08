import urllib.request

url = 'https://securestack.co.zw/diagnose.php'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        with open('securestack-backend/diagnose_report.txt', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Diagnostic report saved successfully!")
except Exception as e:
    print("Error:", e)
