import { useState, useEffect, useCallback } from "react";
import { fetchTransactions, createTransaction } from "./hooks/api.js";
import SummaryChart from "./components/SummaryChart.jsx";
import TransactionTable from "./components/TransactionTable.jsx";
import AddModal from "./components/AddModal.jsx";
import styles from "./App.module.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTransactions({
        status: filterStatus,
        risk: filterRisk,
        search,
      });
      setRows(data);
    } catch {
      setError("Could not load transactions. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterRisk, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (formData) => {
    setSaving(true);
    try {
      await createTransaction(formData);
      setShowModal(false);
      await load();
    } catch {
      setError("Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  const flagged = rows.filter((r) => r.status === "flagged").length;
  const highRisk = rows.filter((r) => r.risk === "high").length;
  const inReview = rows.filter((r) => r.status === "review").length;
  const totalVol = rows.reduce((a, r) => a + Number(r.amount), 0);

  return (
    <div>
      {showModal && (
        <AddModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
          loading={saving}
        />
      )}

      <div className={styles.header}>
        <h1>Compliance ledger</h1>
        <span>Risk &amp; Regulatory · {rows.length} records</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.mc}>
          <p className={styles.mcLabel}>Flagged</p>
          <p className={`${styles.mcVal} ${styles.danger}`}>{flagged}</p>
        </div>
        <div className={styles.mc}>
          <p className={styles.mcLabel}>High risk</p>
          <p className={`${styles.mcVal} ${styles.warn}`}>{highRisk}</p>
        </div>
        <div className={styles.mc}>
          <p className={styles.mcLabel}>In review</p>
          <p className={styles.mcVal}>{inReview}</p>
        </div>
        <div className={styles.mc}>
          <p className={styles.mcLabel}>Total volume</p>
          <p className={styles.mcVal}>£{Math.round(totalVol / 1000)}k</p>
        </div>
      </div>

      <SummaryChart rows={rows} />

      <div className={styles.toolbar}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {["all", "flagged", "review", "cleared", "pending"].map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
        >
          {["all", "high", "medium", "low"].map((r) => (
            <option key={r} value={r}>
              {r === "all" ? "All risk levels" : r}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search entity / ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + Log transaction
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p className={styles.loading}>
          Loading — the API may take up to 30 seconds to wake up on first visit.
        </p>
      ) : (
        <TransactionTable rows={rows} />
      )}
    </div>
  );
}
