import socket
import ssl
import datetime
import urllib.request
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Override rate limits for scanning
class DomainScanView(APIView):
    throttle_classes = []

    def get_dns_records(self, domain, record_type):
        """Query Google's DNS-over-HTTPS API to retrieve clean JSON records."""
        url = f"https://dns.google/resolve?name={domain}&type={record_type}"
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=4) as response:
                res_data = json.loads(response.read().decode())
                if "Answer" in res_data:
                    return [ans["data"].replace('"', '') for ans in res_data["Answer"] if "data" in ans]
        except Exception as e:
            print(f"DNS API query failed for {domain} {record_type}: {e}")
        return []

    def check_ssl(self, domain):
        """Establish direct socket connection and parse certificate details."""
        context = ssl.create_default_context()
        context.check_hostname = True
        context.verify_mode = ssl.CERT_REQUIRED
        
        try:
            with socket.create_connection((domain, 443), timeout=4) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Parse dates
                    not_after_str = cert.get('notAfter')
                    not_after = datetime.datetime.strptime(not_after_str, '%b %d %H:%M:%S %Y %Z')
                    days_remaining = (not_after - datetime.datetime.utcnow()).days
                    
                    # Get issuer details
                    issuer_dict = dict(x[0] for x in cert.get('issuer', []))
                    issuer_name = issuer_dict.get('commonName', 'Unknown Issuer')
                    
                    return {
                        "valid": True,
                        "issuer": issuer_name,
                        "days_remaining": days_remaining,
                        "expires_at": not_after.strftime('%Y-%m-%d'),
                        "detail": f"SSL active (Expires in {days_remaining} days, Issuer: {issuer_name})"
                    }
        except Exception as e:
            return {
                "valid": False,
                "issuer": "N/A",
                "days_remaining": 0,
                "expires_at": "N/A",
                "detail": f"SSL Handshake/Connection failed: {str(e)}"
            }

    def check_headers(self, domain):
        """Make a fast HTTP HEAD request and check security transport headers."""
        url = f"https://{domain}"
        hsts = False
        csp = False
        x_frame = False
        server_info = "Unknown"
        
        try:
            req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "SecureStack-Scanner/1.0"})
            with urllib.request.urlopen(req, timeout=4) as response:
                headers = response.info()
                
                # Check for headers (case-insensitive)
                for h_name, h_val in headers.items():
                    h_lower = h_name.lower()
                    if h_lower == "strict-transport-security":
                        hsts = True
                    elif h_lower == "content-security-policy":
                        csp = True
                    elif h_lower == "x-frame-options":
                        x_frame = True
                    elif h_lower == "server":
                        server_info = h_val
        except Exception as e:
            # Fallback to standard GET if HEAD is blocked
            try:
                req = urllib.request.Request(url, method="GET", headers={"User-Agent": "SecureStack-Scanner/1.0"})
                with urllib.request.urlopen(req, timeout=4) as response:
                    headers = response.info()
                    for h_name, h_val in headers.items():
                        h_lower = h_name.lower()
                        if h_lower == "strict-transport-security":
                            hsts = True
                        elif h_lower == "content-security-policy":
                            csp = True
                        elif h_lower == "x-frame-options":
                            x_frame = True
                        elif h_lower == "server":
                            server_info = h_val
            except Exception as inner_e:
                print(f"Header query failed for {domain}: {inner_e}")
                
        return {
            "hsts": hsts,
            "csp": csp,
            "x_frame": x_frame,
            "server": server_info
        }

    def get(self, request):
        domain = request.query_params.get('domain', '').strip().lower()
        if not domain:
            return Response({"error": "Domain parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Clean domain names (remove protocol and paths)
        if "://" in domain:
            domain = domain.split("://")[1]
        if "/" in domain:
            domain = domain.split("/")[0]
        if ":" in domain:
            domain = domain.split(":")[0]

        # 1. DNS Record Auditing
        mx_records = self.get_dns_records(domain, "MX")
        txt_records = self.get_dns_records(domain, "TXT")
        dmarc_records = self.get_dns_records(f"_dmarc.{domain}", "TXT")
        
        # Extract SPF & DMARC details
        spf_value = None
        for r in txt_records:
            if r.startswith("v=spf1"):
                spf_value = r
                break
                
        dmarc_value = None
        for r in dmarc_records:
            if r.startswith("v=DMARC1"):
                dmarc_value = r
                break

        # 2. SSL/TLS Audit
        ssl_info = self.check_ssl(domain)

        # 3. HTTP Headers Audit
        header_info = self.check_headers(domain)

        # 4. Grading System
        score = 100
        reasons = []

        # DNS Points
        if not mx_records:
            score -= 15
            reasons.append("No MX mail routing records detected.")
        if not spf_value:
            score -= 20
            reasons.append("Missing SPF record. Increases risk of email spoofing.")
        if not dmarc_value:
            score -= 20
            reasons.append("Missing DMARC policy. Domain vulnerable to direct impersonation.")
            
        # SSL Points
        if not ssl_info["valid"]:
            score -= 30
            reasons.append("SSL/TLS handshake failed. Transport channel is unencrypted.")
        elif ssl_info["days_remaining"] < 15:
            score -= 10
            reasons.append(f"SSL certificate is expiring soon ({ssl_info['days_remaining']} days).")

        # Header Points
        if not header_info["hsts"]:
            score -= 10
            reasons.append("HSTS (HTTP Strict Transport Security) header missing.")
        if not header_info["x_frame"]:
            score -= 10
            reasons.append("X-Frame-Options header missing. Vulnerable to clickjacking attacks.")
        if not header_info["csp"]:
            score -= 5
            reasons.append("Content-Security-Policy (CSP) header missing.")

        # Bind score limits and evaluate grade
        score = max(0, score)
        if score >= 90:
            grade = "A"
        elif score >= 75:
            grade = "B"
        elif score >= 60:
            grade = "C"
        elif score >= 45:
            grade = "D"
        else:
            grade = "F"

        return Response({
            "domain": domain,
            "timestamp": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "grade": grade,
            "score": score,
            "reasons": reasons,
            "dns": {
                "mx_status": len(mx_records) > 0,
                "spf_record": spf_value or "Not configured",
                "dmarc_record": dmarc_value or "Not configured"
            },
            "ssl": ssl_info,
            "headers": header_info
        }, status=status.HTTP_200_OK)
