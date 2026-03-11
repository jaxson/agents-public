# ALT Text Generator — Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates accessible ALT text for images, optimized for social media sharing.

## Why This Exists

Millions of images are shared on social media every day without ALT text, making them invisible to people who use screen readers. Writing good ALT text takes effort — this skill aims to lower that barrier by generating high-quality, platform-aware descriptions that follow accessibility best practices.

**We want your feedback.** This is an early version and we're actively looking for input from accessibility experts, screen reader users, and anyone who depends on ALT text. See [How to Give Feedback](#how-to-give-feedback) below.

## How It Works

This is a **Claude Code skill** — a reusable prompt template that runs inside [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (Anthropic's CLI tool for Claude). When activated, Claude analyzes the image and generates ALT text following a set of rules covering:

- Platform-specific character limits (125 default, 1000 for LinkedIn/Twitter/Instagram/Facebook)
- Describing people, actions, visible text, logos, colors, and spatial layout
- Avoiding editorializing, jargon, and decorative filler
- Special handling for screenshots, charts, and text-heavy images

It generates **two options** (short and detailed) so the user can pick the best fit.

## Installation

1. Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) if you haven't already
2. Create the skill directory:
   ```bash
   mkdir -p ~/.claude/skills/alt
   ```
3. Copy the skill file:
   ```bash
   cp SKILL.md ~/.claude/skills/alt/SKILL.md
   ```

## Usage

Inside Claude Code:

```
/alt path/to/image.png linkedin
/alt photo.jpg twitter "Panel on AI governance at Munk School"
/alt screenshot.png               # will ask for platform
```

**Arguments:**
- `image_path` (required) — path to the image file
- `platform` (optional) — `twitter`/`x`, `linkedin`, `instagram`, `facebook`, or `default` (125 chars)
- `"context"` (optional) — quoted string with names, event details, or other context to make the description more accurate

## Test Cases & Examples

Below are example outputs across different image types. These are meant for review — **we want to know if these descriptions are useful, accurate, and well-structured for screen reader users.**

---

### Test Case 1: Panel Discussion (Photo with Multiple People)

**Image description (for sighted reviewers):** Four people seated in leather chairs on a stage. One person is speaking into a microphone. A purple banner behind them reads "The Canadian Internet Society — The Internet is for everyone."

**Platform:** LinkedIn (1000 chars)

**Option A (short):**
> Four panelists seated in leather wingback chairs at a Canadian Internet Society event. A man in a dark suit speaks into a microphone while three fellow panelists listen. A purple banner behind them reads "The Canadian Internet Society — The Internet is for everyone."

**Option B (detailed):**
> Four panelists seated in brown leather wingback chairs during a Canadian Internet Society panel discussion. From left: a man in glasses and a dark blazer holding a tablet, a man in a dark suit speaking into a handheld microphone and gesturing with his left hand, a woman in a bright yellow blazer and black trousers holding a microphone in her lap, and a man in a navy blazer with glasses seated at the far right. Behind them, a purple pull-up banner displays the Canadian Internet Society logo and the tagline "The Internet is for everyone." The setting is a formal event space with beige floor-length curtains.

**Review questions:**
- Is left-to-right ordering helpful, or does it add unnecessary complexity?
- Is the level of clothing detail useful or distracting?
- Should the banner text be placed earlier in the description since it identifies the event?

---

### Test Case 2: Screenshot of a Tweet

**Image description (for sighted reviewers):** A screenshot of a tweet from @exampleuser that reads: "Just published our report on AI governance in Canada. Key finding: 73% of organizations have no AI oversight framework. Full report link in bio."

**Platform:** Twitter/X (1000 chars)

**Option A (short):**
> Screenshot of a tweet from @exampleuser: "Just published our report on AI governance in Canada. Key finding: 73% of organizations have no AI oversight framework. Full report link in bio."

**Option B (detailed):**
> Screenshot of a tweet from @exampleuser reading: "Just published our report on AI governance in Canada. Key finding: 73% of organizations have no AI oversight framework. Full report link in bio." The tweet shows 42 retweets and 156 likes.

**Review questions:**
- For text screenshots, is verbatim transcription the right approach?
- Are engagement metrics (retweets, likes) useful context or noise?
- Should the platform (Twitter/X) be named in the ALT text, or is that redundant when posting on the same platform?

---

### Test Case 3: Bar Chart / Data Visualization

**Image description (for sighted reviewers):** A horizontal bar chart titled "AI Readiness Index by Country, 2025." The US leads at 82, followed by UK at 74, Canada at 71, Germany at 68, and France at 63. Source line reads "OECD Digital Economy Outlook 2025."

**Platform:** LinkedIn (1000 chars)

**Option A (short):**
> Bar chart showing AI Readiness Index by country in 2025. The US leads at 82, followed by the UK at 74, Canada at 71, Germany at 68, and France at 63. Source: OECD Digital Economy Outlook 2025.

**Option B (detailed):**
> Horizontal bar chart titled "AI Readiness Index by Country, 2025" with five countries ranked. The United States leads with a score of 82, followed by the United Kingdom at 74, Canada at 71, Germany at 68, and France at 63. The bars are shaded in blue gradient from darkest (highest score) to lightest. Source cited as OECD Digital Economy Outlook 2025.

**Review questions:**
- Is stating the exact numbers more useful than describing the visual trend?
- Should the chart type (horizontal bar) be mentioned, or just the data?
- Is the color description ("blue gradient") useful for understanding the data?

---

### Test Case 4: Professional Headshot

**Image description (for sighted reviewers):** A woman in a navy blazer smiling at the camera against a plain grey background. Professional studio lighting.

**Platform:** Default (125 chars)

**Option A:**
> Woman in a navy blazer smiling against a grey background, professional headshot lighting

**Review questions:**
- For headshots, is this level of detail sufficient?
- Should skin tone or hair be described? (Opinions vary in the accessibility community)
- Is "professional headshot lighting" useful or unnecessary?

---

### Test Case 5: Infographic with Mixed Content

**Image description (for sighted reviewers):** An infographic titled "5 Steps to Responsible AI." It lists: 1. Define principles, 2. Assess risks, 3. Build diverse teams, 4. Test for bias, 5. Monitor continuously. Each step has a small icon. The footer shows a company logo and URL.

**Platform:** Instagram (1000 chars)

**Option A (short):**
> Infographic titled "5 Steps to Responsible AI" listing: 1. Define principles, 2. Assess risks, 3. Build diverse teams, 4. Test for bias, 5. Monitor continuously.

**Option B (detailed):**
> Infographic titled "5 Steps to Responsible AI" with five numbered steps, each accompanied by a small icon. The steps are: 1. Define principles, 2. Assess risks, 3. Build diverse teams, 4. Test for bias, 5. Monitor continuously. The design uses a clean white background with blue and teal accent colors. The footer includes a company logo and website URL.

**Review questions:**
- For infographics, is transcribing all text the priority?
- Are icon descriptions useful, or is naming the step sufficient?
- Should the URL in the footer be included verbatim?

---

### Test Case 6: Outdoor Event / Group Photo

**Image description (for sighted reviewers):** A group of approximately 20 people standing on the steps of a university building, holding a banner that reads "AI Policy Lab Launch 2025." It's a sunny day, trees visible in the background.

**Platform:** Twitter/X (1000 chars)

**Option A (short):**
> Group of approximately 20 people on university building steps holding a banner reading "AI Policy Lab Launch 2025" on a sunny day.

**Option B (detailed):**
> Group of approximately 20 people standing on the stone steps of a university building, holding a wide white banner that reads "AI Policy Lab Launch 2025." The group is dressed in a mix of business casual and academic attire. It's a bright sunny day with green trees visible behind the building. The atmosphere is celebratory, with several people smiling broadly.

**Review questions:**
- Is approximate headcount useful, or should it say "a large group"?
- Is weather/lighting ("sunny day") helpful context or filler?
- How specific should building descriptions be without identifying the institution?

---

## Design Decisions We'd Like Feedback On

1. **Two options (short vs. detailed):** Is this useful, or would a single well-calibrated description be better?
2. **Left-to-right spatial ordering:** Helpful for understanding layout, or confusing without visual reference?
3. **Color descriptions:** When are colors useful vs. noise?
4. **Visible text transcription:** Should it always be verbatim, or summarized when long?
5. **Tone:** Should social media ALT text be more conversational than traditional web ALT text?
6. **Identity and appearance:** What's the right balance for describing people without making assumptions?

## How to Give Feedback

We'd love to hear from you, especially if you use a screen reader or work in accessibility:

- **Open an issue** on this repo with your feedback on any test case or design decision
- **Suggest edits** to `SKILL.md` via pull request
- **Share your own test cases** — images where ALT text is commonly done poorly

## License

MIT — use, modify, and share freely.
