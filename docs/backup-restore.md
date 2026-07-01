# PostgreSQL Backup and Restore

Treat booking, user, notification, permission, and audit-related cancellation
data as business records. Test restore procedures regularly; an untested backup
is not a recovery plan.

## Native PostgreSQL backup

```bash
pg_dump -U postgres -d meeting_room_booking -F c -f meeting-room-backup.dump
```

Verify that the file exists and is non-empty:

```bash
ls -lh meeting-room-backup.dump
pg_restore --list meeting-room-backup.dump | head
```

## Native PostgreSQL restore

Restore into a new validation database first:

```bash
createdb -U postgres meeting_room_booking_restore_test
pg_restore -U postgres -d meeting_room_booking_restore_test meeting-room-backup.dump
```

Replacing an existing database is destructive and requires maintenance
downtime. After explicit approval and a fresh backup:

```bash
pg_restore -U postgres -d meeting_room_booking --clean --if-exists meeting-room-backup.dump
```

## Docker backup

The shell reads credentials from the database container, avoiding passwords in
the command line:

```bash
docker compose exec -T db sh -c \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -F c' \
  > meeting-room-backup.dump
```

## Docker restore test

Copy the dump into the container and restore it into a temporary database:

```bash
docker compose cp meeting-room-backup.dump db:/tmp/meeting-room-backup.dump
docker compose exec -T db sh -c \
  'createdb -U "$POSTGRES_USER" meeting_room_booking_restore_test && \
   pg_restore -U "$POSTGRES_USER" -d meeting_room_booking_restore_test /tmp/meeting-room-backup.dump'
```

Drop the temporary database after validation:

```bash
docker compose exec -T db sh -c \
  'dropdb -U "$POSTGRES_USER" meeting_room_booking_restore_test'
```

## Schedule and retention

- Run automated daily backups.
- Keep multiple restore points, including off-host encrypted copies.
- Restrict backup access because dumps contain user and booking information.
- Monitor backup job failures and available storage.
- Perform a documented restore test at least quarterly.

