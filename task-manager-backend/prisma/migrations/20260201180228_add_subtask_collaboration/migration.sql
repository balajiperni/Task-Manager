/*
  Warnings:

  - You are about to drop the column `parentTaskId` on the `Task` table. All the data in the column will be lost.
  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'InProgress', 'Completed');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskActivity" DROP CONSTRAINT "TaskActivity_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskCollaborator" DROP CONSTRAINT "TaskCollaborator_taskId_fkey";

-- DropIndex
DROP INDEX "Task_isDeleted_idx";

-- DropIndex
DROP INDEX "Task_parentTaskId_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "parentTaskId",
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "SubTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "order" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTaskCollaborator" (
    "id" SERIAL NOT NULL,
    "subTaskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SubTaskCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubTask_taskId_idx" ON "SubTask"("taskId");

-- CreateIndex
CREATE INDEX "SubTask_status_idx" ON "SubTask"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubTaskCollaborator_subTaskId_userId_key" ON "SubTaskCollaborator"("subTaskId", "userId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTaskCollaborator" ADD CONSTRAINT "SubTaskCollaborator_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "SubTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTaskCollaborator" ADD CONSTRAINT "SubTaskCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCollaborator" ADD CONSTRAINT "TaskCollaborator_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
