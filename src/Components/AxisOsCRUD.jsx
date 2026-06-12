import { useState, useEffect } from "react";
import axios from "axios";

const AxisOsCRUD = () => {
  // State management
  const [users, setUsers] = useState([]);        // Stores all users from API
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null);      // Error handling
  const [editingUser, setEditingUser] = useState(null); // Track user being edited
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  
  // Form state for creating/updating users
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    username: "",
    address: {
      street: "",
      city: "",
      zipcode: ""
    }
  });

  // ========== 1. GET - Fetch all users from API ==========
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using JSONPlaceholder - free fake API for testing
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
      console.log("✅ GET: Users fetched successfully", response.data);
    } catch (error) {
      console.error("❌ GET Error:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========== 2. POST - Create a new user ==========
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      // JSONPlaceholder returns a new user with ID 11
      const newUser = { ...response.data, id: Date.now() }; // Add unique ID
      setUsers([...users, newUser]); // Add to existing users list
      
      console.log("✅ POST: User created successfully", response.data);
      alert("User created successfully!");
      resetForm();
      return newUser;
    } catch (error) {
      console.error("❌ POST Error:", error);
      setError("Failed to create user. Please check your input.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========== 3. PUT - Update an existing user ==========
  const updateUser = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      // Update user in local state
      const updatedUsers = users.map(user => 
        user.id === id ? { ...user, ...updatedData } : user
      );
      setUsers(updatedUsers);
      
      console.log("✅ PUT: User updated successfully", response.data);
      alert("User updated successfully!");
      resetForm();
      return response.data;
    } catch (error) {
      console.error("❌ PUT Error:", error);
      setError("Failed to update user. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========== 4. DELETE - Remove a user ==========
  const deleteUser = async (id) => {
    // Confirm before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      
      // Remove user from local state
      const remainingUsers = users.filter(user => user.id !== id);
      setUsers(remainingUsers);
      
      console.log("✅ DELETE: User deleted successfully", id);
      alert("User deleted successfully!");
      
      // If editing user is deleted, reset form
      if (editingUser?.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("❌ DELETE Error:", error);
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========== Form Handlers ==========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields (Name and Email)");
      return;
    }
    
    if (editingUser) {
      // Update existing user
      await updateUser(editingUser.id, formData);
    } else {
      // Create new user
      await createUser(formData);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      website: user.website || "",
      username: user.username || "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        zipcode: user.address?.zipcode || ""
      }
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      username: "",
      address: {
        street: "",
        city: "",
        zipcode: ""
      }
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h1>CRUD Operation Using Axios</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Complete CRUD Example with GET, POST, PUT, DELETE operations
      </p>

      {/* Error Display */}
      {error && (
        <div style={styles.errorAlert}>
          <strong>⚠️ Error:</strong> {error}
          <button onClick={() => setError(null)} style={styles.closeBtn}>✖</button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <p>Processing request...</p>
        </div>
      )}

      {/* Add New User Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          ➕ Add New User
        </button>
      )}

      {/* Form for Create/Update */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2>{editingUser ? "✏️ Edit User" : "➕ Create New User"}</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Basic Information */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="www.example.com"
                style={styles.input}
              />
            </div>

            {/* Address Information */}
            <h3 style={styles.subtitle}>📍 Address Information</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Street name"
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Zipcode</label>
                <input
                  type="text"
                  name="address.zipcode"
                  value={formData.address.zipcode}
                  onChange={handleInputChange}
                  placeholder="Zip code"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "Processing..." : editingUser ? "✏️ Update User" : "➕ Create User"}
              </button>
              
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div style={styles.usersContainer}>
        <h2>
          📋 Users List 
          <span style={styles.count}>({users.length} users)</span>
        </h2>
        
        {users.length === 0 && !loading ? (
          <p style={styles.noData}>No users found. Click "Add New User" to create one.</p>
        ) : (
          <div style={styles.userGrid}>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                {/* User Avatar */}
                <div style={styles.avatar}>
                  {user.name?.charAt(0) || "U"}
                </div>
                
                {/* User Information */}
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>{user.name}</h3>
                  <p style={styles.userDetail}>
                    <strong>📧 Email:</strong> {user.email}
                  </p>
                  <p style={styles.userDetail}>
                    <strong>👤 Username:</strong> {user.username || "N/A"}
                  </p>
                  <p style={styles.userDetail}>
                    <strong>📞 Phone:</strong> {user.phone || "N/A"}
                  </p>
                  <p style={styles.userDetail}>
                    <strong>🌐 Website:</strong> {user.website || "N/A"}
                  </p>
                  {user.address && (
                    <p style={styles.userDetail}>
                      <strong>📍 Address:</strong> {user.address.street}, {user.address.city} {user.address.zipcode}
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                  <button 
                    onClick={() => handleEdit(user)} 
                    style={styles.editBtn}
                    title="Edit user"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => deleteUser(user.id)} 
                    style={styles.deleteBtn}
                    title="Delete user"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Information Footer */}
      <div style={styles.footer}>
        <p>
          <strong>ℹ️ Note:</strong> This uses JSONPlaceholder API (fake REST API).
          POST/PUT/DELETE operations simulate updates but don't persist to a real database.
        </p>
        <p>
          <strong>🔄 CRUD Operations:</strong> GET ✅ | POST ✅ | PUT ✅ | DELETE ✅
        </p>
      </div>
    </>
  );
};

// Styling
const styles = {
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    fontWeight: "bold"
  },
  formContainer: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "1px solid #dee2e6"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1
  },
  formRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    transition: "border-color 0.3s"
  },
  subtitle: {
    margin: "10px 0 5px 0",
    fontSize: "18px",
    color: "#495057"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  submitBtn: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    flex: 1
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    flex: 1
  },
  usersContainer: {
    marginTop: "30px"
  },
  count: {
    fontSize: "14px",
    color: "#6c757d",
    marginLeft: "10px",
    fontWeight: "normal"
  },
  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },
  userCard: {
    backgroundColor: "white",
    border: "1px solid #dee2e6",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    color: "#333"
  },
  userDetail: {
    margin: "5px 0",
    fontSize: "13px",
    color: "#666",
    wordBreak: "break-word"
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  editBtn: {
    backgroundColor: "#ffc107",
    color: "#333",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
    position: "relative"
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "10px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#721c24"
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    color: "white"
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "10px"
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    color: "#6c757d",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px"
  },
  footer: {
    marginTop: "30px",
    padding: "15px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#495057"
  }
};

// Add animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AxisOsCRUD;

// const AxisOsCRUD = () => {
//     return (
//         <>
//              <h1>CRUD Operation Using AxisOs </h1>       
//         </>
//     )
// }