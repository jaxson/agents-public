# /alt — Image ALT Text Generator

Generate concise, accessible ALT text for images, optimized for social media sharing.

## Usage
```
/alt <image_path> [platform] ["optional context"]
```

**Examples:**
- `/alt photo.png linkedin`
- `/alt panel.jpg twitter "Munk School AI governance panel"`
- `/alt screenshot.png` (will ask for platform)

**Platform options:** `twitter` / `x`, `linkedin`, `instagram`, `facebook`, `default`
- If no platform specified, ask the user which platform.

## Platform Character Limits

| Platform | Max chars | Style |
|----------|-----------|-------|
| Twitter/X | 1000 | Concise but descriptive |
| LinkedIn | 1000 | Detailed, professional tone |
| Instagram | 1000 | Vivid, descriptive |
| Facebook | 1000 | Conversational, descriptive |
| Default | 125 | Ultra-concise (screen reader safe) |

## Instructions

1. Read the image file at the provided path using the `Read` tool.
2. Determine the platform from the user's input (or ask if not specified).
3. If the user provided context (names, event, etc.), use it to make the ALT text more specific and accurate.
4. Generate **2 ALT text options** — one shorter, one using more of the character budget. Let the user pick or remix.
5. Follow the rules below.

---

## ALT Text Rules

### Structure
- **Lead with the most important element** — what would someone need to know if they couldn't see this?
- **Skip "image of" or "photo of"** — screen readers already announce it as an image
- **Left-to-right, foreground-to-background** — describe spatial layout in a natural reading order when relevant

### People
- **Use names when provided by the user** — always prefer "Jaxson Khan speaking" over "a man speaking"
- **Never guess identity** — if no names are provided, describe by appearance/role ("panelist in yellow blazer")
- **Describe actions, clothing, expressions** — "speaking into a microphone" not just "on stage"
- **Number of people** — mention how many are in the frame

### Text, Logos & Branding
- **Transcribe visible text** — signs, banners, slides, captions. This is high-value information.
- **Name recognizable logos and brands** — "Canadian Internet Society logo" not "globe icon on a purple banner"
- **For screenshots of text** (tweets, headlines, quotes, articles): prioritize transcribing the text content accurately. The text IS the image.

### Visual Details
- **Colors** — include when meaningful or distinctive ("bright yellow blazer", "red warning banner"). Skip when purely decorative.
- **Setting/context** — where is this? (stage, conference room, outdoor park, office)
- **Mood/tone** — when relevant (formal panel discussion, casual team photo, celebratory moment)

### What to Avoid
- **Don't editorialize** — describe, don't interpret. "Smiling" is fine, "excited about the announcement" is assumption.
- **Don't over-describe decorative elements** — skip generic curtains, table settings, etc. unless they set important context.
- **Don't use jargon** — keep language plain and accessible.
- **Don't list exhaustively** — pick the details that matter most within the character limit.

### Charts & Graphs
State the key takeaway or trend, not a description of the chart type. Include specific numbers if legible.

### Longer Limits (1000 chars)
Use the space to paint a fuller picture — positioning, clothing, setting, expressions, background, visible text. Every detail should help someone visualize the scene. Don't pad with filler.

---

## Output Format

```
Option A (short):
ALT: <text>
[X chars]

Option B (detailed):
ALT: <text>
[X chars]
```

Show platform name and char limit for reference.
