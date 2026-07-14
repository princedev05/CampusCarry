import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../src/db/index.js";
import { User } from "../src/models/user.models.js";
import { Order } from "../src/models/order.models.js";
import { Token } from "../src/models/token.models.js";

dotenv.config({ path: "./.env" });

const STUDENT_COUNT = 20;
const GUARD_COUNT = 5;
const ORDER_COUNT = 40;

const STATUS_PLAN = [
  ...Array(8).fill("pending"),
  ...Array(8).fill("arrived"),
  ...Array(6).fill("verified"),
  ...Array(8).fill("token_assigned"),
  ...Array(8).fill("completed"),
  ...Array(2).fill("cancelled"),
];

const DELIVERY_SERVICES = ["Amazon", "Flipkart", "Meesho", "Blinkit", "Myntra", "Ajio"];
const HOSTELS = ["A Block", "B Block", "C Block", "D Block", "North Hostel", "South Hostel"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDigits = (len) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");

const ensureTokenPool = async () => {
  for (let tokenNumber = 1; tokenNumber <= 100; tokenNumber++) {
    await Token.updateOne(
      { tokenNumber },
      {
        $setOnInsert: {
          tokenNumber,
          isAvailable: true,
          assignedOrder: null,
          assignedByGuard: null,
          assignedAt: null,
        },
      },
      { upsert: true },
    );
  }
};

const getAvailableToken = async () => {
  return Token.findOne({
    tokenNumber: { $gte: 1, $lte: 100 },
    isAvailable: true,
    assignedOrder: null,
  }).sort({ tokenNumber: 1 });
};

const seedUsers = async () => {
  const users = [];

  for (let i = 1; i <= STUDENT_COUNT; i++) {
    const username = `demo_student_${String(i).padStart(2, "0")}`;
    const email = `${username}@campuscarry.demo`;
    const password = "Student@123";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          username,
          email,
          fullName: `Demo Student ${String(i).padStart(2, "0")}`,
          phoneNumber: `9${String(100000000 + i).padStart(9, "0")}`,
          role: "student",
          hostelName: HOSTELS[i % HOSTELS.length],
          roomNumber: `${100 + i}`,
          isEmailVerified: true,
          password: passwordHash,
          refreshToken: "",
          emailVerificationToken: undefined,
          emailVerificationExpiry: undefined,
          forgotPasswordToken: undefined,
          forgotPasswordExpiry: undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    users.push({ ...user.toObject(), plainPassword: password });
  }

  for (let i = 1; i <= GUARD_COUNT; i++) {
    const username = `demo_guard_${String(i).padStart(2, "0")}`;
    const email = `${username}@campuscarry.demo`;
    const password = "Guard@123";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          username,
          email,
          fullName: `Demo Guard ${String(i).padStart(2, "0")}`,
          phoneNumber: `8${String(100000000 + i).padStart(9, "0")}`,
          role: "guard",
          isEmailVerified: true,
          password: passwordHash,
          refreshToken: "",
          emailVerificationToken: undefined,
          emailVerificationExpiry: undefined,
          forgotPasswordToken: undefined,
          forgotPasswordExpiry: undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    users.push({ ...user.toObject(), plainPassword: password });
  }

  return users;
};

const seedOrders = async (students, guards) => {
  const insertedOrders = [];
  let created = 0;
  let tokenAssignedCreated = 0;

  for (let i = 0; i < ORDER_COUNT; i++) {
    const status = STATUS_PLAN[i];
    const student = students[i % students.length];
    const guard = guards[i % guards.length];

    const createdAt = new Date(Date.now() - (ORDER_COUNT - i) * 6 * 60 * 60 * 1000);
    const trackingId = `CC${new Date().getFullYear()}${String(100000 + i)}`;

    const orderPayload = {
      student: student._id,
      deliveryService: randomFrom(DELIVERY_SERVICES),
      trackingId,
      deliveryOtp: randomDigits(6),
      status,
      createdAt,
      updatedAt: createdAt,
    };

    if (["arrived", "verified", "token_assigned", "completed"].includes(status)) {
      orderPayload.arrivalDate = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
      orderPayload.verifiedByGuard = guard._id;
    }

    if (status === "completed") {
      orderPayload.collectedAt = new Date(createdAt.getTime() + 10 * 60 * 60 * 1000);
    }

    const order = await Order.create(orderPayload);

    if (status === "token_assigned") {
      const token = await getAvailableToken();
      if (token) {
        token.isAvailable = false;
        token.assignedOrder = order._id;
        token.assignedByGuard = guard._id;
        token.assignedAt = new Date();
        await token.save();

        order.tokenNumber = token._id;
        await order.save();
        tokenAssignedCreated += 1;
      }
    }

    insertedOrders.push(order);
    created += 1;
  }

  return { insertedOrders, created, tokenAssignedCreated };
};

const main = async () => {
  await connectDB();
  await ensureTokenPool();

  const users = await seedUsers();
  const students = users.filter((u) => u.role === "student");
  const guards = users.filter((u) => u.role === "guard");

  const { created, tokenAssignedCreated } = await seedOrders(students, guards);

  const credentials = {
    generatedAt: new Date().toISOString(),
    counts: {
      students: students.length,
      guards: guards.length,
      orders: created,
      tokenAssignedOrders: tokenAssignedCreated,
    },
    students: students.map((s) => ({
      fullName: s.fullName,
      username: s.username,
      email: s.email,
      password: s.plainPassword,
      phoneNumber: s.phoneNumber,
      hostelName: s.hostelName,
      roomNumber: s.roomNumber,
      role: s.role,
    })),
    guards: guards.map((g) => ({
      fullName: g.fullName,
      username: g.username,
      email: g.email,
      password: g.plainPassword,
      phoneNumber: g.phoneNumber,
      role: g.role,
    })),
  };

  const outputDir = path.resolve("seed-output");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "demo-credentials.json");
  await fs.writeFile(outputPath, JSON.stringify(credentials, null, 2), "utf8");

  console.log(`Seed complete. Created/updated ${students.length} students and ${guards.length} guards.`);
  console.log(`Created ${created} demo orders.`);
  console.log(`Orders currently in token_assigned status with active token: ${tokenAssignedCreated}.`);
  console.log(`Credentials saved at: ${outputPath}`);

  await mongoose.connection.close();
};

main().catch(async (error) => {
  console.error("Seeding failed:", error);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});
