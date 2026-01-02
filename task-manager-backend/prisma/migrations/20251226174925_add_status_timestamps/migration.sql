-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "reopenedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);
