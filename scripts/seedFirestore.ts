/**
 * Script to seed Firestore with initial technician data
 *
 * Usage:
 * 1. Make sure your Firebase config is set up in config/firebase.config.ts
 * 2. Run: npx ts-node scripts/seedFirestore.ts
 *
 * Note: This script should be run from a Node.js environment, not in the Expo app
 */

import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";

const sampleTechnicians = [
  {
    name: "Mahendra Saputra",
    category: "Kelistrikan",
    location: "Denpasar, Bali",
    photoURL: "", // Add actual Firebase Storage URL after uploading
    rating: 4.8,
    price: 100000,
    skills: ["Instalasi Listrik", "Perbaikan Panel", "Maintenance"],
    available: true,
    description:
      "Teknisi kelistrikan berpengalaman 10 tahun, spesialis instalasi dan perbaikan.",
  },
  {
    name: "Wahyu Dwi Putra",
    category: "Komputer",
    location: "Gianyar, Bali",
    photoURL: "",
    rating: 4.9,
    price: 150000,
    skills: ["Repair Hardware", "Install Software", "Networking"],
    available: true,
    description:
      "Ahli komputer dan jaringan dengan pengalaman 8 tahun di berbagai perusahaan IT.",
  },
  {
    name: "Gede Mahesa",
    category: "Elektronik",
    location: "Badung, Bali",
    photoURL: "",
    rating: 4.7,
    price: 120000,
    skills: ["Service TV", "Repair AC", "Service Kulkas"],
    available: true,
    description:
      "Spesialis perbaikan elektronik rumah tangga dengan sertifikasi resmi.",
  },
  {
    name: "Githa Amyguna",
    category: "Jaringan",
    location: "Denpasar, Bali",
    photoURL: "",
    rating: 4.9,
    price: 180000,
    skills: ["Setup Network", "Troubleshooting", "Security"],
    available: true,
    description:
      "Network engineer dengan pengalaman enterprise networking dan keamanan siber.",
  },
  {
    name: "Made Sudiana",
    category: "Kelistrikan",
    location: "Tabanan, Bali",
    photoURL: "",
    rating: 4.6,
    price: 90000,
    skills: ["Instalasi Rumah", "Troubleshooting", "Maintenance"],
    available: true,
    description:
      "Teknisi listrik berpengalaman untuk instalasi rumah dan gedung.",
  },
  {
    name: "Kadek Wirawan",
    category: "Otomotif",
    location: "Denpasar, Bali",
    photoURL: "",
    rating: 4.8,
    price: 130000,
    skills: ["Service Motor", "Tune Up", "Ganti Oli"],
    available: true,
    description:
      "Mekanik motor berpengalaman 12 tahun, spesialis Honda dan Yamaha.",
  },
  {
    name: "Putu Santika",
    category: "Komputer",
    location: "Badung, Bali",
    photoURL: "",
    rating: 4.7,
    price: 140000,
    skills: ["Data Recovery", "Install OS", "Virus Removal"],
    available: true,
    description:
      "IT support specialist dengan keahlian recovery data dan troubleshooting.",
  },
  {
    name: "Nyoman Surya",
    category: "Elektronik",
    location: "Denpasar, Bali",
    photoURL: "",
    rating: 4.9,
    price: 125000,
    skills: ["Repair Mesin Cuci", "Service Elektronik", "Instalasi"],
    available: true,
    description:
      "Teknisi elektronik dengan pengalaman menangani berbagai merk elektronik.",
  },
];

async function seedTechnicians() {
  try {
    console.log("🌱 Starting Firestore seeding...");

    // Check if technicians collection already has data
    const techniciansRef = collection(db, "technicians");
    const snapshot = await getDocs(techniciansRef);

    if (!snapshot.empty) {
      console.log("⚠️  Technicians collection already has data.");
      console.log(`   Found ${snapshot.size} existing technicians.`);
      console.log("   Delete existing data first if you want to reseed.");
      return;
    }

    // Add each technician to Firestore
    let count = 0;
    for (const tech of sampleTechnicians) {
      const docRef = await addDoc(techniciansRef, {
        ...tech,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      count++;
      console.log(`✅ Added: ${tech.name} (ID: ${docRef.id})`);
    }

    console.log(`\n🎉 Successfully seeded ${count} technicians!`);
    console.log("\n📝 Next steps:");
    console.log("1. Upload technician photos to Firebase Storage");
    console.log("2. Update photoURL field for each technician");
    console.log("3. Test the app to see the dynamic data");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
    throw error;
  }
}

// Run the seeding function
seedTechnicians()
  .then(() => {
    console.log("\n✨ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
