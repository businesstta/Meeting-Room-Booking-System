param(
  [string]$Database = "meeting_room_booking",
  [string]$User = "postgres",
  [string]$HostName = "localhost",
  [int]$Port = 5432,
  [string]$PsqlPath = "psql"
)

$ErrorActionPreference = "Stop"
$schemaPath = Join-Path $PSScriptRoot "postgres.sql"

Write-Host "Checking PostgreSQL connection..."
$exists = & $PsqlPath -h $HostName -p $Port -U $User -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$Database'"
if ($exists -ne "1") {
  Write-Host "Creating database $Database..."
  & $PsqlPath -h $HostName -p $Port -U $User -d postgres -c "CREATE DATABASE $Database"
}

Write-Host "Applying schema and seed data..."
& $PsqlPath -h $HostName -p $Port -U $User -d $Database -f $schemaPath

Write-Host "Done. Database $Database is ready."
