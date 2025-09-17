Veluna Cloud Proxy

This minimal Express proxy provides two endpoints to sync Veluna projects with a Postgres database (useful when you want server-side sync without exposing DB credentials in the browser).

Requirements
- Node 18+ (or Node 16+)
- A Postgres database (Supabase works)

Setup
1. Copy the connection string and set as environment variable DATABASE_URL.
   Example (PowerShell):

   $env:DATABASE_URL = "postgresql://postgres.mwgiyscunaolxaxuxpzc:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

   Replace [YOUR-PASSWORD] with your actual password. It's recommended to place this in a .env file instead.

2. Install dependencies:
   npm install

3. Run the server:
   npm start

Endpoints
- GET /projects
  Returns all projects in the projects table as JSON.

- POST /projects
  Upserts a single project. Body should include at minimum { id: number, title, description, tags, image }

Security notes
- Do NOT commit your password or DATABASE_URL to source control.
- In production, restrict CORS origins and add authentication.

Database table example (Postgres SQL):

CREATE TABLE projects (
  id bigint PRIMARY KEY,
  created_at timestamp DEFAULT now(),
  title json,
  description json,
  "image url" json,
  tags json
);

This proxy expects the columns similar to the example shown in your Supabase screenshot. Adjust SQL as needed.
