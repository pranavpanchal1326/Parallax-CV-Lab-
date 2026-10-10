"""Source edits for the play pass: sampling playground on Today, role menu, stylesheet import. Idempotent."""
from pathlib import Path

web = Path(__file__).resolve().parents[2] / 'apps/lab-web'


def edit(rel, marker, old, new):
    p = web / rel
    s = p.read_bytes().decode('utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:70], s.count(old))
    p.write_bytes(s.replace(old, new).encode('utf-8'))


edit('src/main.tsx', 'polish-play.css',
     'import "./styles/polish-ux.css";\n',
     'import "./styles/polish-ux.css";\nimport "./styles/polish-play.css";\n')
edit('src/features/StudentJourney.tsx', 'SignalPlayground',
     'import { LabPlan } from "../components/LabPlan";',
     'import { LabPlan } from "../components/LabPlan";\nimport { SignalPlayground } from "../components/SignalPlayground";')
edit('src/features/StudentJourney.tsx', '<SignalPlayground />',
     '      <section className="lab-now" aria-labelledby="lab-now">',
     '      <SignalPlayground />\n      <section className="lab-now" aria-labelledby="lab-now">')
app = 'src/app/App.tsx'
edit(app, 'role-menu',
     '''          <span className="role-chip">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8.5" r="3.6" />
              <path d="M4.5 20c.8-4 3.8-6 7.5-6s6.700 2 7.500 6" />
            </svg>
            {role}
          </span>''',
     '''          <details className="role-menu" ref={roleMenu}>
            <summary className="role-chip" aria-label={`${role}. Switch view`}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8.5" r="3.6" />
                <path d="M4.5 20c.8-4 3.8-6 7.5-6s6.700 2 7.500 6" />
              </svg>
              {role}
            </summary>
            <ul className="role-menu-list">
              <li><NavLink end to="/">Student <small>Today</small></NavLink></li>
              <li><NavLink to="/tech">Technician <small>Faults and assets</small></NavLink></li>
              <li><NavLink to="/faculty">Faculty <small>Teaching plan</small></NavLink></li>
              <li><NavLink to="/dashboard">Lab staff <small>Smart lab</small></NavLink></li>
              <li><NavLink to="/wall">Public display <small>Wall screen</small></NavLink></li>
            </ul>
          </details>''')
edit(app, 'const roleMenu',
     '  const main = useRef<HTMLElement>(null);',
     '  const main = useRef<HTMLElement>(null);\n  const roleMenu = useRef<HTMLDetailsElement>(null);')
edit(app, 'roleMenu.current.open = false',
     '    setNavigationOpen(false);',
     '    setNavigationOpen(false);\n    if (roleMenu.current) roleMenu.current.open = false;')
print('play pass applied')
