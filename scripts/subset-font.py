"""Rebuild app/fonts/Manrope-Latin-VariableFont_wght.woff2 from the brand pack's TTF.

Usage: python scripts/subset-font.py "../ProteGo Brand Assets/<path to>/Manrope-VariableFont_wght.ttf"
Needs: pip install fonttools brotli

Keeps the weight axis and every OpenType feature, and only the glyphs the site can use:
Latin-1, typographic punctuation, and the symbols in the copy (₹ € ™ – × … → ▲ ≈).
"""
import subprocess, sys

src = sys.argv[1] if len(sys.argv) > 1 else "../ProteGo Brand Assets/Manrope-VariableFont_wght.ttf"
unicodes = ",".join([
    "U+0020-007E", "U+00A0-00FF", "U+0131", "U+0152-0153", "U+02BB-02BC", "U+02C6", "U+02DA", "U+02DC",
    "U+2000-206F", "U+2074", "U+20AC", "U+20B9", "U+2122", "U+2190-2193", "U+2212", "U+2215", "U+2248",
    "U+25B2-25BC", "U+FEFF", "U+FFFD",
])
subprocess.check_call([
    sys.executable, "-m", "fontTools.subset", src,
    f"--unicodes={unicodes}", "--layout-features=*", "--flavor=woff2",
    "--output-file=app/fonts/Manrope-Latin-VariableFont_wght.woff2",
])
print("written app/fonts/Manrope-Latin-VariableFont_wght.woff2")
