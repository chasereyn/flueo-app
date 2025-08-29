# AI Agent Guidelines for Flueo Development

This document outlines the key guidelines and preferences for AI agents assisting in the development of Flueo.

## Project Context

Flueo is a language learning SaaS application built with:
- Next.js frontend with shadcn/ui components (light theme)
- Supabase for backend and auth
- Drizzle ORM for type-safe database operations
- Stripe for payments
- AI integration for language processing

### Database Setup
The project uses Supabase PostgreSQL with the following tables:

1. **auth.users** (Managed by Supabase)
   - Default Supabase authentication table

2. **user_profiles**
   - Extends auth.users with subscription data
   - `id` - UUID (references auth.users)
   - `stripe_customer_id` - For payment processing
   - `stripe_subscription_id` - Active subscription
   - `plan_name` - Current subscription tier
   - `subscription_status` - Active/cancelled/etc

3. **journal_entries**
   - `id` - Serial primary key
   - `user_id` - UUID (references auth.users)
   - `english_text` - Original journal entry
   - `spanish_text` - Translated content
   - `ai_translated` - Translation source flag
   - Timestamps for created/updated

4. **flashcards**
   - `id` - Serial primary key
   - `user_id` - UUID (references auth.users)
   - `journal_entry_id` - Optional reference to source
   - `english_text` - English word/phrase
   - `spanish_text` - Spanish translation
   - `context_sentence` - Usage example
   - `notes` - Study notes
   - Spaced repetition fields:
     - `quality` (0-5)
     - `repetition_count`
     - `easiness_factor`
     - `interval_days`
     - `next_review`
     - `last_reviewed`
   - `ai_generated` - Whether created by AI
   - `suspended` - Temporarily disabled

5. **activity_logs**
   - `id` - Serial primary key
   - `user_id` - UUID (references auth.users)
   - `action` - Activity description
   - `timestamp` - When it occurred
   - `ip_address` - Security tracking

6. **invitations**
   - `id` - Serial primary key
   - `email` - Invitee's email
   - `invited_by` - UUID (references auth.users)
   - `status` - pending/accepted/etc

All tables have:
- Row Level Security (RLS) enabled
- Policies ensuring users only access their own data
- Appropriate indexes for performance
- Updated_at trigger for change tracking

### Component Libraries
- Using shadcn/ui for UI components (not Material UI)
- Components are copied into the project under `components/ui/`
- Custom theme configuration in `components.json`
- Light theme with consistent styling

## File Structure

```
app/
├── (auth)/                    # Auth route group (doesn't affect URL)
│   ├── login/                 # /login
│   │   └── page.tsx          
│   ├── signup/               # /signup
│   │   └── page.tsx
│   └── layout.tsx            # Shared auth layout
│
├── (marketing)/              # Marketing/public route group
│   ├── page.tsx              # Landing page (/)
│   ├── pricing/              # /pricing
│   │   └── page.tsx
│   └── layout.tsx            # Marketing layout with nav
│
├── (dashboard)/              # Protected dashboard routes
│   ├── dashboard/            # Main dashboard (/dashboard)
│   │   ├── journal/          # /dashboard/journal
│   │   │   ├── page.tsx     # Journal entries list
│   │   │   └── [id]/        # Individual journal entry
│   │   │       └── page.tsx
│   │   │
│   │   ├── flashcards/      # /dashboard/flashcards
│   │   │   ├── page.tsx     # Flashcard review
│   │   │   └── stats/       # Flashcard statistics
│   │   │       └── page.tsx
│   │   │
│   │   ├── progress/        # /dashboard/progress
│   │   │   └── page.tsx     # Learning progress/stats
│   │   │
│   │   └── settings/        # /dashboard/settings
│   │       └── page.tsx     # User/language settings
│   │
│   └── layout.tsx           # Dashboard layout with sidebar
│
├── api/                      # API routes
│   ├── auth/                # Auth endpoints
│   ├── journal/             # Journal CRUD
│   ├── flashcards/         # Flashcard operations
│   └── ai/                 # AI translation endpoints
│
└── components/             # Shared components
    ├── marketing/         # Landing page components
    ├── dashboard/        # Dashboard-specific components
    ├── journal/         # Journal components
    ├── flashcards/     # Flashcard components
    └── ui/            # Shared UI components
```

### Key Routes

- `/` - Landing page with "Get Started" button
- `/login` - User login
- `/signup` - New user registration
- `/dashboard` - Main dashboard with learning stats
- `/dashboard/journal` - Daily journal entries
- `/dashboard/flashcards` - Flashcard review system
- `/dashboard/progress` - Learning progress tracking

## Development Guidelines

### 1. Component Architecture

- **Single Responsibility**: Each component and file should do exactly one thing and do it well
- **Component-First**: Break features into small, reusable components
- **shadcn/ui**: Use shadcn/ui components from components/ui/ directory
- **File Organization**: Keep related components close together in the file structure

### 2. Code Style

- Prefer TypeScript with proper type definitions
- Use functional components with hooks
- Implement proper error handling and loading states
- Follow shadcn/ui theming and styling patterns
- Keep components small and focused (ideally under 200 lines)

### 3. Feature Implementation

When implementing new features:
1. First propose a component breakdown
2. Create individual components before assembling the feature
3. Implement proper error handling and loading states
4. Add appropriate TypeScript types
5. Follow shadcn/ui patterns for consistency

### 4. Database Guidelines

- All Supabase queries must include proper RLS policies
- Each user should only see their own data
- Follow established naming conventions
- Include proper foreign key relationships
- Use Supabase auth.users as the source of truth for user data
- Always handle auth state changes appropriately

### 5. AI Integration Guidelines

When working with AI features:
- Implement proper rate limiting
- Add input validation and sanitization
- Consider token limits and costs
- Add appropriate error handling for AI responses
- Cache results when appropriate

### 6. Component Structure Example

```tsx
// Good component structure
import { Card, CardContent } from '@/components/ui/card';

interface FlashcardProps {
  front: string;
  back: string;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  onFlip
}) => {
  // Single focused component logic
  return (
    <Card onClick={onFlip}>
      <Typography>{/* ... */}</Typography>
    </Card>
  );
};
```

## Key Areas of Focus

1. **Journal Entry System**
   - Text editor component
   - Translation display
   - Save/edit functionality

2. **Flashcard System**
   - Card component
   - Spaced repetition algorithm
   - Progress tracking

3. **Vocabulary Extraction**
   - AI processing of journal entries
   - Keyword identification
   - Translation verification

4. **User Dashboard**
   - Progress tracking
   - Statistics display
   - Learning schedule

## Testing and Quality

- Implement proper error boundaries
- Add loading states for async operations
- Include proper type checking
- Follow accessibility guidelines
- Test edge cases and error states

## Security Considerations

- Validate all user inputs
- Implement proper rate limiting
- Follow security best practices for AI integrations
- Ensure proper authentication checks
- Use Supabase RLS policies consistently
- Never expose sensitive data in client-side code