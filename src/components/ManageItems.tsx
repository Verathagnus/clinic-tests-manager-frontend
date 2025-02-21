// src/components/ManageItems.tsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

const ManageItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [itemGroups, setItemGroups] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchItems = async () => {
    const token = localStorage.getItem('token') || '';
    const response = await api.get('/items', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItems(response.data);
  };

  const fetchItemGroups = async () => {
    const token = localStorage.getItem('token') || '';
    const response = await api.get('/item-groups', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setItemGroups(response.data);
  };

  useEffect(() => {
    fetchItems();
    fetchItemGroups();
  }, []);

  const handleCreateOrUpdateItem = async () => {
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, { name, groupId, description, price });
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingId ? { ...item, name, groupId, description, price } : item
          )
        );
        setEditingId(null);
      } else {
        const response = await api.post('/items', { name, groupId, description, price });
        setItems((prevItems) => [...prevItems, response.data]);
      }
      setName('');
      setGroupId('');
      setDescription('');
      setPrice('');
    } catch (error) {
      console.error('Error creating or updating item:', error);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setGroupId(item.group_id); // Ensure this matches the field name in your data
    setDescription(item.description);
    setPrice(item.price);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Items</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="">Select Item Group</option>
          {itemGroups.map((group: any) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleCreateOrUpdateItem} className="bg-green-500 text-white p-2 rounded">
          {editingId ? 'Update Item' : 'Add Item'}
        </button>
      </div>
      <ul>
        {items.map((item: any) => (
          <li key={item.id} className="mb-2">
            {item.name} - {item.description} - ₹{item.price}
            <button
              onClick={() => handleEditItem(item)}
              className="bg-yellow-500 text-white p-1 rounded ml-2"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageItems;