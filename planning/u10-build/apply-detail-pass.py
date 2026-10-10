"""One-off source edits for the detail pass (plan legend, wall photo, view transition, stylesheet import).
Idempotent: each edit is skipped when already present."""
from pathlib import Path

web = Path(__file__).resolve().parents[2] / 'apps/lab-web'


def edit(rel, marker, old, new):
    p = web / rel
    s = p.read_bytes().decode('utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:60], s.count(old))
    p.write_bytes(s.replace(old, new).encode('utf-8'))


edit('src/components/LabPlan.tsx', 'plan-legend',
     '      <figcaption>\n        Concept plan',
     '      {!safety && (\n'
     '        <ul className="plan-legend" aria-label="Plan legend">\n'
     '          <li data-k="free">Free</li>\n'
     '          <li data-k="use">In use</li>\n'
     '          <li data-k="restricted">Restricted</li>\n'
     '          <li data-k="unknown">Not located</li>\n'
     '          <li data-k="door">Door</li>\n'
     '        </ul>\n'
     '      )}\n'
     '      <figcaption>\n        Concept plan')
edit('src/features/Operations.tsx', 'wall-photo',
     '      <div className="wall-sign">\n      <p className="ed-kicker">Public display</p>',
     '      <div className="wall-sign">\n'
     '      <img className="wall-photo" src="media/room-eye.jpg" alt="" />\n'
     '      <p className="ed-kicker">Public display</p>')
edit('src/app/App.tsx', 'view-enter',
     '    window.scrollTo({ top: 0, behavior: "instant" });',
     '    window.scrollTo({ top: 0, behavior: "instant" });\n'
     '    if (main.current) {\n'
     '      main.current.classList.remove("view-enter");\n'
     '      void main.current.offsetWidth;\n'
     '      main.current.classList.add("view-enter");\n'
     '    }')
edit('src/main.tsx', 'polish-detail.css',
     'import "./styles/polish.css";\n',
     'import "./styles/polish.css";\nimport "./styles/polish-detail.css";\n')
print('detail pass applied')
