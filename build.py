# build.py
from pathlib import Path
import re, shutil

SRC = Path("src")
DIST = Path("dist")
DIST.mkdir(exist_ok=True)

INCLUDE_RE = re.compile(r'<!--#include\s+file="([^"]+)"\s*-->')

def expand_includes(html_text: str, cwd: Path) -> str:
    def repl(m):
        inc_path = cwd / m.group(1)
        try:
            return inc_path.read_text(encoding="utf-8")
        except Exception as e:
            print(f"[WARN] include missing: {inc_path} ({e})")
            return f"<!-- include not found: {inc_path} -->"
    # ネスト対応：include が無くなるまで展開
    prev = None
    cur = html_text
    while prev != cur:
        prev = cur
        cur = INCLUDE_RE.sub(lambda m: repl(m), cur)
    return cur

def copy_or_process(src_path: Path, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if src_path.suffix.lower() == ".html":
        txt = src_path.read_text(encoding="utf-8")
        txt = expand_includes(txt, src_path.parent)
        out_path.write_text(txt, encoding="utf-8")
    else:
        # 画像/CSS/JSなどはそのままコピー
        shutil.copy2(src_path, out_path)

def main():
    # dist をまるごと初期化（必要ならコメントアウト）
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(exist_ok=True)

    for p in SRC.rglob("*"):
        if p.is_dir(): 
            continue
        rel = p.relative_to(SRC)
        out = DIST / rel
        copy_or_process(p, out)
    print("[OK] build completed -> dist/")

if __name__ == "__main__":
    main()
