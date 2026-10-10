# Renders the final deck to 1280x720 PNGs with the installed PowerPoint (read-only, no window).
param([string]$OutDir = "submission\deck-slides")
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
$deck = Join-Path $root "submission\PARALLAX-Presentation-Final.pptx"
$out = Join-Path $root $OutDir
New-Item -ItemType Directory -Force $out | Out-Null
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($deck, -1, 0, 0)
  $count = $pres.Slides.Count
  foreach ($slide in $pres.Slides) {
    $slide.Export((Join-Path $out ("slide-{0:D2}.png" -f $slide.SlideIndex)), "PNG", 1280, 720)
  }
  $notes = 0
  foreach ($slide in $pres.Slides) { if ($slide.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text.Length -gt 0) { $notes++ } }
  $version = $pp.Version
  $pres.Close()
  Write-Output ("{`"slides`":$count,`"notes`":$notes,`"powerpointVersion`":`"$version`"}")
} finally { $pp.Quit() }
