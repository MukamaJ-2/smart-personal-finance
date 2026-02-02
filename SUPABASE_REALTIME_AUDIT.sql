-- Realtime: enable tables in Supabase Dashboard -> Database -> Replication
-- Auditing: generic audit log + triggers for key tables

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  table_name text not null,
  action text not null,
  row_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz default now()
);

create or replace function public.log_audit_event()
returns trigger as $$
begin
  insert into public.audit_logs (
    user_id,
    table_name,
    action,
    row_id,
    before_data,
    after_data
  ) values (
    coalesce(new.user_id, old.user_id),
    tg_table_name,
    tg_op,
    coalesce(new.id, old.id),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists audit_transactions on public.transactions;
create trigger audit_transactions
after insert or update or delete on public.transactions
for each row execute function public.log_audit_event();

drop trigger if exists audit_goals on public.goals;
create trigger audit_goals
after insert or update or delete on public.goals
for each row execute function public.log_audit_event();

drop trigger if exists audit_flux_pods on public.flux_pods;
create trigger audit_flux_pods
after insert or update or delete on public.flux_pods
for each row execute function public.log_audit_event();

alter table public.audit_logs enable row level security;
drop policy if exists "Audit logs: read own" on public.audit_logs;
create policy "Audit logs: read own"
on public.audit_logs for select
using (auth.uid() = user_id);
