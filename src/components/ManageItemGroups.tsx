// src/components/ManageItemGroups.tsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

const ManageItemGroups = () => {
  const [itemGroups, setItemGroups] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const fetchItemGroups = async () => {
      const response = await api.get('/item-groups');
      setItemGroups(response.data);
    };
    fetchItemGroups();
  }, []);

  const handleCreateItemGroup = async () => {
    try {
      const response = await api.post('/item-groups', { name });
      setItemGroups((prevItemGroups) => [...prevItemGroups, response.data]);
      setName('');
    } catch (error) {
      console.error('Error creating item group:', error);
    }
  };

  const handleDeleteItemGroup = async (id: number) => {
    try {
      await api.delete(`/item-groups/${id}`);
      setItemGroups(itemGroups.filter((group) => group.id !== id));
    } catch (error) {
      console.error('Error deleting item group:', error);
    }
  };

  const handleEditItemGroup = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleUpdateItemGroup = async () => {
    try {
      await api.put(`/item-groups/${editingId}`, { name: editingName });
      setItemGroups(itemGroups.map((group) => 
        group.id === editingId ? { ...group, name: editingName } : group
      ));
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating item group:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Item Groups</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Item Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleCreateItemGroup} className="bg-green-500 text-white p-2 rounded">
          Add Item Group
        </button>
      </div>
      <ul>
        {itemGroups.map((group) => (
          <li key={group.id} className="mb-2">
            {editingId === group.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="p-2 border rounded mr-2"
                />
                <button onClick={handleUpdateItemGroup} className="bg-blue-500 text-white p-1 rounded">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white p-1 rounded ml-2">
                  Cancel
                </button>
              </>
            ) : (
              <>
                {group.name}
                <button
                  onClick={() => handleEditItemGroup(group.id, group.name)}
                  className="bg-yellow-500 text-white p-1 rounded ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItemGroup(group.id)}
                  className="bg-red-500 text-white p-1 rounded ml-2"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageItemGroups;