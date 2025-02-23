import { useState, useEffect } from "react";
import api from "../utils/api";
import { ItemGroupProp } from "@/types/types";
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
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal"; // Import the ConfirmModal

const ManageItemGroups = () => {
  const [itemGroups, setItemGroups] = useState<ItemGroupProp[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // State to track item to delete

  // Fetch item groups on component mount
  useEffect(() => {
    const fetchItemGroups = async () => {
      const response = await api.get("/item-groups");
      setItemGroups(response.data);
    };
    fetchItemGroups();
  }, []);

  // Create a new item group
  const handleCreateItemGroup = async () => {
    try {
      const response = await api.post("/item-groups", { name });
      toast.success("Item group created successfully");
      setItemGroups((prevItemGroups) => [...prevItemGroups, response.data]);
      setName("");
      setError(null);
    } catch (error) {
      console.error("Error creating item group:", error);
      toast.error("Failed to create item group. Please try again.");
      setError("Failed to create item group. The name may already exist.");
    }
  };

  // Delete an item group
  const handleDeleteItemGroup = async (id: number) => {
    try {
      await api.delete(`/item-groups/${id}`);
      toast.success("Item group deleted successfully");
      setItemGroups(itemGroups.filter((group) => group.id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting item group:", error);
      toast.error("Failed to delete item group. Please try again.");
      setError("Failed to delete item group. Please try again.");
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

  // Enter edit mode for an item group
  const handleEditItemGroup = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
    setError(null);
  };

  // Update an item group
  const handleUpdateItemGroup = async () => {
    try {
      await api.put(`/item-groups/${editingId}`, { name: editingName });
      setItemGroups(itemGroups.map((group) =>
        group.id === editingId ? { ...group, name: editingName } : group
      ));
      setEditingId(null);
      setEditingName("");
      toast.success("Item group edited successfully");
      setError(null);
    } catch (error) {
      console.error("Error updating item group:", error);
      toast.error("Failed to update item group. The name may already exist.");
      setError("Failed to update item group. The name may already exist.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Item Groups</h2>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Item Group Form */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Item Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleCreateItemGroup}>Add Item Group</Button>
      </div>

      {/* Item Groups Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemGroups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>
                {editingId === group.id ? (
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-64"
                  />
                ) : (
                  group.name
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                {editingId === group.id ? (
                  <>
                    <Button onClick={handleUpdateItemGroup} variant="secondary">
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleEditItemGroup(group.id, group.name)}
                      variant="secondary"
                    >
                      <Edit />
                    </Button>
                    <Button
                      onClick={() => openDeleteModal(group.id)}
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => itemToDelete && handleDeleteItemGroup(itemToDelete)}
        title="Delete Item Group"
        description="Are you sure you want to delete this item group? This action cannot be undone."
      />
    </div>
  );
};

export default ManageItemGroups;