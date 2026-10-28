import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'node:dns';
import User from './models/User.js';
import Listing from './models/Listing.js';

// Fix for Node.js / Windows SRV lookup issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback if custom servers cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swapic';

async function seed() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Find or create demo user
    let user = await User.findOne({ email: 'aarav@swapic.app' });
    if (!user) {
      user = await User.create({
        name: 'Aarav Sharma',
        email: 'aarav@swapic.app',
        firebaseUid: 'demo_user_aarav_sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop',
      });
      console.log('Created demo user: Aarav Sharma');
    }

    const count = await Listing.countDocuments();
    console.log(`Current listings in DB: ${count}`);

    if (count < 8) {
      console.log('Seeding initial marketplace listings...');

      type ListingType = 'Sell' | 'Rent' | 'Barter' | 'Buy';
      type CategoryType = 'Electronics' | 'Furniture' | 'Clothing' | 'Books' | 'Sports' | 'Toys' | 'Home & Living' | 'Other';
      type ConditionType = 'New' | 'Like New' | 'Good' | 'Fair' | 'Used';

      interface SeedItem {
        title: string;
        description: string;
        price: number;
        rentPerDay: number;
        type: ListingType;
        category: CategoryType;
        condition: ConditionType;
        images: string[];
        location: string;
        seller: mongoose.Types.ObjectId;
        views: number;
        isActive: boolean;
      }

      const sampleListings: SeedItem[] = [
        {
          title: 'Canon AE-1 Program 35mm SLR Camera',
          description: 'Vintage Canon AE-1 in mint operational condition with 50mm f/1.8 FD lens. Fully serviced with clean shutter and light seals. Perfect for analog film photography enthusiasts.',
          price: 28000,
          rentPerDay: 750,
          type: 'Sell',
          category: 'Electronics',
          condition: 'Like New',
          images: [
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&fit=crop',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&fit=crop'
          ],
          location: 'Koramangala, Bengaluru',
          seller: user._id,
          views: 142,
          isActive: true,
        },
        {
          title: 'Apple MacBook Air M1 (16GB, 512GB SSD)',
          description: 'Space Gray MacBook Air M1 with 16GB unified memory and 512GB SSD. Battery health at 91%. Comes with original box and 30W charger. Open for rent or sale.',
          price: 52000,
          rentPerDay: 1200,
          type: 'Rent',
          category: 'Electronics',
          condition: 'Like New',
          images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&fit=crop'
          ],
          location: 'Indiranagar, Bengaluru',
          seller: user._id,
          views: 298,
          isActive: true,
        },
        {
          title: 'Trek FX 2 Disc Hybrid Bicycle',
          description: 'Matte black Trek hybrid bike, size M. Equipped with Shimano hydraulic disc brakes and puncture-resistant tyres. Great for city commutes and weekend fitness rides. Willing to barter for a gravel bike or electronics.',
          price: 24000,
          rentPerDay: 400,
          type: 'Barter',
          category: 'Sports',
          condition: 'Good',
          images: [
            'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&fit=crop',
            'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&fit=crop'
          ],
          location: 'HSR Layout, Bengaluru',
          seller: user._id,
          views: 95,
          isActive: true,
        },
        {
          title: 'Ergonomic Mid-Century 3-Seater Sofa',
          description: 'Warm terracotta boucle fabric 3-seater sofa with solid teak tapered legs. Stain-resistant treated and very comfortable. Looking to sell due to relocation.',
          price: 18500,
          rentPerDay: 350,
          type: 'Sell',
          category: 'Furniture',
          condition: 'Like New',
          images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&fit=crop'
          ],
          location: 'Whitefield, Bengaluru',
          seller: user._id,
          views: 215,
          isActive: true,
        },
        {
          title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
          description: 'Silver Sony WH-1000XM5 headphones with industry-leading active noise cancellation. Used lightly for travel. Comes with travel case, aux cable, and USB-C cable.',
          price: 21000,
          rentPerDay: 500,
          type: 'Sell',
          category: 'Electronics',
          condition: 'Like New',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&fit=crop'
          ],
          location: 'Jayanagar, Bengaluru',
          seller: user._id,
          views: 187,
          isActive: true,
        },
        {
          title: 'Vintage Solid Walnut Coffee Table',
          description: 'Authentic mid-century walnut coffee table with organic curved edge and lower magazine shelf. Beautiful grain and sturdy build.',
          price: 9500,
          rentPerDay: 200,
          type: 'Barter',
          category: 'Furniture',
          condition: 'Good',
          images: [
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&fit=crop'
          ],
          location: 'Koramangala, Bengaluru',
          seller: user._id,
          views: 84,
          isActive: true,
        },
        {
          title: 'Complete Harry Potter Hardcover Collector Set',
          description: 'All 7 volumes in pristine condition with original commemorative box. Perfect for collectors and book lovers.',
          price: 4500,
          rentPerDay: 100,
          type: 'Sell',
          category: 'Books',
          condition: 'New',
          images: [
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&fit=crop'
          ],
          location: 'Malleshwaram, Bengaluru',
          seller: user._id,
          views: 110,
          isActive: true,
        },
        {
          title: 'DeWalt 20V Max Cordless Drill Driver Kit',
          description: 'Heavy duty brushless drill with 2 lithium batteries, high-speed charger, and contractor carrying case. Available for daily or weekly rentals.',
          price: 11000,
          rentPerDay: 300,
          type: 'Rent',
          category: 'Home & Living',
          condition: 'Good',
          images: [
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&fit=crop'
          ],
          location: 'Bellandur, Bengaluru',
          seller: user._id,
          views: 76,
          isActive: true,
        }
      ];

      for (const item of sampleListings) {
        const exists = await Listing.findOne({ title: item.title });
        if (!exists) {
          await Listing.create(item);
        }
      }
      console.log('Successfully verified and seeded sample listings!');
    } else {
      console.log('Listings already present. No seeding needed.');
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
