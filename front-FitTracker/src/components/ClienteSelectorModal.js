import React, { useEffect, useState } from "react";
import {
  Modal, ModalHeader, ModalBody, Table, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import { obtenerClientes } from "../services/clienteService";

const PAGE_SIZE = 8;

const ClienteSelectorModal = ({
  isOpen,
  toggle,
  onSelect,
  title = "Consultar Cliente"
}) => {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      obtenerClientes().then(data => {
        setClientes(data || []);
        setSearchResults(data || []);
        setCurrentPage(1);
      });
    }
  }, [isOpen]);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    const filtered = clientes.filter(
      c =>
        (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(value.toLowerCase())) ||
        (c.codigoCli && c.codigoCli.toString().includes(value))
    );
    setSearchResults(filtered);
  };

  const totalPages = Math.ceil(searchResults.length / PAGE_SIZE);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" style={{ maxWidth: "900px", width: "90%" }} contentClassName="w-100">
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText style={{ background: "#f6f9fc" }}>
                  <i className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                placeholder="Buscar por nombre o código"
                value={searchQuery}
                onChange={handleSearchInput}
                style={{
                  borderLeft: "none",
                  background: "#f6f9fc",
                  borderRadius: "0 0.375rem 0.375rem 0"
                }}
              />
            </InputGroup>
          </FormGroup>
        </Form>
        <Table className="mt-3 table-hover table-striped" responsive bordered>
          <thead className="thead-light">
            <tr>
              <th style={{ width: 100 }}>Código</th>
              <th>Nombre</th>
              <th style={{ width: 120 }}>Provincia</th>
              <th style={{ width: 120 }}>Ciudad</th>
              <th style={{ width: 100 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paginatedResults.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              paginatedResults.map((result) => (
                <tr
                  key={result.codigoCli}
                  onClick={() => { onSelect(result.codigoCli); toggle(); }}
                  style={{ cursor: "pointer" }}
                  className="align-middle"
                >
                  <td>{result.codigoCli}</td>
                  <td>{result.nombreCompleto}</td>
                  <td>{result.provincia || "-"}</td>
                  <td>{result.ciudad || "-"}</td>
                  <td>
                    <span className={`badge badge-${result.estado === "A" ? "success" : "secondary"}`}>
                      {result.estado === "A" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {totalPages > 1 && (
          <Pagination className="justify-content-center">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink first onClick={() => goToPage(1)} />
            </PaginationItem>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink previous onClick={() => goToPage(currentPage - 1)} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem active={currentPage === i + 1} key={i}>
                <PaginationLink onClick={() => goToPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink next onClick={() => goToPage(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink last onClick={() => goToPage(totalPages)} />
            </PaginationItem>
          </Pagination>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ClienteSelectorModal;