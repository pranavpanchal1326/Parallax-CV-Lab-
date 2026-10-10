"""Source edits for the experience pass: guided tour, quick search, page art, stylesheet import. Idempotent."""
from pathlib import Path

web = Path(__file__).resolve().parents[2] / 'apps/lab-web'


def edit(rel, marker, old, new):
    p = web / rel
    s = p.read_bytes().decode('utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:70], s.count(old))
    p.write_bytes(s.replace(old, new).encode('utf-8'))


app = 'src/app/App.tsx'
edit(app, 'GuidedTour',
     'import { downloadJson, ExportFallback } from "../components/ExportFallback";',
     'import { downloadJson, ExportFallback } from "../components/ExportFallback";\n'
     'import { TourStrip, tourStops } from "../components/GuidedTour";\n'
     'import { CommandPalette } from "../components/CommandPalette";')
edit(app, 'useNavigate,',
     '  Outlet,\n  useLocation,',
     '  Outlet,\n  useLocation,\n  useNavigate,')
edit(app, 'const [tour, setTour]',
     '  const [activity, setActivity] = useState(false);',
     '  const [activity, setActivity] = useState(false);\n'
     '  const navigate = useNavigate();\n'
     '  const [tour, setTour] = useState<number | null>(() => {\n'
     '    try {\n'
     '      const saved = window.sessionStorage.getItem("parallax-tour");\n'
     '      const value = saved === null ? NaN : Number(saved);\n'
     '      return Number.isInteger(value) && value >= 0 && value < tourStops.length ? value : null;\n'
     '    } catch {\n'
     '      return null;\n'
     '    }\n'
     '  });\n'
     '  const changeTour = (next: number | null) => {\n'
     '    setTour(next);\n'
     '    try {\n'
     '      if (next === null) window.sessionStorage.removeItem("parallax-tour");\n'
     '      else window.sessionStorage.setItem("parallax-tour", String(next));\n'
     '    } catch {\n'
     '      /* The tour position is a convenience only. */\n'
     '    }\n'
     '  };')
edit(app, 'className="pbtn quiet tour-open"',
     '        <div className="mast-tools">',
     '        <div className="mast-tools">\n'
     '          <button\n'
     '            className="pbtn quiet tour-open"\n'
     '            aria-pressed={tour !== null}\n'
     '            onClick={() => {\n'
     '              if (tour !== null) changeTour(null);\n'
     '              else {\n'
     '                changeTour(0);\n'
     '                navigate(tourStops[0].to);\n'
     '              }\n'
     '            }}\n'
     '          >\n'
     '            <span>{tour !== null ? "End tour" : "Guided tour"}</span>\n'
     '          </button>\n'
     '          <CommandPalette />')
edit(app, '<TourStrip',
     '      <main id="current-view" className="lab-main" tabIndex={-1} ref={main}>',
     '      {tour !== null && <TourStrip index={tour} onChange={changeTour} />}\n'
     '      <main id="current-view" className="lab-main" tabIndex={-1} ref={main}>')
edit('src/main.tsx', 'polish-ux.css',
     'import "./styles/polish-art.css";\n',
     'import "./styles/polish-art.css";\nimport "./styles/polish-ux.css";\n')
edit('src/features/Operations.tsx', 'page-art',
     '      <h2 className="cap2">Resource consequences</h2>\n      <EquipmentOverview />',
     '      <h2 className="cap2">Resource consequences</h2>\n      <EquipmentOverview />\n'
     '      <figure className="page-art">\n'
     '        <img\n'
     '          src="studio/ART-05.svg"\n'
     '          alt="Art plate: every part of the capture kit drawn with its canonical identity, from camera and lights to tripod and calibration target."\n'
     '          loading="lazy"\n'
     '        />\n'
     '        <figcaption>\n'
     '          Every part belongs to the kit. From the{" "}\n'
     '          <Link to="/studio">art and reference studio</Link>.\n'
     '        </figcaption>\n'
     '      </figure>')
print('experience pass applied')
