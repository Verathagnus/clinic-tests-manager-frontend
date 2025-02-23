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
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal"; // Import the ConfirmModal

const ManageItems = () => {
  const [items, setItems] = useState<ItemProp[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroupProp[]>([]);
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // State to track item to delete

  // Fetch items and item groups on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token") || "";
      const response = await api.get("/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    };

    const fetchItemGroups = async () => {
      const token = localStorage.getItem("token") || "";
      const response = await api.get("/item-groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItemGroups(response.data);
    };

    fetchItems();
    fetchItemGroups();
  }, []);

  // Create or update an item
  const handleCreateOrUpdateItem = async () => {
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, { name, groupId, description, price });
        toast.success("Item edited successfully");
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingId ? { ...item, name, group_id: groupId, description, price } : item
          )
        );
        setEditingId(null);
      } else {
        const response = await api.post("/items", { name, groupId, description, price });
        toast.success("Item created successfully");
        setItems((prevItems) => [...prevItems, response.data]);
      }
      setName("");
      setGroupId(null);
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
      toast.error("Error deleting item");
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
    setGroupId(item.group_id || null);
    setDescription(item.description);
    setPrice(item.price);
    setError(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Items</h2>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          value={groupId || ""}
          onChange={(e) => setGroupId(parseInt(e.target.value))}
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

      {/* Items Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Group</TableCell>
            <TableCell className="font-bold">Description</TableCell>
            <TableCell className="font-bold">Price</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
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
                  Edit
                </Button>
                <Button
                  onClick={() => openDeleteModal(item.id!)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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