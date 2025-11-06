export const orders: any[] = [
    {
      id: 1,
      technician: {
        id: 1,
        name: "Mahendra Saputra",
        category: "Kelistrikan",
        image: require("@/assets/images/tech1.jpg"),
      },
      service: "Perbaikan lampu ruang tidur",
      date: "6 Nov 2025",
      time: "21.00",
      price: 125000,
      status: "ongoing", // "completed" | "reviewed"
    },
    {
      id: 2,
      technician: {
        id: 2,
        name: "Wahyu Dwi Putra",
        category: "Perbaikan upper body",
        image: require("@/assets/images/tech2.jpg"),
      },
      service: "Perbaikan upper body",
      date: "5 Nov 2025",
      time: "16.00",
      price: 250000,
      status: "completed",
    },
    {
      id: 3,
      technician: {
        id: 3,
        name: "Gede Mahesa",
        category: "Elektronik",
        image: require("@/assets/images/tech3.jpg"),
      },
      service: "Pembersihan 1 AC",
      date: "7 Nov 2025",
      time: "10.00",
      price: 150000,
      status: "ongoing",
    },
    {
      id: 4,
      technician: {
        id: 4,
        name: "Githa Amyguna",
        category: "Jaringan",
        image: require("@/assets/images/tech4.jpg"),
      },
      service: "Instalasi Jaringan",
      date: "4 Nov 2025",
      time: "12.30",
      price: 450000,
      status: "reviewed",
    },
  ];
  