"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/app/lib/api";
import { X, Search } from "lucide-react";

type PatientOption = {
  id: string;
  name?: string;
  dob: string;
};

type ClinicianOption = {
  id: string;
  name?: string;
  email?: string;
};

type PaginatedResponse = {
  data: PatientOption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ScheduleVisitModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient?: PatientOption | null;
};

export default function ScheduleVisitModal({
  open,
  onClose,
  onSuccess,
  patient: preselectedPatient,
}: ScheduleVisitModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(
    preselectedPatient || null
  );

  // Patient search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Clinician search state
  const [selectedClinician, setSelectedClinician] = useState<ClinicianOption | null>(null);
  const [clinicianQuery, setClinicianQuery] = useState("");
  const [clinicianResults, setClinicianResults] = useState<ClinicianOption[]>([]);
  const [searchingClinician, setSearchingClinician] = useState(false);
  const [showClinicianDropdown, setShowClinicianDropdown] = useState(false);
  const clinicianSearchRef = useRef<HTMLDivElement>(null);
  const clinicianAbortRef = useRef<AbortController | null>(null);

  // Form state
  const [visitDate, setVisitDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sync preselected patient when prop changes
  useEffect(() => {
    setSelectedPatient(preselectedPatient || null);
  }, [preselectedPatient]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setVisitDate("");
      setReason("");
      setError("");
      setSearchQuery("");
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedClinician(null);
      setClinicianQuery("");
      setClinicianResults([]);
      setShowClinicianDropdown(false);
      if (!preselectedPatient) {
        setSelectedPatient(null);
      }
    }
  }, [open, preselectedPatient]);

  // Debounced patient search
  const searchPatients = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearching(true);
    try {
      const res = await api.get<PaginatedResponse>("/patients", {
        params: { search: query, limit: 5 },
        signal: controller.signal,
      });
      if (!controller.signal.aborted) {
        setSearchResults(res.data.data || []);
        setShowDropdown(true);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Patient search error:", err);
        setSearchResults([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setSearching(false);
      }
    }
  }, []);

  // Debounced clinician search
  const searchClinicians = useCallback(async (query: string) => {
    clinicianAbortRef.current?.abort();
    const controller = new AbortController();
    clinicianAbortRef.current = controller;

    setSearchingClinician(true);
    try {
      const res = await api.get<ClinicianOption[]>("/api/clinicians", {
        params: query.trim() ? { search: query } : {},
        signal: controller.signal,
      });
      if (!controller.signal.aborted) {
        setClinicianResults(res.data || []);
        setShowClinicianDropdown(true);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error("Clinician search error:", err);
        setClinicianResults([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setSearchingClinician(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(searchQuery);
    }, 300);
    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [searchQuery, searchPatients]);

  useEffect(() => {
    if (!selectedClinician) {
      const timer = setTimeout(() => {
        searchClinicians(clinicianQuery);
      }, 300);
      return () => {
        clearTimeout(timer);
        clinicianAbortRef.current?.abort();
      };
    }
  }, [clinicianQuery, searchClinicians, selectedClinician]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (clinicianSearchRef.current && !clinicianSearchRef.current.contains(e.target as Node)) {
        setShowClinicianDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (patient: PatientOption) => {
    setSelectedPatient(patient);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleDeselectPatient = () => {
    setSelectedPatient(null);
    setSearchQuery("");
  };

  const handleSelectClinician = (clinician: ClinicianOption) => {
    setSelectedClinician(clinician);
    setClinicianQuery("");
    setClinicianResults([]);
    setShowClinicianDropdown(false);
  };

  const handleDeselectClinician = () => {
    setSelectedClinician(null);
    setClinicianQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError("Please select a patient.");
      return;
    }
    if (!selectedClinician) {
      setError("Please select a clinician.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await api.post("/encounters", {
        patientId: selectedPatient.id,
        visitDate,
        clinicianUserId: selectedClinician.id,
        reason: reason || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      setError("Failed to schedule appointment. Please check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 className="modal-title" style={{ marginBottom: 0 }}>Schedule Visit</h3>
          <button onClick={onClose} className="btn btn-icon btn-ghost" style={{ padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Patient Selection */}
          <div className="form-group">
            <label className="form-label">Patient</label>
            {selectedPatient ? (
              <div className="patient-chip">
                <div>
                  <span className="patient-chip-name">
                    {selectedPatient.name || "Unknown"}
                  </span>
                  <span className="patient-chip-meta" style={{ marginLeft: "0.5rem" }}>
                    DOB: {new Date(selectedPatient.dob).toLocaleDateString()}
                  </span>
                </div>
                {!preselectedPatient && (
                  <button
                    type="button"
                    onClick={handleDeselectPatient}
                    className="patient-chip-remove"
                    title="Change patient"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="patient-picker" ref={searchRef}>
                <div className="search-input" style={{ marginBottom: 0, width: "100%" }}>
                  <Search size={15} />
                  <input
                    placeholder="Search patient by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  />
                </div>
                {showDropdown && (
                  <div className="patient-picker-dropdown">
                    {searching ? (
                      <div className="patient-picker-loading">Searching...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="patient-picker-empty">No patients found</div>
                    ) : (
                      searchResults.map((p) => (
                        <div
                          key={p.id}
                          className="patient-picker-item"
                          onClick={() => handleSelectPatient(p)}
                        >
                          <span className="patient-picker-item-name">
                            {p.name || "Unknown"}
                          </span>
                          <span className="patient-picker-item-meta">
                            {new Date(p.dob).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clinician Selection */}
          <div className="form-group">
            <label className="form-label">Clinician</label>
            {selectedClinician ? (
              <div className="patient-chip">
                <div>
                  <span className="patient-chip-name">
                    {selectedClinician.name || "Unknown"}
                  </span>
                  <span className="patient-chip-meta" style={{ marginLeft: "0.5rem" }}>
                    {selectedClinician.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDeselectClinician}
                  className="patient-chip-remove"
                  title="Change clinician"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="patient-picker" ref={clinicianSearchRef}>
                <div className="search-input" style={{ marginBottom: 0, width: "100%" }}>
                  <Search size={15} />
                  <input
                    placeholder="Search clinician by name..."
                    value={clinicianQuery}
                    onChange={(e) => setClinicianQuery(e.target.value)}
                    onFocus={() => {
                      if (clinicianResults.length > 0) {
                        setShowClinicianDropdown(true);
                      } else {
                        searchClinicians(clinicianQuery);
                      }
                    }}
                  />
                </div>
                {showClinicianDropdown && (
                  <div className="patient-picker-dropdown">
                    {searchingClinician ? (
                      <div className="patient-picker-loading">Searching...</div>
                    ) : clinicianResults.length === 0 ? (
                      <div className="patient-picker-empty">No clinicians found</div>
                    ) : (
                      clinicianResults.map((c) => (
                        <div
                          key={c.id}
                          className="patient-picker-item"
                          onClick={() => handleSelectClinician(c)}
                        >
                          <span className="patient-picker-item-name">
                            {c.name || "Unknown"}
                          </span>
                          <span className="patient-picker-item-meta">
                            {c.email}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visit Date */}
          <div className="form-group">
            <label className="form-label">Visit Date & Time</label>
            <input
              className="form-input"
              type="datetime-local"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Reason (optional)</label>
            <input
              className="form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Follow-up, Consultation"
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.25rem" }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting || !selectedPatient || !selectedClinician} className="btn btn-primary">
              {submitting ? "Scheduling..." : "Schedule Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
