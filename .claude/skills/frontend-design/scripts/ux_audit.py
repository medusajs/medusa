#!/usr/bin/env python3
"""
UX Audit Script - Full Frontend Design Coverage

Analyzes code for compliance with:

1. CORE PSYCHOLOGY LAWS:
   - Hick's Law (nav items, form complexity)
   - Fitts' Law (target sizes, touch targets)
   - Miller's Law (chunking, memory limits)
   - Von Restorff Effect (primary CTA visibility)
   - Serial Position Effect (important items at start/end)

2. EMOTIONAL DESIGN (Don Norman):
   - Visceral (first impressions, gradients, animations)
   - Behavioral (feedback, usability, performance)
   - Reflective (brand story, values, identity)

3. TRUST BUILDING:
   - Security signals (SSL, encryption on forms)
   - Social proof (testimonials, reviews, logos)
   - Authority indicators (certifications, awards, media)

4. COGNITIVE LOAD MANAGEMENT:
   - Progressive disclosure (accordion, tabs, "Advanced")
   - Visual noise (too many colors/borders)
   - Familiar patterns (labels, standard conventions)

5. PERSUASIVE DESIGN (Ethical):
   - Smart defaults (pre-selected options)
   - Anchoring (original vs discount price)
   - Social proof (live indicators, numbers)
   - Progress indicators (progress bars, steps)

6. TYPOGRAPHY SYSTEM (9 sections):
   - Font Pairing (max 3 families)
   - Line Length (45-75ch)
   - Line Height (proper ratios)
   - Letter Spacing (uppercase, display text)
   - Weight and Emphasis (contrast levels)
   - Responsive Typography (clamp())
   - Hierarchy (sequential headings)
   - Modular Scale (consistent ratios)
   - Readability (chunking, subheadings)

7. VISUAL EFFECTS (10 sections):
   - Glassmorphism (blur + transparency)
   - Neomorphism (dual shadows, inset)
   - Shadow Hierarchy (elevation levels)
   - Gradients (usage, overuse)
   - Border Effects (complexity check)
   - Glow Effects (text-shadow, box-shadow)
   - Overlay Techniques (image text readability)
   - GPU Acceleration (transform/opacity vs layout)
   - Performance (will-change usage)
   - Effect Selection (purpose over decoration)

8. COLOR SYSTEM (7 sections):
   - PURPLE BAN (Critical Maestro rule - #8B5CF6, #A855F7, etc.)
   - 60-30-10 Rule (dominant, secondary, accent)
   - Color Scheme Patterns (monochromatic, analogous)
   - Dark Mode Compliance (no pure black/white)
   - WCAG Contrast (low-contrast detection)
   - Color Psychology Context (food + blue = bad)
   - HSL-Based Palettes (recommended approach)

9. ANIMATION GUIDE (6 sections):
   - Duration Appropriateness (50ms minimum, 1s max transitions)
   - Easing Functions (ease-out for entry, ease-in for exit)
   - Micro-interactions (hover/focus feedback)
   - Loading States (skeleton, spinner, progress)
   - Page Transitions (fade/slide for routing)
   - Scroll Animation Performance (no layout properties)

10. MOTION GRAPHICS (7 sections):
   - Lottie Animations (reduced motion fallbacks)
   - GSAP Memory Leaks (kill/revert on unmount)
   - SVG Animation Performance (stroke-dashoffset sparingly)
   - 3D Transforms (perspective parent, mobile warning)
   - Particle Effects (mobile fallback)
   - Scroll-Driven Animations (throttle with rAF)
   - Motion Decision Tree (functional vs decorative)

11. ACCESSIBILITY:
   - Alt text for images
   - Reduced motion checks
   - Form labels

Total: 80+ checks across all design principles
"""

import sys
import os
import re
import json
from pathlib import Path

class UXAuditor:
    def __init__(self):
        self.issues = []
        self.warnings = []
        self.passed_count = 0
        self.files_checked = 0
    
    def audit_file(self, filepath: str) -> None:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except: return
        
        self.files_checked += 1
        filename = os.path.basename(filepath)

        # Pre-calculate common flags
        has_long_text = bool(re.search(r'<p|<div.*class=.*text|article|<span.*text', content, re.IGNORECASE))
        has_form = bool(re.search(r'<form|<input|password|credit|card|payment', content, re.IGNORECASE))
        complex_elements = len(re.findall(r'<input|<select|<textarea|<option', content, re.IGNORECASE))

        # --- 1. PSYCHOLOGY LAWS ---
        # Hick's Law
        nav_items = len(re.findall(r'<NavLink|<Link|<a\s+href|nav-item', content, re.IGNORECASE))
        if nav_items > 7:
            self.issues.append(f"[Hick's Law] {filename}: {nav_items} nav items (Max 7)")
        
        # Fitts' Law
        if re.search(r'height:\s*([0-3]\d)px', content) or re.search(r'h-[1-9]\b|h-10\b', content):
            self.warnings.append(f"[Fitts' Law] {filename}: Small targets (< 44px)")
        
        # Miller's Law
        form_fields = len(re.findall(r'<input|<select|<textarea', content, re.IGNORECASE))
        if form_fields > 7 and not re.search(r'step|wizard|stage', content, re.IGNORECASE):
            self.warnings.append(f"[Miller's Law] {filename}: Complex form ({form_fields} fields)")
            
        # Von Restorff
        if 'button' in content.lower() and not re.search(r'primary|bg-primary|Button.*primary|variant=["\']primary', content, re.IGNORECASE):
            self.warnings.append(f"[Von Restorff] {filename}: No primary CTA")

        # Serial Position Effect - Important items at beginning/end
        if nav_items > 3:
            # Check if last nav item is important (contact, login, etc.)
            nav_content = re.findall(r'<NavLink|<Link|<a\s+href[^>]*>([^<]+)</a>', content, re.IGNORECASE)
            if nav_content and len(nav_content) > 2:
                last_item = nav_content[-1].lower() if nav_content else ''
                if not any(x in last_item for x in ['contact', 'login', 'sign', 'get started', 'cta', 'button']):
                    self.warnings.append(f"[Serial Position] {filename}: Last nav item may not be important. Place key actions at start/end.")

        # --- 1.5 EMOTIONAL DESIGN (Don Norman) ---

        # Visceral: First impressions (aesthetics, gradients, animations)
        has_hero = bool(re.search(r'hero|<h1|banner', content, re.IGNORECASE))
        if has_hero:
            # Check for visual appeal elements
            has_gradient = bool(re.search(r'gradient|linear-gradient|radial-gradient', content))
            has_animation = bool(re.search(r'@keyframes|transition:|animate-', content))
            has_visual_interest = has_gradient or has_animation

            if not has_visual_interest and not re.search(r'background:|bg-', content):
                self.warnings.append(f"[Visceral] {filename}: Hero section lacks visual appeal. Consider gradients or subtle animations.")

        # Behavioral: Instant feedback and usability
        if 'onClick' in content or '@click' in content or 'onclick' in content:
            has_feedback = re.search(r'transition|animate|hover:|focus:|disabled|loading|spinner', content, re.IGNORECASE)
            has_state_change = re.search(r'setState|useState|disabled|loading', content)

            if not has_feedback and not has_state_change:
                self.warnings.append(f"[Behavioral] {filename}: Interactive elements lack immediate feedback. Add hover/focus/disabled states.")

        # Reflective: Brand story, values, identity
        has_reflective = bool(re.search(r'about|story|mission|values|why we|our journey|testimonials', content, re.IGNORECASE))
        if has_long_text and not has_reflective:
            self.warnings.append(f"[Reflective] {filename}: Long-form content without brand story/values. Add 'About' or 'Why We Exist' section.")

        # --- 1.6 TRUST BUILDING (Enhanced) ---

        # Security signals
        if has_form:
            security_signals = re.findall(r'ssl|secure|encrypt|lock|padlock|https', content, re.IGNORECASE)
            if len(security_signals) == 0 and not re.search(r'checkout|payment', content, re.IGNORECASE):
                self.warnings.append(f"[Trust] {filename}: Form without security indicators. Add 'SSL Secure' or lock icon.")

        # Social proof elements
        social_proof = re.findall(r'review|testimonial|rating|star|trust|trusted by|customer|logo', content, re.IGNORECASE)
        if len(social_proof) > 0:
            self.passed_count += 1
        else:
            if has_long_text:
                self.warnings.append(f"[Trust] {filename}: No social proof detected. Consider adding testimonials, ratings, or 'Trusted by' logos.")

        # Authority indicators
        has_footer = bool(re.search(r'footer|<footer', content, re.IGNORECASE))
        if has_footer:
            authority = re.findall(r'certif|award|media|press|featured|as seen in', content, re.IGNORECASE)
            if len(authority) == 0:
                self.warnings.append(f"[Trust] {filename}: Footer lacks authority signals. Add certifications, awards, or media mentions.")

        # --- 1.7 COGNITIVE LOAD MANAGEMENT ---

        # Progressive disclosure
        if complex_elements > 5:
            has_progressive = re.search(r'step|wizard|stage|accordion|collapsible|tab|more\.\.\.|advanced|show more', content, re.IGNORECASE)
            if not has_progressive:
                self.warnings.append(f"[Cognitive Load] {filename}: Many form elements without progressive disclosure. Consider accordion, tabs, or 'Advanced' toggle.")

        # Visual noise check
        has_many_colors = len(re.findall(r'#[0-9a-fA-F]{3,6}|rgb|hsl', content)) > 15
        has_many_borders = len(re.findall(r'border:|border-', content)) > 10
        if has_many_colors and has_many_borders:
            self.warnings.append(f"[Cognitive Load] {filename}: High visual noise detected. Many colors and borders increase cognitive load.")

        # Familiar patterns
        if has_form:
            has_standard_labels = bool(re.search(r'<label|placeholder|aria-label', content, re.IGNORECASE))
            if not has_standard_labels:
                self.issues.append(f"[Cognitive Load] {filename}: Form inputs without labels. Use <label> for accessibility and clarity.")

        # --- 1.8 PERSUASIVE DESIGN (Ethical) ---

        # Smart defaults
        if has_form:
            has_defaults = bool(re.search(r'checked|selected|default|value=["\'].*["\']', content))
            radio_inputs = len(re.findall(r'type=["\']radio', content, re.IGNORECASE))
            if radio_inputs > 0 and not has_defaults:
                self.warnings.append(f"[Persuasion] {filename}: Radio buttons without default selection. Pre-select recommended option.")

        # Anchoring (showing original price)
        if re.search(r'price|pricing|cost|\$\d+', content, re.IGNORECASE):
            has_anchor = bool(re.search(r'original|was|strike|del|save \d+%', content, re.IGNORECASE))
            if not has_anchor:
                self.warnings.append(f"[Persuasion] {filename}: Prices without anchoring. Show original price to frame discount value.")

        # Social proof live indicators
        has_social = bool(re.search(r'join|subscriber|member|user', content, re.IGNORECASE))
        if has_social:
            has_count = bool(re.findall(r'\d+[+kmb]|\d+,\d+', content))
            if not has_count:
                self.warnings.append(f"[Persuasion] {filename}: Social proof without specific numbers. Use 'Join 10,000+' format.")

        # Progress indicators
        if has_form:
            has_progress = bool(re.search(r'progress|step \d+|complete|%|bar', content, re.IGNORECASE))
            if complex_elements > 5 and not has_progress:
                self.warnings.append(f"[Persuasion] {filename}: Long form without progress indicator. Add progress bar or 'Step X of Y'.")

        # --- 2. TYPOGRAPHY SYSTEM (Complete Coverage) ---

        # 2.1 Font Pairing - Too many font families
        font_families = set()
        # Check for @font-face, Google Fonts, font-family declarations
        font_faces = re.findall(r'@font-face\s*\{[^}]*family:\s*["\']?([^;"\'\s}]+)', content, re.IGNORECASE)
        google_fonts = re.findall(r'fonts\.googleapis\.com[^"\']*family=([^"&]+)', content, re.IGNORECASE)
        font_family_css = re.findall(r'font-family:\s*([^;]+)', content, re.IGNORECASE)

        for font in font_faces: font_families.add(font.strip().lower())
        for font in google_fonts:
            for f in font.replace('+', ' ').split('|'):
                font_families.add(f.split(':')[0].strip().lower())
        for family in font_family_css:
            # Extract first font from stack
            first_font = family.split(',')[0].strip().strip('"\'')

            if first_font.lower() not in {'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'inherit', 'arial', 'georgia', 'times new roman', 'courier new', 'verdana', 'helvetica', 'tahoma'}:
                font_families.add(first_font.lower())

        if len(font_families) > 3:
            self.issues.append(f"[Typography] {filename}: {len(font_families)} font families detected. Limit to 2-3 for cohesion.")

        # 2.2 Line Length - Character-based width
        if has_long_text and not re.search(r'max-w-(?:prose|[\[\\]?\d+ch[\]\\]?)|max-width:\s*\d+ch', content):
            self.warnings.append(f"[Typography] {filename}: No line length constraint (45-75ch). Use max-w-prose or max-w-[65ch].")

        # 2.3 Line Height - Proper leading ratios
        # Check for text without proper line-height
        text_elements = len(re.findall(r'<p|<span|<div.*text|<h[1-6]', content, re.IGNORECASE))
        if text_elements > 0 and not re.search(r'leading-|line-height:', content):
            self.warnings.append(f"[Typography] {filename}: Text elements found without line-height. Body: 1.4-1.6, Headings: 1.1-1.3")

        # Check for heading-specific line height issues
        if re.search(r'<h[1-6]|text-(?:xl|2xl|3xl|4xl|5xl|6xl)', content, re.IGNORECASE):
            # Extract line-height values
            line_heights = re.findall(r'(?:leading-|line-height:\s*)([\d.]+)', content)
            for lh in line_heights:
                if float(lh) > 1.5:
                    self.warnings.append(f"[Typography] {filename}: Heading has line-height {lh} (>1.3). Headings should be tighter (1.1-1.3).")

        # 2.4 Letter Spacing (Tracking)
        # Uppercase without tracking
        if re.search(r'uppercase|text-transform:\s*uppercase', content, re.IGNORECASE):
            if not re.search(r'tracking-|letter-spacing:', content):
                self.warnings.append(f"[Typography] {filename}: Uppercase text without tracking. ALL CAPS needs +5-10% spacing.")

        # Large text (display/hero) should have negative tracking
        if re.search(r'text-(?:4xl|5xl|6xl|7xl|8xl|9xl)|font-size:\s*[3-9]\dpx', content):
            if not re.search(r'tracking-tight|letter-spacing:\s*-[0-9]', content):
                self.warnings.append(f"[Typography] {filename}: Large display text without tracking-tight. Big text needs -1% to -4% spacing.")

        # 2.5 Weight and Emphasis - Contrast levels
        # Check for adjacent weight levels (poor contrast)
        weights = re.findall(r'font-weight:\s*(\d+)|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|fw-(\d+)', content, re.IGNORECASE)
        weight_values = []
        for w in weights:
            val = w[0] or w[1]
            if val:
                # Map named weights to numbers
                weight_map = {'thin': '100', 'extralight': '200', 'light': '300', 'normal': '400', 'medium': '500', 'semibold': '600', 'bold': '700', 'extrabold': '800', 'black': '900'}
                val = weight_map.get(val.lower(), val)
                try:
                    weight_values.append(int(val))
                except: pass

        # Check for adjacent weights (400/500, 500/600, etc.)
        for i in range(len(weight_values) - 1):
            diff = abs(weight_values[i] - weight_values[i+1])
            if diff == 100:
                self.warnings.append(f"[Typography] {filename}: Adjacent font weights ({weight_values[i]}/{weight_values[i+1]}). Skip at least 2 levels for contrast.")

        # Too many weight levels
        unique_weights = set(weight_values)
        if len(unique_weights) > 4:
            self.warnings.append(f"[Typography] {filename}: {len(unique_weights)} font weights. Limit to 3-4 per page.")

        # 2.6 Responsive Typography - Fluid sizing with clamp()
        has_font_sizes = bool(re.search(r'font-size:|text-(?:xs|sm|base|lg|xl|2xl)', content))
        if has_font_sizes and not re.search(r'clamp\(|responsive:', content):
            self.warnings.append(f"[Typography] {filename}: Fixed font sizes without clamp(). Consider fluid typography: clamp(MIN, PREFERRED, MAX)")

        # 2.7 Hierarchy - Heading structure
        headings = re.findall(r'<(h[1-6])', content, re.IGNORECASE)
        if headings:
            # Check for skipped levels (h1 -> h3)
            for i in range(len(headings) - 1):
                curr = int(headings[i][1])
                next_h = int(headings[i+1][1])
                if next_h > curr + 1:
                    self.warnings.append(f"[Typography] {filename}: Skipped heading level (h{curr} -> h{next_h}). Maintain sequential hierarchy.")

            # Check if h1 exists for main content
            if 'h1' not in [h.lower() for h in headings] and has_long_text:
                self.warnings.append(f"[Typography] {filename}: No h1 found. Each page should have one primary heading.")

        # 2.8 Modular Scale - Consistent sizing
        # Extract font-size values
        font_sizes = re.findall(r'font-size:\s*(\d+(?:\.\d+)?)(px|rem|em)', content)
        size_values = []
        for size, unit in font_sizes:
            if unit == 'rem' or unit == 'em':
                size_values.append(float(size))
            elif unit == 'px':
                size_values.append(float(size) / 16)  # Normalize to rem

        if len(size_values) > 2:
            # Check if sizes follow a modular scale roughly
            sorted_sizes = sorted(set(size_values))
            ratios = []
            for i in range(1, len(sorted_sizes)):
                if sorted_sizes[i-1] > 0:
                    ratios.append(sorted_sizes[i] / sorted_sizes[i-1])

            # Common scale ratios: 1.067, 1.125, 1.2, 1.25, 1.333, 1.5, 1.618
            common_ratios = {1.067, 1.125, 1.2, 1.25, 1.333, 1.5, 1.618}
            for ratio in ratios[:3]:  # Check first 3 ratios
                if not any(abs(ratio - cr) < 0.05 for cr in common_ratios):
                    self.warnings.append(f"[Typography] {filename}: Font sizes may not follow modular scale (ratio: {ratio:.2f}). Consider consistent ratio like 1.25 (Major Third).")
                    break

        # 2.9 Readability - Content chunking
        # Check for very long paragraphs (>5 lines estimated)
        paragraphs = re.findall(r'<p[^>]*>([^<]+)</p>', content, re.IGNORECASE)
        for p in paragraphs:
            word_count = len(p.split())
            if word_count > 100:  # ~5-6 lines
                self.warnings.append(f"[Typography] {filename}: Long paragraph detected ({word_count} words). Break into 3-4 line chunks for readability.")

        # Check for missing subheadings in long content
        if len(paragraphs) > 5:
            subheadings = len(re.findall(r'<h[2-6]', content, re.IGNORECASE))
            if subheadings == 0:
                self.warnings.append(f"[Typography] {filename}: Long content without subheadings. Add h2/h3 to break up text.")

        # --- 3. VISUAL EFFECTS (visual-effects.md) ---
        
        # Glassmorphism Check
        if 'backdrop-filter' in content or 'blur(' in content:
            if not re.search(r'background:\s*rgba|bg-opacity|bg-[a-z0-9]+\/\d+', content):
                self.warnings.append(f"[Visual] {filename}: Blur used without semi-transparent background (Glassmorphism fail)")
        
        # GPU Acceleration / Performance
        if re.search(r'@keyframes|transition:', content):
            expensive_props = re.findall(r'width|height|top|left|right|bottom|margin|padding', content)
            if expensive_props:
                self.warnings.append(f"[Performance] {filename}: Animating expensive properties ({', '.join(set(expensive_props))}). Use transform/opacity where possible.")
            
            # Reduced Motion
            if not re.search(r'prefers-reduced-motion', content):
                self.warnings.append(f"[Accessibility] {filename}: Animations found without prefers-reduced-motion check")

        # Natural Shadows
        shadows = re.findall(r'box-shadow:\s*([^;]+)', content)
        for shadow in shadows:
            # Check if natural (Y > X) or multiple layers
            if ',' not in shadow and not re.search(r'\d+px\s+[1-9]\d*px', shadow): # Simple heuristic for Y-offset
                 self.warnings.append(f"[Visual] {filename}: Simple/Unnatural shadow detected. Consider multiple layers or Y > X offset for realism.")

        # --- 3.1 NEOMORPHISM CHECK ---
        # Check for neomorphism patterns (dual shadows with opposite directions)
        neo_shadows = re.findall(r'box-shadow:\s*([^;]+)', content)
        for shadow in neo_shadows:
            # Neomorphism has two shadows: positive offset + negative offset
            if ',' in shadow and '-' in shadow:
                # Check for inset pattern (pressed state)
                if 'inset' in shadow:
                    self.warnings.append(f"[Visual] {filename}: Neomorphism inset detected. Ensure adequate contrast for accessibility.")

        # --- 3.2 SHADOW HIERARCHY ---
        # Count shadow levels to check for elevation consistency
        shadow_count = len(shadows)
        if shadow_count > 0:
            # Check for shadow opacity levels (should indicate hierarchy)
            opacities = re.findall(r'rgba?\([^)]+,\s*([\d.]+)\)', content)
            shadow_opacities = [float(o) for o in opacities if float(o) < 0.5]
            if shadow_count >= 3 and len(shadow_opacities) > 0:
                # Check if there's variety in shadow opacities for different elevations
                unique_opacities = len(set(shadow_opacities))
                if unique_opacities < 2:
                    self.warnings.append(f"[Visual] {filename}: All shadows at same opacity level. Vary shadow intensity for elevation hierarchy.")

        # --- 3.3 GRADIENT CHECKS ---
        # Check for gradient usage
        has_gradient = bool(re.search(r'gradient|linear-gradient|radial-gradient|conic-gradient', content))
        if has_gradient:
            # Warn about mesh/aurora gradients (can be overused)
            gradient_count = len(re.findall(r'gradient', content, re.IGNORECASE))
            if gradient_count > 5:
                self.warnings.append(f"[Visual] {filename}: Many gradients detected ({gradient_count}). Ensure this serves purpose, not decoration.")
        else:
            # Check if hero section exists without gradient
            if has_hero and not re.search(r'background:|bg-', content):
                self.warnings.append(f"[Visual] {filename}: Hero section without visual interest. Consider gradient for depth.")

        # --- 3.4 BORDER EFFECTS ---
        # Check for gradient borders or animated borders
        has_border = bool(re.search(r'border:|border-', content))
        if has_border:
            # Check for overly complex borders
            border_count = len(re.findall(r'border:', content))
            if border_count > 8:
                self.warnings.append(f"[Visual] {filename}: Many border declarations ({border_count}). Simplify for cleaner look.")

        # --- 3.5 GLOW EFFECTS ---
        # Check for text-shadow or multiple box-shadow layers (glow effects)
        text_shadows = re.findall(r'text-shadow:', content)
        for ts in text_shadows:
            # Multiple text-shadow layers indicate glow
            if ',' in ts:
                self.warnings.append(f"[Visual] {filename}: Text glow effect detected. Ensure readability is maintained.")

        # Check for box-shadow glow (multiple layers with 0 offset)
        glow_shadows = re.findall(r'box-shadow:\s*[^;]*0\s+0\s+', content)
        if len(glow_shadows) > 2:
            self.warnings.append(f"[Visual] {filename}: Multiple glow effects detected. Use sparingly for emphasis only.")

        # --- 3.6 OVERLAY TECHNIQUES ---
        # Check for image overlays (for readability)
        has_images = bool(re.search(r'<img|background-image:|bg-\[url', content))
        if has_images and has_long_text:
            has_overlay = bool(re.search(r'overlay|rgba\(0|gradient.*transparent|::after|::before', content))
            if not has_overlay:
                self.warnings.append(f"[Visual] {filename}: Text over image without overlay. Add gradient overlay for readability.")

        # --- 3.7 PERFORMANCE: will-change ---
        # Check for will-change usage
        if re.search(r'will-change:', content):
            will_change_props = re.findall(r'will-change:\s*([^;]+)', content)
            for prop in will_change_props:
                prop = prop.strip().lower()
                if prop in ['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding']:
                    self.issues.append(f"[Performance] {filename}: will-change on '{prop}' (layout property). Use only for transform/opacity.")

        # Check for excessive will-change usage
        will_change_count = len(re.findall(r'will-change:', content))
        if will_change_count > 3:
            self.warnings.append(f"[Performance] {filename}: Many will-change declarations ({will_change_count}). Use sparingly, only for heavy animations.")

        # --- 3.8 EFFECT SELECTION ---
        # Check for effect overuse (too many visual effects)
        effect_count = (
            (1 if has_gradient else 0) +
            shadow_count +
            len(re.findall(r'backdrop-filter|blur\(', content)) +
            len(re.findall(r'text-shadow:', content))
        )
        if effect_count > 10:
            self.warnings.append(f"[Visual] {filename}: Many visual effects ({effect_count}). Ensure effects serve purpose, not decoration.")

        # Check for static/flat design (no depth)
        if has_long_text and effect_count == 0:
            self.warnings.append(f"[Visual] {filename}: Flat design with no depth. Consider shadows or subtle gradients for hierarchy.")

        # --- 4. COLOR SYSTEM (color-system.md) ---

        # 4.1 PURPLE BAN - Critical check from color-system.md
        purple_hexes = ['#8B5CF6', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9',
                        '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE',
                        '#8b5cf6', '#a855f7', '#9333ea', '#7c3aed', '#6d28d9',
                        'purple', 'violet', 'fuchsia', 'magenta', 'lavender']
        for purple in purple_hexes:
            if purple.lower() in content.lower():
                self.issues.append(f"[Color] {filename}: PURPLE DETECTED ('{purple}'). Banned by Maestro rules. Use Teal/Cyan/Emerald instead.")
                break

        # 4.2 60-30-10 Rule check
        # Count color usage to estimate ratio
        color_hex_count = len(re.findall(r'#[0-9a-fA-F]{3,6}', content))
        hsl_count = len(re.findall(r'hsl\(', content))
        total_colors = color_hex_count + hsl_count
        if total_colors > 3:
            # Check for dominant colors (should be ~60%)
            bg_declarations = re.findall(r'(?:background|bg-|bg\[)([^;}\s]+)', content)
            text_declarations = re.findall(r'(?:color|text-)([^;}\s]+)', content)
            if len(bg_declarations) > 0 and len(text_declarations) > 0:
                # Just warn if too many distinct colors
                unique_hexes = set(re.findall(r'#[0-9a-fA-F]{6}', content))
                if len(unique_hexes) > 5:
                    self.warnings.append(f"[Color] {filename}: {len(unique_hexes)} distinct colors. Consider 60-30-10 rule: dominant (60%), secondary (30%), accent (10%).")

        # 4.3 Color Scheme Pattern Detection
        # Detect monochromatic (same hue, different lightness)
        hsl_matches = re.findall(r'hsl\((\d+),\s*\d+%,\s*\d+%\)', content)
        if len(hsl_matches) >= 3:
            hues = [int(h) for h in hsl_matches]
            hue_range = max(hues) - min(hues)
            if hue_range < 10:
                self.warnings.append(f"[Color] {filename}: Monochromatic palette detected (hue variance: {hue_range}deg). Ensure adequate contrast.")

        # 4.4 Dark Mode Compliance
        # Check for pure black (#000000) or pure white (#FFFFFF) text (forbidden)
        if re.search(r'color:\s*#000000|#000\b', content):
            self.warnings.append(f"[Color] {filename}: Pure black (#000000) detected. Use #1a1a1a or darker grays for better dark mode.")
        if re.search(r'background:\s*#ffffff|#fff\b', content) and re.search(r'dark:\s*|dark:', content):
            self.warnings.append(f"[Color] {filename}: Pure white background in dark mode context. Use slight off-white (#f9fafb) for reduced eye strain.")

        # 4.5 WCAG Contrast Pattern Check
        # Look for potential low-contrast combinations
        light_bg_light_text = bool(re.search(r'bg-(?:gray|slate|zinc)-50|bg-white.*text-(?:gray|slate)-[12]', content))
        dark_bg_dark_text = bool(re.search(r'bg-(?:gray|slate|zinct)-9|bg-black.*text-(?:gray|slate)-[89]', content))
        if light_bg_light_text or dark_bg_dark_text:
            self.warnings.append(f"[Color] {filename}: Possible low-contrast combination detected. Verify WCAG AA (4.5:1 for text).")

        # 4.6 Color Psychology Context Check
        # Warn if blue used for food/restaurant context
        has_blue = bool(re.search(r'bg-blue|text-blue|from-blue|#[0-9a-fA-F]*00[0-9A-Fa-f]{2}|#[0-9a-fA-F]*1[0-9A-Fa-f]{2}', content))
        has_food_context = bool(re.search(r'restaurant|food|cooking|recipe|menu|dish|meal', content, re.IGNORECASE))
        if has_blue and has_food_context:
            self.warnings.append(f"[Color] {filename}: Blue color in food context. Blue suppresses appetite; consider warm colors (red, orange, yellow).")

        # 4.7 HSL-Based Palette Detection
        # Check if using HSL for palette (recommended in color-system.md)
        has_color_vars = bool(re.search(r'--color-|color-|primary-|secondary-', content))
        if has_color_vars and not re.search(r'hsl\(', content):
            self.warnings.append(f"[Color] {filename}: Color variables without HSL. Consider HSL for easier palette adjustment (Hue, Saturation, Lightness).")

        # --- 5. ANIMATION GUIDE (animation-guide.md) ---

        # 5.1 Duration Appropriateness
        # Check for excessively long or short animations
        durations = re.findall(r'(?:duration|animation-duration|transition-duration):\s*([\d.]+)(s|ms)', content)
        for duration, unit in durations:
            duration_ms = float(duration) * (1000 if unit == 's' else 1)
            if duration_ms < 50:
                self.warnings.append(f"[Animation] {filename}: Very fast animation ({duration}{unit}). Minimum 50ms for visibility.")
            elif duration_ms > 1000 and 'transition' in content.lower():
                self.warnings.append(f"[Animation] {filename}: Long transition ({duration}{unit}). Transitions should be 100-300ms for responsiveness.")

        # 5.2 Easing Function Correctness
        # Check for incorrect easing patterns
        if re.search(r'ease-in\s+.*entry|fade-in.*ease-in', content):
            self.warnings.append(f"[Animation] {filename}: Entry animation with ease-in. Entry should use ease-out for snappy feel.")
        if re.search(r'ease-out\s+.*exit|fade-out.*ease-out', content):
            self.warnings.append(f"[Animation] {filename}: Exit animation with ease-out. Exit should use ease-in for natural feel.")

        # 5.3 Micro-interaction Feedback Patterns
        # Check for interactive elements without hover/focus states
        interactive_elements = len(re.findall(r'<button|<a\s+href|onClick|@click', content))
        has_hover_focus = bool(re.search(r'hover:|focus:|:hover|:focus', content))
        if interactive_elements > 2 and not has_hover_focus:
            self.warnings.append(f"[Animation] {filename}: Interactive elements without hover/focus states. Add micro-interactions for feedback.")

        # 5.4 Loading State Indicators
        # Check for loading patterns
        has_async = bool(re.search(r'async|await|fetch|axios|loading|isLoading', content))
        has_loading_indicator = bool(re.search(r'skeleton|spinner|progress|loading|<circle.*animate', content))
        if has_async and not has_loading_indicator:
            self.warnings.append(f"[Animation] {filename}: Async operations without loading indicator. Add skeleton or spinner for perceived performance.")

        # 5.5 Page Transition Patterns
        # Check for page/view transitions
        has_routing = bool(re.search(r'router|navigate|Link.*to|useHistory', content))
        has_page_transition = bool(re.search(r'AnimatePresence|motion\.|transition.*page|fade.*route', content))
        if has_routing and not has_page_transition:
            self.warnings.append(f"[Animation] {filename}: Routing detected without page transitions. Consider fade/slide for context continuity.")

        # 5.6 Scroll Animation Performance
        # Check for scroll-driven animations
        has_scroll_anim = bool(re.search(r'onScroll|scroll.*trigger|IntersectionObserver', content))
        if has_scroll_anim:
            # Check if using expensive properties in scroll handlers
            if re.search(r'onScroll.*[^\w](width|height|top|left)', content):
                self.issues.append(f"[Animation] {filename}: Scroll handler animating layout properties. Use transform/opacity for 60fps.")

        # --- 6. MOTION GRAPHICS (motion-graphics.md) ---

        # 6.1 Lottie Animation Checks
        has_lottie = bool(re.search(r'lottie|Lottie|@lottie-react', content))
        if has_lottie:
            # Check for reduced motion fallback
            has_lottie_fallback = bool(re.search(r'prefers-reduced-motion.*lottie|lottie.*isPaused|lottie.*stop', content))
            if not has_lottie_fallback:
                self.warnings.append(f"[Motion] {filename}: Lottie animation without reduced-motion fallback. Add pause/stop for accessibility.")

        # 6.2 GSAP Memory Leak Risks
        has_gsap = bool(re.search(r'gsap|ScrollTrigger|from\(.*gsap', content))
        if has_gsap:
            # Check for cleanup patterns
            has_gsap_cleanup = bool(re.search(r'kill\(|revert\(|useEffect.*return.*gsap', content))
            if not has_gsap_cleanup:
                self.issues.append(f"[Motion] {filename}: GSAP animation without cleanup (kill/revert). Memory leak risk on unmount.")

        # 6.3 SVG Animation Performance
        svg_animations = re.findall(r'<animate|<animateTransform|stroke-dasharray|stroke-dashoffset', content)
        if len(svg_animations) > 3:
            self.warnings.append(f"[Motion] {filename}: Multiple SVG animations detected. Ensure stroke-dashoffset is used sparingly for mobile performance.")

        # 6.4 3D Transform Performance
        has_3d_transform = bool(re.search(r'transform3d|perspective\(|rotate3d|translate3d', content))
        if has_3d_transform:
            # Check for perspective on parent
            has_perspective_parent = bool(re.search(r'perspective:\s*\d+px|perspective\s*\(', content))
            if not has_perspective_parent:
                self.warnings.append(f"[Motion] {filename}: 3D transform without perspective parent. Add perspective: 1000px for realistic depth.")

            # Warn about mobile performance
            self.warnings.append(f"[Motion] {filename}: 3D transforms detected. Test on mobile; can impact performance on low-end devices.")

        # 6.5 Particle Effect Warnings
        # Check for canvas/WebGL particle systems
        has_particles = bool(re.search(r'particle|canvas.*loop|requestAnimationFrame.*draw|Three\.js', content))
        if has_particles:
            self.warnings.append(f"[Motion] {filename}: Particle effects detected. Ensure fallback or reduced-quality option for mobile devices.")

        # 6.6 Scroll-Driven Animation Performance
        has_scroll_driven = bool(re.search(r'IntersectionObserver.*animate|scroll.*progress|view-timeline', content))
        if has_scroll_driven:
            # Check for throttling/debouncing
            has_throttle = bool(re.search(r'throttle|debounce|requestAnimationFrame', content))
            if not has_throttle:
                self.issues.append(f"[Motion] {filename}: Scroll-driven animation without throttling. Add requestAnimationFrame for 60fps.")

        # 6.7 Motion Decision Tree - Context Check
        # Check if animation serves purpose (not just decoration)
        total_animations = (
            len(re.findall(r'@keyframes|transition:|animate-', content)) +
            (1 if has_lottie else 0) +
            (1 if has_gsap else 0)
        )
        if total_animations > 5:
            # Check if animations are functional
            functional_animations = len(re.findall(r'hover:|focus:|disabled|loading|error|success', content))
            if functional_animations < total_animations / 2:
                self.warnings.append(f"[Motion] {filename}: Many animations ({total_animations}). Ensure majority serve functional purpose (feedback, guidance), not decoration.")

        # --- 7. ACCESSIBILITY ---
        if re.search(r'<img(?![^>]*alt=)[^>]*>', content):
            self.issues.append(f"[Accessibility] {filename}: Missing img alt text")

    def audit_directory(self, directory: str) -> None:
        extensions = {'.tsx', '.jsx', '.html', '.vue', '.svelte', '.css'}
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', 'dist', 'build', '.next'}]
            for file in files:
                if Path(file).suffix in extensions:
                    self.audit_file(os.path.join(root, file))

    def get_report(self):
        return {
            "files_checked": self.files_checked,
            "issues": self.issues,
            "warnings": self.warnings,
            "passed_checks": self.passed_count,
            "compliant": len(self.issues) == 0
        }

def main():
    if len(sys.argv) < 2: sys.exit(1)
    
    path = sys.argv[1]
    is_json = "--json" in sys.argv
    
    auditor = UXAuditor()
    if os.path.isfile(path): auditor.audit_file(path)
    else: auditor.audit_directory(path)
    
    report = auditor.get_report()
    
    if is_json:
        print(json.dumps(report))
    else:
        # Use ASCII-safe output for Windows console compatibility
        print(f"\n[UX AUDIT] {report['files_checked']} files checked")
        print("-" * 50)
        if report['issues']:
            print(f"[!] ISSUES ({len(report['issues'])}):")
            for i in report['issues'][:10]: print(f"  - {i}")
        if report['warnings']:
            print(f"[*] WARNINGS ({len(report['warnings'])}):")
            for w in report['warnings'][:15]: print(f"  - {w}")
        print(f"[+] PASSED CHECKS: {report['passed_checks']}")
        status = "PASS" if report['compliant'] else "FAIL"
        print(f"STATUS: {status}")

    sys.exit(0 if report['compliant'] else 1)

if __name__ == "__main__":
    main()
