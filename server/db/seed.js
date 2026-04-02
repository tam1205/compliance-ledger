import { getDB } from "./db.js";

const transactions = [
  {
    txn_id: "TXN-0041",
    ts: "2025-01-08 09:14",
    entity: "Meridian Capital Ltd",
    amount: 482000,
    currency: "GBP",
    type: "Wire Transfer",
    risk: "high",
    status: "flagged",
    rule: "AML-7",
  },
  {
    txn_id: "TXN-0042",
    ts: "2025-01-08 10:02",
    entity: "Nova Payments Inc",
    amount: 12500,
    currency: "USD",
    type: "ACH",
    risk: "low",
    status: "cleared",
    rule: "—",
  },
  {
    txn_id: "TXN-0043",
    ts: "2025-01-09 11:30",
    entity: "Elgin Brokers",
    amount: 95000,
    currency: "EUR",
    type: "Wire Transfer",
    risk: "medium",
    status: "review",
    rule: "SARS-3",
  },
  {
    txn_id: "TXN-0044",
    ts: "2025-01-09 14:55",
    entity: "Forsyth & Co",
    amount: 7800,
    currency: "GBP",
    type: "CHAPS",
    risk: "low",
    status: "cleared",
    rule: "—",
  },
  {
    txn_id: "TXN-0045",
    ts: "2025-01-10 08:45",
    entity: "Archipelago Trading",
    amount: 310000,
    currency: "USD",
    type: "Wire Transfer",
    risk: "high",
    status: "flagged",
    rule: "AML-12",
  },
  {
    txn_id: "TXN-0046",
    ts: "2025-01-10 13:20",
    entity: "Pinnacle FX",
    amount: 55000,
    currency: "EUR",
    type: "SWIFT",
    risk: "medium",
    status: "pending",
    rule: "FCA-2",
  },
  {
    txn_id: "TXN-0047",
    ts: "2025-01-11 09:00",
    entity: "Carver Holdings",
    amount: 22000,
    currency: "GBP",
    type: "ACH",
    risk: "low",
    status: "cleared",
    rule: "—",
  },
  {
    txn_id: "TXN-0048",
    ts: "2025-01-11 16:10",
    entity: "Westgate Asset Mgmt",
    amount: 780000,
    currency: "USD",
    type: "Wire Transfer",
    risk: "high",
    status: "flagged",
    rule: "AML-7",
  },
  {
    txn_id: "TXN-0049",
    ts: "2025-01-12 10:35",
    entity: "Briar Financial",
    amount: 18000,
    currency: "GBP",
    type: "CHAPS",
    risk: "medium",
    status: "review",
    rule: "SARS-3",
  },
  {
    txn_id: "TXN-0050",
    ts: "2025-01-12 15:00",
    entity: "Solent Markets",
    amount: 3400,
    currency: "EUR",
    type: "ACH",
    risk: "low",
    status: "cleared",
    rule: "—",
  },
  {
    txn_id: "TXN-0051",
    ts: "2025-01-13 08:22",
    entity: "Alcott Ventures",
    amount: 145000,
    currency: "USD",
    type: "Wire Transfer",
    risk: "medium",
    status: "review",
    rule: "FCA-2",
  },
  {
    txn_id: "TXN-0052",
    ts: "2025-01-13 12:50",
    entity: "Crown Settlements",
    amount: 630000,
    currency: "GBP",
    type: "SWIFT",
    risk: "high",
    status: "flagged",
    rule: "AML-12",
  },
];

async function seed() {
  const db = await getDB();
  try {
    await db.exec("BEGIN TRANSACTION");
    for (const t of transactions) {
      await db.run(
        `INSERT OR IGNORE INTO transactions (txn_id, ts, entity, amount, currency, type, risk, status, rule)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.txn_id,
          t.ts,
          t.entity,
          t.amount,
          t.currency,
          t.type,
          t.risk,
          t.status,
          t.rule,
        ],
      );
    }
    await db.exec("COMMIT");
    console.log("Seeded successfully.");
  } catch (err) {
    await db.exec("ROLLBACK");
    console.error("Seed failed:", err.message);
  } finally {
    await db.close();
  }
}

export async function seedIfEmpty() {
  const db = await getDB();
  try {
    const existing = await db.get("SELECT COUNT(*) as count FROM transactions");
    if (existing.count > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }
    await db.exec("BEGIN TRANSACTION");
    for (const t of transactions) {
      await db.run(
        `INSERT OR IGNORE INTO transactions (txn_id, ts, entity, amount, currency, type, risk, status, rule)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.txn_id,
          t.ts,
          t.entity,
          t.amount,
          t.currency,
          t.type,
          t.risk,
          t.status,
          t.rule,
        ],
      );
    }
    await db.exec("COMMIT");
    console.log("Seeded successfully.");
  } catch (err) {
    await db.exec("ROLLBACK");
    console.error("Seed failed:", err.message);
  } finally {
    await db.close();
  }
}
