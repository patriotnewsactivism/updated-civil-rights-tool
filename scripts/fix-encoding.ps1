# path: scripts/fix-encoding.ps1
# Purpose: Replace curly quotes and common mojibake (e.g., \u00C2) and re-save as UTF-8 (no BOM).
# Why: Prevents build-time SyntaxError from smart quotes like ‘react’ and characters like Â§.

param(
  [string]$Root = "src",
  [string[]]$Ext = @('.js','.jsx','.ts','.tsx','.json','.css','.md'),
  [switch]$DryRun
)

function Get-Files([string]$root,[string[]]$exts) {
  Get-ChildItem -Path $root -Recurse -File | Where-Object { $exts -contains $_.Extension }
}

function Fix-Content([string]$text) {
  # Replace true Unicode smart quotes
  $fixed = $text `
    -replace "[‘’]", "'" `
    -replace "[“”]", '"' `
    -replace " ", ' ' `
    -replace "Â(?=[ -ÿ])", ''

  # Replace common UTF-8->cp1252 mojibake sequences (e.g., â€˜ â€™ â€œ â€")
  $map = [ordered]@{
    'â€™' = "'";  # right single
    'â€˜' = "'";  # left single
    'â€œ' = '"';  # left double
    'â€�' = '"';  # right double (occasionally renders as â€�)
    'â€“' = '-';   # en dash
    'â€”' = '-';   # em dash
    'â€¦' = '...'; # ellipsis
    'â€¢' = '•';   # bullet
  }
  foreach ($k in $map.Keys) {
    $fixed = [regex]::Replace($fixed, [regex]::Escape($k), [string]$map[$k])
  }

  # Normalize to LF newlines for consistency
  $fixed = $fixed -replace "
?", "`n"
  return $fixed
}

$files = Get-Files -root $Root -exts $Ext
if (-not $files) {
  Write-Host "[fix-encoding] No files found under '$Root' with extensions: $($Ext -join ', ')" -ForegroundColor Yellow
  exit 0
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($f in $files) {
  try {
    $orig = Get-Content -LiteralPath $f.FullName -Raw
  } catch {
    Write-Host "[skip] Could not read: $($f.FullName) -> $($_.Exception.Message)" -ForegroundColor Yellow
    continue
  }

  $fixed = Fix-Content $orig
  if ($fixed -ne $orig) {
    Write-Host "[fix] $($f.FullName)"
    if (-not $DryRun) {
      $bak = "$($f.FullName).bak"
      if (-not (Test-Path -LiteralPath $bak)) {
        Copy-Item -LiteralPath $f.FullName -Destination $bak -ErrorAction SilentlyContinue
      }
      [System.IO.File]::WriteAllText($f.FullName, $fixed, $utf8NoBom)
    }
  }
}

Write-Host "[fix-encoding] Done." -ForegroundColor Green
