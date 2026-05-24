# snapshot-stage.ps1 — tag current commit as <stage>/<slug>/v<N>.
# Implements Principle VII (Artifact Versioning) of the constitution.
#
# Usage:
#   .\snapshot-stage.ps1 -Stage spec -Slug 001-orchestrator
#
# Behavior mirrors snapshot-stage.sh:
#   - Counts existing <stage>/<slug>/v* tags, creates v<N+1>.
#   - Idempotent: if HEAD already has tag for this stage/slug, prints existing tag and exits 0.
#   - Skips with warning if not in a git repo.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('spec', 'clarify', 'plan', 'tasks', 'review')]
    [string]$Stage,

    [Parameter(Mandatory = $true)]
    [string]$Slug
)

$ErrorActionPreference = 'Stop'

# Guard: must be in git repo
git rev-parse --show-toplevel 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Warning "[snapshot] not in a git repo, skipping stage tag"
    exit 0
}

$currentSha = (git rev-parse HEAD).Trim()

# Idempotency check
$existingAtHead = git tag --points-at HEAD --list "$Stage/$Slug/v*" | Select-Object -First 1
if ($existingAtHead) {
    Write-Output $existingAtHead
    exit 0
}

# Compute next version
$existing = git tag --list "$Stage/$Slug/v*"
$existingCount = if ($existing) { @($existing).Count } else { 0 }
$next = $existingCount + 1
$tag = "$Stage/$Slug/v$next"

git tag -a $tag -m "speckit: $Stage stage for $Slug, v$next @ $($currentSha.Substring(0,7))"
Write-Output $tag
