#!/usr/bin/env python3
"""
Test Runner - Unified test execution and coverage reporting
Runs tests and generates coverage report based on project type.

Usage:
    python test_runner.py <project_path> [--coverage]

Supports:
    - Node.js: npm test, jest, vitest
    - Python: pytest, unittest
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except:
    pass


def detect_test_framework(project_path: Path) -> dict:
    """Detect test framework and commands."""
    result = {
        "type": "unknown",
        "framework": None,
        "cmd": None,
        "coverage_cmd": None
    }
    
    # Node.js project
    package_json = project_path / "package.json"
    if package_json.exists():
        result["type"] = "node"
        try:
            pkg = json.loads(package_json.read_text(encoding='utf-8'))
            scripts = pkg.get("scripts", {})
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            
            # Check for test script
            if "test" in scripts:
                result["framework"] = "npm test"
                result["cmd"] = ["npm", "test"]
                
                # Try to detect specific framework for coverage
                if "vitest" in deps:
                    result["framework"] = "vitest"
                    result["coverage_cmd"] = ["npx", "vitest", "run", "--coverage"]
                elif "jest" in deps:
                    result["framework"] = "jest"
                    result["coverage_cmd"] = ["npx", "jest", "--coverage"]
            elif "vitest" in deps:
                result["framework"] = "vitest"
                result["cmd"] = ["npx", "vitest", "run"]
                result["coverage_cmd"] = ["npx", "vitest", "run", "--coverage"]
            elif "jest" in deps:
                result["framework"] = "jest"
                result["cmd"] = ["npx", "jest"]
                result["coverage_cmd"] = ["npx", "jest", "--coverage"]
                
        except:
            pass
    
    # Python project
    if (project_path / "pyproject.toml").exists() or (project_path / "requirements.txt").exists():
        result["type"] = "python"
        result["framework"] = "pytest"
        result["cmd"] = ["python", "-m", "pytest", "-v"]
        result["coverage_cmd"] = ["python", "-m", "pytest", "--cov", "--cov-report=term-missing"]
    
    return result


def run_tests(cmd: list, cwd: Path) -> dict:
    """Run tests and return results."""
    result = {
        "passed": False,
        "output": "",
        "error": "",
        "tests_run": 0,
        "tests_passed": 0,
        "tests_failed": 0
    }
    
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=300  # 5 min timeout for tests
        )
        
        result["output"] = proc.stdout[:3000] if proc.stdout else ""
        result["error"] = proc.stderr[:500] if proc.stderr else ""
        result["passed"] = proc.returncode == 0
        
        # Try to parse test counts from output
        output = proc.stdout or ""
        
        # Jest/Vitest pattern: "Tests: X passed, Y failed, Z total"
        if "passed" in output.lower() and "failed" in output.lower():
            import re
            match = re.search(r'(\d+)\s+passed', output, re.IGNORECASE)
            if match:
                result["tests_passed"] = int(match.group(1))
            match = re.search(r'(\d+)\s+failed', output, re.IGNORECASE)
            if match:
                result["tests_failed"] = int(match.group(1))
            result["tests_run"] = result["tests_passed"] + result["tests_failed"]
        
        # Pytest pattern: "X passed, Y failed"
        if "pytest" in str(cmd):
            import re
            match = re.search(r'(\d+)\s+passed', output)
            if match:
                result["tests_passed"] = int(match.group(1))
            match = re.search(r'(\d+)\s+failed', output)
            if match:
                result["tests_failed"] = int(match.group(1))
            result["tests_run"] = result["tests_passed"] + result["tests_failed"]
        
    except FileNotFoundError:
        result["error"] = f"Command not found: {cmd[0]}"
    except subprocess.TimeoutExpired:
        result["error"] = "Timeout after 300s"
    except Exception as e:
        result["error"] = str(e)
    
    return result


def main():
    project_path = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    with_coverage = "--coverage" in sys.argv
    
    print(f"\n{'='*60}")
    print(f"[TEST RUNNER] Unified Test Execution")
    print(f"{'='*60}")
    print(f"Project: {project_path}")
    print(f"Coverage: {'enabled' if with_coverage else 'disabled'}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Detect test framework
    test_info = detect_test_framework(project_path)
    print(f"Type: {test_info['type']}")
    print(f"Framework: {test_info['framework']}")
    print("-"*60)
    
    if not test_info["cmd"]:
        print("No test framework found for this project.")
        output = {
            "script": "test_runner",
            "project": str(project_path),
            "type": test_info["type"],
            "framework": None,
            "passed": True,
            "message": "No tests configured"
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)
    
    # Choose command
    cmd = test_info["coverage_cmd"] if with_coverage and test_info["coverage_cmd"] else test_info["cmd"]
    
    print(f"Running: {' '.join(cmd)}")
    print("-"*60)
    
    # Run tests
    result = run_tests(cmd, project_path)
    
    # Print output (truncated)
    if result["output"]:
        lines = result["output"].split("\n")
        for line in lines[:30]:
            print(line)
        if len(lines) > 30:
            print(f"... ({len(lines) - 30} more lines)")
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    if result["passed"]:
        print("[PASS] All tests passed")
    else:
        print("[FAIL] Some tests failed")
        if result["error"]:
            print(f"Error: {result['error'][:200]}")
    
    if result["tests_run"] > 0:
        print(f"Tests: {result['tests_run']} total, {result['tests_passed']} passed, {result['tests_failed']} failed")
    
    output = {
        "script": "test_runner",
        "project": str(project_path),
        "type": test_info["type"],
        "framework": test_info["framework"],
        "tests_run": result["tests_run"],
        "tests_passed": result["tests_passed"],
        "tests_failed": result["tests_failed"],
        "passed": result["passed"]
    }
    
    print("\n" + json.dumps(output, indent=2))
    
    sys.exit(0 if result["passed"] else 1)


if __name__ == "__main__":
    main()
