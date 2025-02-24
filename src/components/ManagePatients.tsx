// src/components/ManagePatients.tsx
import { useState, useEffect } from "react";
import api from "../utils/api";
import { PatientProp } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import PaginationComponent from "./Pagination";

const ManagePatients = () => {
  const [patients, setPatients] = useState<PatientProp[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const fetchPatients = async () => {
    const response = await api.get("/patients", {
      params: { page, limit, search, sortBy, sortOrder },
    });
    setPatients(response.data.patients);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchPatients();
  }, [page, limit, search, sortBy, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Patients</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("age")}
            >
              Age {sortBy === "age" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("address")}
            >
              Address {sortBy === "address" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("phone")}
            >
              Phone {sortBy === "phone" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              Created At {sortBy === "created_at" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>
                {new Date(patient.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      {/* <div className="mt-4"> */}
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-4">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      {/* </div> */}
    </div>
  );
};

export default ManagePatients;