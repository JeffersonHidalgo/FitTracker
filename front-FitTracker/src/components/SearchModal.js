import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Button,
  Table,
} from "reactstrap";

const SearchModal = ({ isOpen, toggle, onSearch, results }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Buscar</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Input
              type="text"
              placeholder="Buscar por nombre o código"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FormGroup>
          <Button color="primary" size="sm" onClick={handleSearch}>
            Buscar
          </Button>
        </Form>
        <Table className="mt-3" responsive>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.id}</td>
                <td>{result.name}</td>
                <td>{result.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default SearchModal;
