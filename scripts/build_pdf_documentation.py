import os
import re
import subprocess
import time
import markdown

DOCS_DIR = os.path.abspath(r'c:\SIH_2026\SmartFood-Rescue-AI_SIH_2026-main\docs')
MD_FILE = os.path.join(DOCS_DIR, 'SIH_2026_TECHNICAL_DOCUMENTATION.md')
HTML_FILE = os.path.join(DOCS_DIR, 'SIH_2026_TECHNICAL_DOCUMENTATION.html')
PDF_FILE = os.path.join(DOCS_DIR, 'SIH_2026_TECHNICAL_DOCUMENTATION.pdf')
EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

def generate_html_and_pdf():
    print(f"Reading markdown from: {MD_FILE}")
    with open(MD_FILE, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Pre-process GitHub alerts: > [!NOTE], > [!IMPORTANT], > [!WARNING], > [!TIP]
    def replace_alerts(match):
        alert_type = match.group(1).upper()
        content = match.group(2).strip()
        color_map = {
            'NOTE': ('#0284c7', '#e0f2fe', 'ℹ️ Note'),
            'IMPORTANT': ('#7c3aed', '#ede9fe', '⚠️ Important'),
            'WARNING': ('#d97706', '#fef3c7', '⚡ Warning'),
            'TIP': ('#059669', '#d1fae5', '💡 Tip'),
            'CAUTION': ('#e11d48', '#ffe4e6', '🛑 Caution')
        }
        border, bg, title = color_map.get(alert_type, ('#64748b', '#f1f5f9', alert_type))
        return f'<div class="alert-box" style="border-left: 4px solid {border}; background: {bg}; padding: 12px 16px; margin: 16px 0; border-radius: 4px;"><strong>{title}:</strong> {content}</div>'

    processed_md = re.sub(
        r'>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*\n((?:>.*(?:\n|$))*)',
        lambda m: replace_alerts(m),
        md_content
    )
    # Strip leading '>' in alert blocks
    processed_md = re.sub(r'<div class="alert-box"[^>]*>.*?</div>', lambda m: m.group(0).replace('> ', '').replace('>', ''), processed_md, flags=re.DOTALL)

    # Convert markdown to HTML
    html_body = markdown.markdown(
        processed_md,
        extensions=['tables', 'fenced_code', 'toc', 'attr_list', 'nl2br']
    )

    # Replace ```mermaid code blocks with <pre class="mermaid">
    html_body = re.sub(
        r'<pre><code class="language-mermaid">(.*?)</code></pre>',
        r'<pre class="mermaid">\1</pre>',
        html_body,
        flags=re.DOTALL
    )

    # Wrap sections with page breaks where appropriate
    html_body = html_body.replace('<hr />', '<hr class="section-divider" />')
    html_body = html_body.replace('<h2>Table of Contents</h2>', '<div class="page-break"></div><h2>Table of Contents</h2>')
    html_body = html_body.replace('<h2>1. Executive Summary</h2>', '<div class="page-break"></div><h2>1. Executive Summary</h2>')
    html_body = html_body.replace('<h2>Executive Companion:', '<div class="page-break"></div><h2>Executive Companion:')

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SmartFood Rescue AI — Technical Documentation (SIH 2026)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
    mermaid.initialize({{
        startOnLoad: true,
        theme: 'neutral',
        fontFamily: 'Inter, sans-serif'
    }});
</script>
<style>
    @page {{
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
        @bottom-right {{
            content: counter(page);
        }}
    }}
    
    * {{
        box-sizing: border-box;
    }}
    
    body {{
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #1e293b;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
    }}
    
    .container {{
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
    }}

    /* Page Breaks */
    .page-break {{
        page-break-before: always;
        break-before: page;
        margin-top: 30px;
    }}
    
    /* Headings */
    h1, h2, h3, h4, h5, h6 {{
        color: #0f172a;
        font-weight: 700;
        margin-top: 1.8em;
        margin-bottom: 0.6em;
        page-break-after: avoid;
        break-after: avoid;
    }}
    
    h1 {{
        font-size: 22pt;
        border-bottom: 2px solid #0284c7;
        padding-bottom: 8px;
        color: #0369a1;
    }}
    
    h2 {{
        font-size: 15pt;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 6px;
        color: #1e293b;
    }}
    
    h3 {{
        font-size: 12.5pt;
        color: #334155;
    }}

    p {{
        margin-top: 0;
        margin-bottom: 0.9em;
        text-align: justify;
    }}

    /* Tables */
    table {{
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0 24px 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
        break-inside: avoid;
    }}
    
    table, th, td {{
        border: 1px solid #cbd5e1;
    }}
    
    th {{
        background-color: #f1f5f9;
        color: #0f172a;
        font-weight: 600;
        padding: 8px 10px;
        text-align: left;
    }}
    
    td {{
        padding: 7px 10px;
        vertical-align: top;
    }}
    
    tr:nth-child(even) {{
        background-color: #f8fafc;
    }}

    /* Code Blocks */
    pre {{
        background: #0f172a;
        color: #f8fafc;
        padding: 12px 16px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9pt;
        overflow-x: auto;
        page-break-inside: avoid;
        break-inside: avoid;
        border: 1px solid #334155;
    }}
    
    code {{
        font-family: 'JetBrains Mono', monospace;
        background: #f1f5f9;
        color: #0369a1;
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 9.5pt;
    }}

    pre code {{
        background: transparent;
        color: inherit;
        padding: 0;
    }}

    /* Mermaid Container */
    .mermaid {{
        margin: 20px 0;
        text-align: center;
        page-break-inside: avoid;
        break-inside: avoid;
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }}

    /* Blockquotes & Callouts */
    blockquote {{
        border-left: 4px solid #0284c7;
        margin: 16px 0;
        padding: 10px 16px;
        background: #f0f9ff;
        color: #0369a1;
        font-style: italic;
    }}

    /* Divider */
    hr.section-divider {{
        border: 0;
        border-top: 1px solid #e2e8f0;
        margin: 30px 0;
    }}

    /* Badges */
    .badge {{
        display: inline-block;
        padding: 2px 7px;
        font-size: 8pt;
        font-weight: 700;
        border-radius: 9999px;
        text-transform: uppercase;
    }}

    /* Print optimizers */
    @media print {{
        body {{
            background: none;
            color: #000;
        }}
        .container {{
            max-width: 100%;
            padding: 0;
        }}
        pre {{
            background: #1e293b !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
        th {{
            background-color: #e2e8f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
        .alert-box {{
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
        .mermaid {{
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
    }}
</style>
</head>
<body>
<div class="container">
{html_body}
</div>
</body>
</html>
"""

    print(f"Writing HTML output to: {HTML_FILE}")
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(full_html)

    print("Generating PDF via Microsoft Edge headless printer...")
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=5000",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_FILE}",
        HTML_FILE
    ]
    
    subprocess.run(cmd, check=True)
    
    if os.path.exists(PDF_FILE) and os.path.getsize(PDF_FILE) > 1000:
        size_kb = os.path.getsize(PDF_FILE) / 1024
        print(f"SUCCESS: Generated PDF at {PDF_FILE} ({size_kb:.1f} KB)")
    else:
        print("Error: PDF generation failed or file is empty.")

if __name__ == '__main__':
    generate_html_and_pdf()
