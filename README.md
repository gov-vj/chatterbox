# Chatterbox - Real-time Chat Application

# Technologies

React, TypeScript, Vite, Supabase, Node.js (v23.11.0+), npm, Tailwind CSS, Vitest, Cypress.

# Prerequisites

- Node.js v23.11.0+
- npm
- Supabase Account

# Local Setup

## Clone and install

```bash
git clone <your_repository_url>
cd chatterbox-app
npm install
```

## Supabase Setup

- Create a new Supabase project.
- Get Project URL and anon public key from Project Settings -> API.
- Go to SQL Editor and run the following SQL:

Create `profiles` Table
```sql
CREATE TABLE public.profiles (id uuid NOT NULL PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), display_name text NULL, email text NOT NULL UNIQUE, CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE);
```

Create `messages` Table
```sql
CREATE TABLE public.messages (id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), sender_id uuid NOT NULL, receiver_id uuid NOT NULL, message text NOT NULL CHECK (char_length(message) > 0), CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE, CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE);
CREATE INDEX messages_sender_id_idx ON public.messages (sender_id);
CREATE INDEX messages_receiver_id_idx ON public.messages (receiver_id);
CREATE INDEX messages_created_at_idx ON public.messages (created_at);
```

- Go to Authentication -> Users and create two users. Note their emails and User IDs.
- Go back to SQL Editor and insert profiles for the two users (replace placeholders):
```sql
INSERT INTO public.profiles (id, email, display_name) VALUES
  ('<user_1_id_from_supabase>', '<user_1_email_address>', 'User One Display Name'),
  ('<user_2_id_from_supabase>', '<user_2_email_address>', 'User Two Display Name');
```

## Environment Variables:
- Create a `.env` file in the project root.
- Add your Supabase URL/key and the emails of the two users you created:
```text
VITE_SUPABASE_URL="<your_supabase_project_url>"
VITE_SUPABASE_ANON_KEY="<your_supabase_anon_public_key>"
VITE_ALLOWED_USER_1_EMAIL="<user_1_email_address>"
VITE_ALLOWED_USER_2_EMAIL="<user_2_email_address>"
```

## Running the application

```bash
npm run dev
```

# Running Tests

## Unit Tests

```bash
npm test
```

## End-to-End Tests 
- Open `cypress.env.json`
- Update the value
```bash
npm run cypress
```
- `chat.cy.js` may fail because event may not be received. Run it again