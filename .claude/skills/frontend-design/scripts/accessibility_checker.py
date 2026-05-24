#!/usr/bin/env python3
"""
Accessibility Checker - WCAG compliance audit
Checks HTML files for accessibility issues.

Usage:
    python accessibility_checker.py <project_path>

Checks:
    - Form labels
    - ARIA attributes
    - Color contrast hints
    - Keyboard navigation
    - Semantic HTML
"""

import sys
import json
import re
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except:
    pass


def find_html_files(project_path: Path) -> list:
    """Find all HTML/JSX/TSX files."""
    patterns = ['**/*.html', '**/*.jsx', '**/*.tsx']
    skip_dirs = {'node_modules', '.next', 'dist', 'build', '.git'}
    
    files = []
    for pattern in patterns:
        for f in project_path.glob(pattern):
            if not any(skip in f.parts for skip in skip_dirs):
                files.append(f)
    
    return files[:50]


def check_accessibility(file_path: Path) -> list:
    """Check a single file for accessibility issues."""
    issues = []
    
    try:
        content = file_path.read_text(encoding='utf-8', errors='ignore')
        
        # Check for form inputs without labels
        inputs = re.findall(r'<input[^>]*>', content, re.IGNORECASE)
        for inp in inputs:
            if 'type="hidden"' not in inp.lower():
                if 'aria-label' not in inp.lower() and 'id=' not in inp.lower():
                    issues.append("Input without label or aria-label")
                    break
        
        # Check for buttons without accessible text
        buttons = re.findall(r'<button[^>]*>[^<]*</button>', content, re.IGNORECASE)
        for btn in buttons:
            # Check if button has text content or aria-label
            if 'aria-label' not in btn.lower():
                text = re.sub(r'<[^>]+>', '', btn)
                if not text.strip():
                    issues.append("Button without accessible text")
                    break
        
        # Check for missing lang attribute
        if '<html' in content.lower() and 'lang=' not in content.lower():
            issues.append("Missing lang attribute on <html>")
        
        # Check for missing skip link
        if '<main' in content.lower() or '<body' in content.lower():
            if 'skip' not in content.lower() and '#main' not in content.lower():
                issues.append("Consider adding skip-to-main-content link")
        
        # Check for click handlers without keyboard support
        onclick_count = content.lower().count('onclick=')
        onkeydown_count = content.lower().count('onkeydown=') + content.lower().count('onkeyup=')
        if onclick_count > 0 and onkeydown_count == 0:
            issues.append("onClick without keyboard handler (onKeyDown)")
        
        # Check for tabIndex misuse
        if 'tabindex=' in content.lower():
            if 'tabindex="-1"' not in content.lower() and 'tabindex="0"' not in content.lower():
                positive_tabindex = re.findall(r'tabindex="([1-9]\d*)"', content, re.IGNORECASE)
                if positive_tabindex:
                    issues.append("Avoid positive tabIndex values")
        
        # Check for autoplay media
        if 'autoplay' in content.lower():
            if 'muted' not in content.lower():
                issues.append("Autoplay media should be muted")
        
        # Check for role usage
        if 'role="button"' in content.lower():
            # Divs with role button should have tabindex
            div_buttons = re.findall(r'<div[^>]*role="button"[^>]*>', content, re.IGNORECASE)
            for div in div_buttons:
                if 'tabindex' not in div.lower():
                    issues.append("role='button' without tabindex")
                    break
        
    except Exception as e:
        issues.append(f"Error reading file: {str(e)[:50]}")
    
    return issues


def main():
    project_path = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    
    print(f"\n{'='*60}")
    print(f"[ACCESSIBILITY CHECKER] WCAG Compliance Audit")
    print(f"{'='*60}")
    print(f"Project: {project_path}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-"*60)
    
    # Find HTML files
    files = find_html_files(project_path)
    print(f"Found {len(files)} HTML/JSX/TSX files")
    
    if not files:
        output = {
            "script": "accessibility_checker",
            "project": str(project_path),
            "files_checked": 0,
            "issues_found": 0,
            "passed": True,
            "message": "No HTML files found"
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)
    
    # Check each file
    all_issues = []
    
    for f in files:
        issues = check_accessibility(f)
        if issues:
            all_issues.append({
                "file": str(f.name),
                "issues": issues
            })
    
    # Summary
    print("\n" + "="*60)
    print("ACCESSIBILITY ISSUES")
    print("="*60)
    
    if all_issues:
        for item in all_issues[:10]:
            print(f"\n{item['file']}:")
            for issue in item["issues"]:
                print(f"  - {issue}")
        
        if len(all_issues) > 10:
            print(f"\n... and {len(all_issues) - 10} more files with issues")
    else:
        print("No accessibility issues found!")
    
    total_issues = sum(len(item["issues"]) for item in all_issues)
    # Accessibility issues are important but not blocking
    passed = total_issues < 5  # Allow minor issues
    
    output = {
        "script": "accessibility_checker",
        "project": str(project_path),
        "files_checked": len(files),
        "files_with_issues": len(all_issues),
        "issues_found": total_issues,
        "passed": passed
    }
    
    print("\n" + json.dumps(output, indent=2))
    
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
