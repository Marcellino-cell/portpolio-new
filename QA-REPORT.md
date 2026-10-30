# QA Report — Marcellino Portfolio V8

## Automated checks completed
- `node --check` passed for `script.js`, `projects-data.js`, and `project-detail.js`.
- `tinycss2` parsed `style.css` with zero CSS parse errors.
- Checked `index.html` and `project-detail.html` for duplicate IDs and broken in-page `href="#..."` anchors; none were found.
- Verified the HTML requests local CSS/JavaScript with cache-busting `v=8`.
- Verified the new orbit keyframes, explicit `animation-play-state: running`, glowing satellite styles, and reduced-motion override are present.

## Orbit fix details
- The final CSS rules use `.hero-photo .circle-ring`, `.square-ring`, `.diamond-ring`, `.orbit-satellite`, and `.icon-orbit` with a centred absolute box and `transform-origin: 50% 50%`.
- Dedicated V8 keyframes rotate each track without moving its center.
- Three satellite dots orbit at distinct speeds and directions; the icon badges orbit while counter-rotating to remain upright.
- The earlier end-of-file reduced-motion rule that set every orbit to `animation: none` was removed. Under `prefers-reduced-motion: reduce`, decorative float/glow effects stop and orbit tracks continue more slowly.

## Not verified
- Full browser visual/interaction testing was not successfully completed in this environment.
- Personal image folders (`foto/`, `project/`, `sertifikat/`) and the user's live external project URLs were not uploaded, so these depend on the user's existing website assets and configuration.
