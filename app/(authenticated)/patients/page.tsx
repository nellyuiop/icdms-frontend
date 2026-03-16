"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PageBackLink from "@/components/PageBackLink";
import { Search, Plus, Trash2, Eye, X, Calendar } from "lucide-react";
import ScheduleVisitModal from "@/components/ScheduleVisitModal";

type PatientRecord = {
  id: string;
  external_id?: string;
  name?: string;
  dob: string;
  gender?: string | null;
};

type PaginatedResponse = {
  data: PatientRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const PAGE_SIZE = 20;

export default function PatientsPage() {
  const { isAdmin, isClinician, isStaff } = useAuth();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const canDelete = isAdmin || isClinician;
  const canAdd = isAdmin || isStaff;
  const canSchedule = isAdmin || isStaff;

  const [scheduleTarget, setScheduleTarget] = useState<PatientRecord | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", gender: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPatients = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await api.get<PaginatedResponse>("/patients", {
        params,
        signal: controller.signal,
      });
      const body = res.data;
      setPatients(body.data || []);
      setTotal(body.total ?? 0);
      setTotalPages(body.totalPages ?? 1);

      if (body.totalPages > 0 && page > body.totalPages) {
        setPage(body.totalPages);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Error fetching patients:", err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchPatients();
    return () => abortRef.current?.abort();
  }, [fetchPatients]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/patients/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPatients();
    } catch {
      setFormError("Failed to delete patient.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      await api.post("/patients", form);
      setShowForm(false);
      setForm({ name: "", dob: "", gender: "" });
      fetchPatients();
    } catch (err) {
      console.error("Error creating patient:", err);
      setFormError("Failed to create patient. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBackLink />

      <div className="page-header">
        <h2 className="page-title">Patients</h2>
        {canAdd && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? (
              <>
                <X size={15} /> Cancel
              </>
            ) : (
              <>
                <Plus size={15} /> Add Patient
              </>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "560px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            New Patient
          </h3>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleCreatePatient} className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  name="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? "Creating..." : "Create Patient"}
            </button>
          </form>
        </div>
      )}

      <div className="search-input">
        <Search size={16} />
        <input
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th style={{ width: "1%" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="empty-state">Loading...</td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">No patients found</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td style={{ fontWeight: 500 }}>{patient.name}</td>
                  <td>{new Date(patient.dob).toLocaleDateString()}</td>
                  <td>
                    <span style={{ color: "var(--gray-500)" }}>
                      {patient.gender ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase() : "---"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => router.push(`/patients/${patient.id}`)}
                        className="btn btn-sm btn-ghost"
                        title="View patient"
                      >
                        <Eye size={14} /> View
                      </button>
                      {canSchedule && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setScheduleTarget(patient);
                          }}
                          className="btn btn-sm btn-primary"
                          title="Schedule visit"
                        >
                          <Calendar size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(patient);
                          }}
                          className="btn btn-sm btn-danger"
                          title="Delete patient"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Showing {(page - 1) * PAGE_SIZE + 1}--{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="pagination-controls">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="btn btn-sm btn-ghost"
            >
              Previous
            </button>
            <span className="pagination-page">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn btn-sm btn-ghost"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ScheduleVisitModal
        open={!!scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        onSuccess={() => setScheduleTarget(null)}
        patient={scheduleTarget}
      />

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Patient</h3>
            <p className="modal-body">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name || "this patient"}</strong>? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
                <Trash2 size={14} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
