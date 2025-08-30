## FLUEO ROADMAP

MAKE VIDEO OF THIS NEXT

Sidebar = dashboard, journal, terms, review

DASHBOARD
- Show stats listed here / somewhere, what could cards be

JOURNAL
- write in my log

TERMS
- Show terms, add manually

REVIEW
- Review page for each term, difficulty 1-4

PROFILE
- Change information

HERO
- Something nice, learn spanish through daily life, features on side

PRICING
- See plans, get started means login then go to plans (separate for each button)

SUBSCRIPTION
- See current plan, manage button to stripe


So as of now, we have authentication set up and it brings us to a dummy dashboard and we have a button down there at the bottom to logout which also works successfully. So for this app, I am thinking about having a paid tier which is unlimited flashcards / terms and journaling but then a paid tier which includes AI flashcard generation after maybe 5 free ones and this will be $2.99 per month or $4.99 per month still deciding but let's go with 499 for now. I want you to help me write descriptions in the agents.md about the pricing and then I have some technical questions to ask you

Pricing Page User Flow:
1. User views pricing page
2. Clicks upgrade button
3. If not logged in -> Sign up flow
4. If logged in -> Stripe Checkout
5. After payment -> Update user_profiles
6. Redirect to dashboard

Manage Subscription User Flow:
1. User clicks "Billing" in dashboard sidebar
2. System checks subscription status:
   - Free Tier: Show upgrade card with features and upgrade button
   - Premium Tier: Show current plan details and management options
3. Premium User Actions:
   - View current plan and status
   - View usage statistics
   - Access billing history
   - Update payment method (redirects to Stripe Portal)
   - Cancel subscription (redirects to Stripe Portal)
4. After any Stripe Portal action:
   - Webhook receives update
   - Updates user_profiles table
   - Updates UI to reflect changes
5. Cancellation handling:
   - Keep premium access until end of billing period
   - Show renewal date / access expiration
   - Display reactivation option

AI Translation Limit Implementation:
1. Database Updates:
   - Add to user_profiles:
     • ai_translations_used (integer)
     • ai_translations_limit (integer, 5 for free, -1 for premium)
     • translations_reset_date (timestamp)
   
2. Usage Tracking Flow:
   - Before each AI translation:
     • Check subscription status
     • If free tier:
       - Verify ai_translations_used < ai_translations_limit
       - If limit reached, prompt upgrade
       - If under limit, proceed and increment counter
     • If premium tier:
       - Proceed with no limits (-1 means unlimited)
   
3. Reset Logic:
   - Monthly reset for free tier users:
     • Scheduled task checks translations_reset_date
     • If month has passed:
       - Reset ai_translations_used to 0
       - Update translations_reset_date
   
4. Subscription Change Handling:
   - User upgrades to premium:
     • Set ai_translations_limit to -1
     • Clear ai_translations_used counter
   - User downgrades to free:
     • Set ai_translations_limit to 5
     • Set ai_translations_used to 0
     • Set translations_reset_date to current date

ALTER TABLE user_profiles
ADD COLUMN ai_translations_used integer DEFAULT 0,
ADD COLUMN ai_translations_limit integer DEFAULT 5,
ADD COLUMN translations_reset_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

Yes perfect! So I want to have a pricing page at flueo.app/pricing that shows these 2 cards, then basically explain what we would do to set up stripe and how we would get the stripe system to work for a user to subscribe (they need an account first obviously). Then describe what would go in the billing section when the user clicks that here on this dashboard. Maybe they could go to a page that shows their current plan and then when they hit manage subscription it takes them back to the stripe interface. How does that all work anyways


checkout.session.completed
customer.subscription.created
customer.subscription.updated
https://www.flueo.app/api/stripe/webhook





FROM OTHERS
- Hero page for the front (text)
- Stripe stuff for the integration
- Previous pages from other things and such

Ensure API is structured good
BUILD THE API STUFF OUT AND TEST IT WITH DUMMY DATA FOR ALL ENDPOINTS

INTEGRATE STRIPE BILLING





ASAP
- Make Color Theme Blue
- Hover mouse on every single button
- Side panel visible always

JOURNAL
- Date to see previous journals

DASHBOARD
- Cards = words learned, daily streak, review score

SECURITY
- RLS on all queries and such
- Rate limit on my DeepL Key

PREDETAILS
- Stripe should say flueo not maverick reynolds
- Other account stuff from the Acme page on desktop
- Update Stripe item details and what it says and such

BRANDING
- Improve home page layout, borrow from other pages
- Create logo, put everywhere

MARKETING
- Post on Reddit about the working prototype
- Post in all sub communities and on X and such
- Document this journey every single day
- CREATE INSTAGRAM ADS AND GET THIS FUCKER MOVING YOU SO GOT THIS!!!


=========== SHIP THIS FUCKER ================================

APP SECURITY
- Moderation Checks (sanitization when going into AI)
- Rate Limit Endpoints (supabase edge function with rate limiter)
- Vercel settings, security, WAF
- CAPTCHA
- Monitoring and logs
- bun audit
- Validate inputs on backend

POST DETAILS
- Supabase s3 for profile photos

FLASHCARDS
- AI Parsing of flashcards and translations, phrases
- Manual adding of flashcards
- sm2 for review and such

EVENTUALLY
- Browse premade decks like Anki, community sharing














DOCUMENT / USE
- Record current progress
- Try it out

NOTES
- Randomize the order of the terms
- Buttons on the bottom, make constant spacer card doesn't move
- No cards to review (skip ahead anyways)
- Ability to sort the table
- Prompt: consider literal and idiomatic meanings, mexican dialect
- AI Explainer what does XXX mean here (in review, edit, and add)
- Typing special symbols for Spanish

BIG
- AI Explanation during adding
- Replace the cards with info / collect statistics (separate database?)
- Take things and make components (split up big files so I know what is going on)

SMALL
- main table make 4 green
- cursor pointer for everything
- enlarge all buttons
- change to 'add' in add page
- All supabase queries need to be seen by only the current user!
- Magic stars for AI stuff

ORGANIZATION
- Give description and notes and alternate translations and whatnot
- Remove other supabase projects
- Remove other vercel stuff
- Rename supabase / vercel / github
- Rename folders to how I like

SHARE WITH COMMUNITIES AT THIS POINT
VIDEO
- How I set this up...
- Like Literally just record your progress, post on X, people will love this!
- Share in reddit
- Software, language learning, other youtubers and COMMUNITIES
- Product Hunt put it on there and look there as well
--------------------------------------------

BIG
- Get Toaster working in all instances
- Statistics page, panel with information
- Progress for each word / phrase
- Daily Review Goal
- Build out about, help, settings

DETAILS
- Dark mode all screens
- Hero make pretty
- Login and forget password and auth make look good
- Ensure copy is good (auth spaces)
- Cursor pointer on hover ALL BUTTONS
- Link to me, my github, my projects
- Feedback link as well (go to another supabase)
- redo icons in side bar

PRACTICE USING
- ask AI
- try to break prompt (check input and output)
- implement <thinking> tags

DEPLOY
- Create color, logo, branding
- Favicon
- ask Grok
- Ensure moderation / content length for AI
- Deny prompt injecting
- Supabase ensure no span sign up and good!
- Fix 404 errors

ENVIRONMENT / SETTINGS
- Max Tokens
- Prompts (fix grammar)
- num to review each session
- User dialect (for the AI)

EXPAND
- Choose Language
- Listen to Audio
- Import Text
- Capture Keywords and Keyphrases
- https://github.com/nextjs/saas-starter
- Daily Joural (record yourself and such)
- Talk to friends as well

CURSOR
- Supabase MCP

RESOURCES
https://www.youtube.com/watch?v=Qp20WEl1FP4, Other Tell Me In Spanish
https://readlang.com/es/dashboard
https://www.youtube.com/watch?v=97OxMXc3aXQ
https://www.tellmeinspanish.com/mexican-slang-spanish/

https://www.youtube.com/watch?v=ed9VGW-1_6U&t=783s

https://www.youtube.com/watch?v=M3ka8N_7GCE
https://www.youtube.com/watch?v=CeuBWOU_yb8
https://aprenderespanol.org/lecturas/cuentos-lecturas.html
https://www.youtube.com/watch?v=SEROD8pUnCA
https://www.youtube.com/watch?v=3z5zt4duxFU
https://www.youtube.com/watch?v=geUgTbNyHZI
https://www.youtube.com/watch?v=UAsDxsUkvyw
https://www.youtube.com/watch?v=6DKOYUb92Uc