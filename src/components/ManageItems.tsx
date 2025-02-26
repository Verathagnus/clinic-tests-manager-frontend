import { useState, useEffect } from "react";
import api from "../utils/api";
import { ItemGroupProp, ItemProp } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal"; // Import the ConfirmModal
import { Edit, Trash } from "lucide-react";
// import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import PaginationComponent from "./Pagination";

const ManageItems = () => {
  const [items, setItems] = useState<ItemProp[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroupProp[]>([]);
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupIdCreate, setGroupIdCreate] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // State to track item to delete
  const [user, setUser] = useState<{ username: string }>({ username: "" });
  const [page, setPage] = useState(1);
  const [limit, ] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || '{}'));
  }, [])
  // Fetch items and item groups on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/items/filter", {
        params: { page, limit, search, groupId: (Number.isNaN(groupIdCreate) ? "" : groupId), sortBy, sortOrder },
      });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    };

    const fetchItemGroups = async () => {
      const response = await api.get("/item-groups");
      setItemGroups(response.data);
    };

    fetchItems();
    fetchItemGroups();
  }, [page, limit, search, groupId, groupIdCreate, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setPage(1);
  };

  // Create or update an item
  const handleCreateOrUpdateItem = async () => {
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, { name, groupId: groupIdCreate, description, price });
        toast.success("Item edited successfully");
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingId ? { ...item, name, group_id: groupIdCreate, description, price } : item
          )
        );
        setEditingId(null);
      } else {
        const response = await api.post("/items", { name, groupId: groupIdCreate, description, price });
        toast.success("Item created successfully");
        setItems((prevItems) => [...prevItems, response.data]);
      }
      setName("");
      setGroupIdCreate(null);
      setDescription("");
      setPrice(0);
      setError(null);
    } catch (error) {
      console.error("Error creating or updating item:", error);
      setError("Failed to create or update item. Please check the input and try again.");
    }
  };

  // Delete an item
  const handleDeleteItem = async (id: number) => {
    try {
      await api.delete(`/items/${id}`);
      toast.success("Item deleted successfully");
      setItems(items.filter((item) => item.id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
      setError("Failed to delete item. Please try again.");
    } finally {
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Enter edit mode for an item
  const handleEditItem = (item: ItemProp) => {
    setEditingId(item.id || null);
    setName(item.name);
    setGroupIdCreate(item.group_id || null);
    setDescription(item.description);
    setPrice(item.price);
    setError(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Items</h2>

      {/* Error Alert */}
      {/* {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      {/* Add/Edit Item Form */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-48"
        />
        <select
          value={groupIdCreate || ""}
          onChange={(e) => setGroupIdCreate(parseInt(e.target.value))}
          className="p-2 border rounded w-48"
        >
          <option value="">Select Item Group</option>
          {itemGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-48"
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          className="w-48"
        />
        <Button onClick={handleCreateOrUpdateItem}>
          {editingId ? "Update Item" : "Add Item"}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by name or description"
          value={search}
          onChange={handleSearch}
          className="w-64"
        />
        <select
          value={groupId || ""}
          onChange={(e) => { setGroupId(parseInt(e.target.value)); setPage(1); }}
          className="p-2 border rounded w-48"
        >
          <option value="">All Groups</option>
          {itemGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortBy === "name" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Group</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
              Description {sortBy === "description" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
              Price {sortBy === "price" && (sortOrder === "ASC" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {itemGroups.find((group) => group.id === item.group_id)?.name || "N/A"}
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  onClick={() => handleEditItem(item)}
                  variant="secondary"
                >
                  <Edit></Edit>
                </Button>
                {user.username === 'admin' && (
                  <Button
                    onClick={() => openDeleteModal(item.id!)}
                    variant="destructive"
                  >
                    <Trash></Trash>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      {/* Pagination */}
      {/* <Pagination className="mt-4">
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => itemToDelete && handleDeleteItem(itemToDelete)}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  );
};

export default ManageItems;