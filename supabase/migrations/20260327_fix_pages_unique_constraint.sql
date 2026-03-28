-- Add unique constraint to avoid duplicates and enable upsert
ALTER TABLE pages ADD CONSTRAINT unique_facebook_page_user UNIQUE (facebook_page_id, user_id);
