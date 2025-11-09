-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_area_group_id_fkey";

-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "area_group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_area_group_id_fkey" FOREIGN KEY ("area_group_id") REFERENCES "area_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
