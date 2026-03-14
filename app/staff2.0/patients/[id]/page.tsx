"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPatientById } from "@/api/patientServices";
import { getPatientLabs } from "@/api/labsService";
import { getDocuments } from "@/api/documentsService";

export default function PatientDetails() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [labs, setLabs] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      const p = await getPatientById(patientId);
      const labList = await getPatientLabs(patientId);
      const docList = await getDocuments(patientId);
      setPatient(p);
      setLabs(labList);
      setDocuments(docList);
    };
    fetchData();
  }, [patientId]);

  if (!patient) return <p>Loading...</p>;

  return (
    <div style={{ padding: 32 }}>
      <h1>{patient.firstName} {patient.lastName}</h1>
      <p>DOB: {patient.dob}</p>
      <p>Gender: {patient.gender}</p>

      <h2>Labs</h2>
      <ul>{labs.map((lab) => <li key={lab.id}>{lab.testName} - {lab.result}</li>)}</ul>

      <h2>Documents</h2>
      <ul>{documents.map((doc) => <li key={doc.id}>{doc.fileName}</li>)}</ul>
    </div>
  );
}