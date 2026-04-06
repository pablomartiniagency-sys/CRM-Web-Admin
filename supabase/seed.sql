-- Seed demo data for local setup
INSERT INTO public.clients (id, name) VALUES 
('c1000000-0000-0000-0000-000000000000', 'Demo Acme Corp'),
('c2000000-0000-0000-0000-000000000000', 'Globex Corporation');

INSERT INTO public.client_environments (client_id, environment, config, service_role_secret_ref) VALUES 
('c1000000-0000-0000-0000-000000000000', 'production', '{"feature_x": true}'::jsonb, 'ref_vault_acme_prod'),
('c1000000-0000-0000-0000-000000000000', 'staging', '{"feature_x": false}'::jsonb, 'ref_vault_acme_stage'),
('c2000000-0000-0000-0000-000000000000', 'production', '{"feature_y": true}'::jsonb, 'ref_vault_globex_prod');

-- Note: access table is usually seeded when a user registers, but we'll leave it empty to test isolated RLS or insert fake user uuids later.
