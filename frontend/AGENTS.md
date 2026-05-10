<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

Before writing any Next.js code:
- Read the relevant guide in `node_modules/next/dist/docs/`
- Check for deprecations
- Follow the latest conventions used by the installed version
- Never assume legacy App Router behavior is still valid

Heed deprecation notices carefully.
<!-- END:nextjs-agent-rules -->

# Frontend Engineering Rules

## React Patterns

- Always use clean, maintainable React patterns
- Prefer composition over prop drilling
- Keep components small and focused
- Extract reusable UI into shared components
- Avoid deeply nested JSX
- Prefer declarative code over imperative logic
- Use proper TypeScript typing everywhere
- Avoid `any`
- Prefer server components when possible
- Use client components only when interactivity is required
- Keep business logic outside UI components when possible

---

## Styling

- Always use Tailwind CSS
- Never use plain CSS files unless absolutely necessary
- Never use inline styles unless dynamically required
- Follow consistent spacing and layout patterns
- Use responsive design by default
- Prefer utility composition over duplicated class strings

---

## UI Components

- Only use shadcn/ui components
- Just import required components. Never write it by yourself unless we need custom behaviour
- Reuse existing shadcn patterns before creating custom components
- Extend shadcn components cleanly instead of rewriting them
- Maintain consistent UI aesthetics across the app

---

## Forms

- Use React Hook Form
- Use Zod for validation
- Prefer controlled reusable form components
- Show proper validation/error states
- Use accessible labels and descriptions

---

## Animations

- Use Framer Motion for animations
- Keep animations subtle and performant
- Prefer smooth transitions over flashy effects

---

## Code Quality

- Avoid massive components
- Avoid duplicated logic
- Prefer reusable abstractions
- Use descriptive naming
- Keep folder structure scalable
- Remove dead code
- Avoid premature optimization
- Optimize readability first

---

## Design Style

Preferred aesthetic:
- Modern SaaS UI
- Clean layouts
- Soft gradients
- Glassmorphism where appropriate
- Rounded corners
- Subtle borders
- Smooth hover states
- Premium developer-tool feel

Reference quality:
- Vercel
- Linear
- OpenAI
- Raycast
- Stripe Dashboard