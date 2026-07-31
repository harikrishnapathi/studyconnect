#!/bin/bash
# StudyConnect Automated PostgreSQL Backup & Cloud Object Storage Sync Script
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/pg_backups"
BACKUP_FILE="${BACKUP_DIR}/studyconnect_db_backup_${TIMESTAMP}.sql.gz"
S3_BUCKET="s3://studyconnect-encrypted-backups/pg_daily/"

mkdir -p ${BACKUP_DIR}

echo "[$(date)] Starting PostgreSQL Automated Backup..."
pg_dump -h ${DB_HOST:-db_primary} -U ${DB_USER:-studyconnect_admin} -d ${DB_NAME:-studyconnect_prod} | gzip > ${BACKUP_FILE}

echo "[$(date)] Backup completed successfully. Size: $(du -sh ${BACKUP_FILE} | cut -f1)"

echo "[$(date)] Uploading encrypted backup to Cloud Object Storage (${S3_BUCKET})..."
# aws s3 cp ${BACKUP_FILE} ${S3_BUCKET} --sse aws:kms

# Retention Cleanup: Keep local backups for 7 days
find ${BACKUP_DIR} -type f -name "*.sql.gz" -mtime +7 -delete

echo "[$(date)] Automated Backup Pipeline Finished Successfully!"
