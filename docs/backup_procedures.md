# Database Backup & Restore Procedures

To protect client itineraries and agency transactions, execute periodic database backups according to this operational runbook.

---

## 1. Automated Backups (Supabase Console)

For production projects, Supabase schedules automatic backups:

- **Point-in-Time Recovery (PITR)**: Available for Pro and Enterprise tiers. Backs up database state continuously (per-second level).
- **Daily Backups**: Automated daily snapshots. To access or restore snapshots:
  1. Navigate to your [Supabase Dashboard](https://supabase.com).
  2. Select **Database** -> **Backups** in the left sidebar.
  3. View available daily snapshots under **Daily Backups**.
  4. Click **Restore** on the target date to revert state.

---

## 2. Manual Backups (pg_dump Command Line)

To run local manual snapshots before applying heavy migrations or schema modifications, utilize the PostgreSQL CLI utilities.

### Run a Full Schema & Data Backup
```bash
pg_dump --clean --if-exists --headers --no-owner --no-privileges --dbname="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:6543/postgres" --file="vectomatrix_db_backup.sql"
```

*Replace `[YOUR-PASSWORD]` and `[YOUR-REF]` with your database credentials found in Settings -> Database.*

---

## 3. Database Restoration

To restore a manual SQL backup file to your live database instance:

1. **Via SQL Editor (Small Files)**:
   - Open the **SQL Editor** in the Supabase Dashboard.
   - Click **Upload File** or open the backup SQL file.
   - Click **Run** to execute the script.

2. **Via psql Terminal (Recommended for large files)**:
   ```bash
   psql --dbname="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:6543/postgres" --file="vectomatrix_db_backup.sql"
   ```
