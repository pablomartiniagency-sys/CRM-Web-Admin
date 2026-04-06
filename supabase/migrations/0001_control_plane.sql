-- Migration 0001: Control Plane Setup

-- Create Tables
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.client_environments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    environment TEXT NOT NULL,
    config JSONB DEFAULT '{}',
    service_role_secret_ref TEXT, -- No secret values, just key-ref
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Logical auth.users link
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS setup
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit ENABLE ROW LEVEL SECURITY;

-- Policies for Clients:
CREATE POLICY "Users can view clients they have access to" ON public.clients
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.access WHERE access.client_id = clients.id AND access.user_id = auth.uid()) OR auth.uid() IN (SELECT user_id FROM public.access WHERE role = 'admin')
    );

-- Policies for Client Environments:
CREATE POLICY "Users view environments for their accessible clients" ON public.client_environments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.access WHERE access.client_id = client_environments.client_id AND access.user_id = auth.uid())
    );

-- Access table:
CREATE POLICY "Users can check their own access" ON public.access
    FOR SELECT USING (
        user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.access AS a2 WHERE a2.client_id = access.client_id AND a2.user_id = auth.uid() AND a2.role = 'admin')
    );

-- Audit table: 
CREATE POLICY "Users can view audit for their clients" ON public.audit
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.access WHERE access.client_id = audit.client_id AND access.user_id = auth.uid())
    );
CREATE POLICY "Server can insert audit" ON public.audit
    FOR INSERT WITH CHECK (true);
