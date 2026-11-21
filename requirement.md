Please read this in your first generation. This is your first task that will do to build the base of the website.
Act as a senior Next.js developer, Three.js specialist, architectural visualizer, and UX designer. Build a complete, Vercel-ready interactive 3D presentation website for “The Jin Little Paws Co.”

The attached floor-plan image is the primary and only layout reference. I do not have an existing 3D model, dimensions, elevations, or interior photographs. Study the image carefully and procedurally reconstruct the shop in 3D.

Do not ask additional questions. Use the requirements and defaults below.

OBJECTIVE
Create a single-page, highly polished 3D viewer that presents the pet shop layout to lecturers and students. It should feel impressive and presentation-ready. This is not a booking, e-commerce, or general business website.

LAYOUT ACCURACY
- Follow the attached plan as closely as possible.
- Preserve the relative dimensions, positions, circulation paths, doors, walls, counters, furniture, and equipment shown.
- Estimate the total width and length from the plan’s proportions.
- Use a floor-to-ceiling height of approximately 4 metres.
- Create only one floor.
- Keep the roof hidden by default for a dollhouse-style view.
- Add an optional ceiling/roof visibility toggle.
- Do not redesign or relocate rooms merely for visual convenience.

Reconstruct the visible areas, including:
- Entrance/exit
- Retail product zone
- Pet-food and treat shelving
- Special-offer displays
- DIY enrichment area
- Service and grooming zone
- Grooming check-in
- Service check-in
- Central service counter
- Waiting area
- Grooming Room 1
- Grooming Room 2
- Staff breakroom
- Staff WC
- Secure cat-hotel entrance
- Storage
- Cat-hotel boarding room
- Cat enrichment area
- Food preparation and cleaning area

VISUAL DIRECTION
The shop’s personality should be premium, playful, welcoming, hygienic, modern, and pet-friendly.

Use:
- Warm cream and off-white surfaces
- Soft sage-green accents
- Muted terracotta details
- Natural light and medium-tone wood
- Small amounts of brushed metal
- Rounded furniture and interface elements
- Subtle paw-inspired details without becoming childish
- “The Jin Little Paws Co.” signage at the entrance
- A simple text-based logo with a restrained paw symbol

Aim for a realistic architectural-visualization appearance rather than a cartoon style. Use physically based materials, realistic lighting, soft shadows, reflections, ambient occlusion, and subtle post-processing. Avoid excessive bloom, visual clutter, oversaturated colours, or distracting effects.

Populate shelves with varied generic pet-product packaging. Do not use real trademarks. Model the important grooming, retail, waiting, food-preparation, boarding, and enrichment equipment. Add a small number of animated cats, but no human characters.

3D VIEWING MODES
Provide two modes:

1. Dollhouse/orbit mode
- Rotate, pan, and zoom
- Smooth camera movement
- Roof removed by default
- Automatic fading or hiding of walls obstructing the selected room
- Reset-view control
- Fullscreen control

2. First-person walkthrough
- WASD and arrow-key movement
- Mouse-look
- Mobile touch joystick and swipe-look
- Collision detection for walls, furniture, counters, and fixtures
- Prevent the visitor from leaving the building
- Clearly visible button for returning to dollhouse mode

INTERACTION
- Make every major room clickable.
- Hovering should subtly highlight the room.
- Clicking a room should smoothly move the camera to it.
- Open a polished information panel containing:
  - Room name
  - Short generated description
  - Purpose and relevant service information
  - A dynamically rendered room-view thumbnail or appropriate visual placeholder
- Do not include prices or booking buttons.
- Add floating room labels that intelligently scale and avoid excessive overlap.
- Provide a searchable room-selection menu.
- Allow individual rooms to be shown, hidden, isolated, or restored.

LAYER CONTROLS
Add clear toggles for:
- Exterior and interior walls
- Roof/ceiling
- Furniture and fixtures
- Room labels
- Coloured room zones
- Cats and animations
- Individual rooms

GUIDED TOUR
Create an optional guided camera tour with previous, next, pause, replay, and exit controls.

Recommended sequence:
1. Entrance
2. Retail product zone
3. Central service counter
4. Waiting area
5. Grooming rooms
6. Cat-hotel boarding room
7. Cat enrichment area
8. Food-preparation and cleaning area

Each stop should use a smooth camera transition and display a short explanation.

ANIMATION AND CUSTOMIZATION
Include restrained animations such as:
- Cats walking, sitting, or moving their tails
- Doors opening when approached
- Subtle screen-display animation
- Small equipment or environmental movements

Do not add sound.

Add limited customization controls:
- Two or three curated wall/floor/furniture material presets
- Lighting intensity control
- Day and evening lighting modes
- A reset-design button

UI AND RESPONSIVENESS
- One full-screen viewer page only
- No traditional multi-page navigation
- Display the company name unobtrusively
- Use a clean English interface
- No dark-mode requirement
- Controls must be understandable to first-time users
- Display a short first-launch control tutorial
- Add a loading screen with real progress feedback
- Support Chromium browsers on desktop, tablet, and phone
- Respect touch-safe sizing and mobile safe areas
- Collapse secondary controls into drawers on small screens
- Ensure keyboard accessibility, visible focus states, ARIA labels, and reduced-motion support

TECHNOLOGY
Use:
- Current stable Next.js with App Router
- TypeScript
- React Three Fiber
- Three.js
- @react-three/drei
- @react-three/postprocessing
- A suitable lightweight collision solution such as @react-three/rapier
- CSS Modules or another simple local styling approach

The Three.js canvas must load client-side without SSR errors. Keep the application compatible with Vercel’s standard deployment environment.

ASSET REQUIREMENTS
- Build the architecture, furniture, shelving, products, signs, and simple cats procedurally with reusable React Three Fiber components.
- Use runtime-generated local textures where practical.
- Do not depend on remote image, texture, or 3D-model URLs.
- Keep all necessary assets within the project.
- Avoid copyrighted branding and unlicensed assets.

PERFORMANCE
- Use instancing for shelves, products, boarding units, and repeated furniture.
- Reuse geometry and materials.
- Apply sensible shadow settings.
- Use adaptive device-pixel ratio and quality levels.
- Reduce post-processing, shadow quality, and animation complexity on weaker mobile devices.
- Pause nonessential animation when the page is hidden.
- Properly dispose of Three.js resources.
- Show a friendly fallback if WebGL is unavailable.
- Target smooth interaction rather than maximum geometric complexity.

DELIVERABLE
Generate the complete working project—not pseudocode.

First:
1. Briefly explain how you interpreted the attached plan.
2. List the project architecture and component structure.
3. List any assumptions caused by missing measurements.

Then provide:
- Every required project file
- Complete code for every file
- Installation commands
- Local development instructions
- Vercel deployment instructions
- A concise testing checklist
- Clear locations in the code where I can adjust estimated room dimensions, colours, labels, descriptions, and tour positions

Organize room dimensions and metadata in a central configuration file so the layout can be corrected easily later.

Do not omit code with phrases such as “implementation goes here.” If the response reaches its output limit, stop at a clean file boundary, state which file comes next, and wait for me to say “continue.”