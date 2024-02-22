/*
  Warnings:

  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `added_date` on the `shoppingcart_items` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `shoppingcart_items` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `ShoppingCart_Items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_Category_id_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcart_items` DROP FOREIGN KEY `ShoppingCart_Items_payment_id_fkey`;

-- AlterTable
ALTER TABLE `address` MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `orderitems` ADD COLUMN `address_id` INTEGER NULL,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `created_at`,
    MODIFY `order_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `status` ENUM('pending', 'Cancelled', 'Paid', 'Delivered', 'Succeed') NOT NULL DEFAULT 'pending',
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `created_at`,
    MODIFY `payment_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `created_at`,
    MODIFY `rating` INTEGER NOT NULL DEFAULT 1,
    MODIFY `review_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `shoppingcart_items` DROP COLUMN `added_date`,
    DROP COLUMN `payment_id`,
    ADD COLUMN `payment_ref_id` INTEGER NULL,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `ShoppingCart_Items` ADD CONSTRAINT `ShoppingCart_Items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShoppingCart_Items` ADD CONSTRAINT `ShoppingCart_Items_payment_ref_id_fkey` FOREIGN KEY (`payment_ref_id`) REFERENCES `Payments`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`address_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_Category_id_fkey` FOREIGN KEY (`Category_id`) REFERENCES `Category`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;
