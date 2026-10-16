import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import { OfficialModel } from "@/models/Official";
import { ensureEnvironmentLoaded } from "./env";

ensureEnvironmentLoaded();

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sevamanjari-super-secure-official-jwt-secret-key-2026"
);

export const COOKIE_NAME = "sevamanjari_admin_session";

export interface OfficialSession {
  email: string;
  name: string;
  role: string;
}

// Ensure at least one official exists
let hasCheckedInitialOfficial = false;
export async function ensureDefaultOfficial() {
  if (hasCheckedInitialOfficial) return;
  try {
    if (!process.env.MONGODB_URI) return;
    await connectToDatabase();

    const count = await OfficialModel.countDocuments();
    if (count === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD.trim(), salt);

      await OfficialModel.create({
        email,
        passwordHash,
        name: "Company Administrator",
        role: "admin",
      });
      console.log(`Company official seeded from environment: ${email}`);
    }
    hasCheckedInitialOfficial = true;
  } catch (error) {
    console.error("Error checking officials collection:", error);
  }
}

// Verify credentials strictly from MongoDB
export async function authenticateOfficial(
  emailInput: string,
  passwordInput: string
): Promise<OfficialSession | null> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) return null;

  try {
    await connectToDatabase();
    await ensureDefaultOfficial();

    const official = await OfficialModel.findOne({ email }).lean();
    if (official && official.passwordHash) {
      const isValid = await bcrypt.compare(password, official.passwordHash);
      if (isValid) {
        return {
          email: official.email,
          name: official.name || "Company Official",
          role: official.role || "official",
        };
      }
    }
  } catch (err) {
    console.error("Error authenticating against MongoDB:", err);
  }

  return null;
}

// Sign JWT Token
export async function createSessionToken(payload: OfficialSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

// Verify JWT Token
export async function verifySessionToken(token: string): Promise<OfficialSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}
