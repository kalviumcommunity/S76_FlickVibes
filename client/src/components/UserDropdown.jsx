import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                
                console.log('Fetching users with headers:', headers);
                // const response = await axios.get('http://localhost:3000/api/users', { headers });
                const response = await axios.get('http://localhost:3000/api/sql/users', { headers });

                console.log('Users response:', response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.response || error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    // const handleChange = (e) => {
    //     const value = e.target.value;
    //     setSelectedValue(value);
    //     onSelectUser(value);
    // };
    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
        onSelectUser(value); 
    };
    

    return (
        <div className="user-dropdown">
            <select 
                value={selectedValue}
                onChange={handleChange} 
                className="user-select"
            >
                <option value="">All Users</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

UserDropdown.propTypes = {
    onSelectUser: PropTypes.func.isRequired
};

export default UserDropdown;