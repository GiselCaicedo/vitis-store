import React, { useEffect, useState, useRef } from 'react';
import { getUsers } from '@exp/services/conexion';

const SearchBar = ({ onSelectUser }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        
        if (Array.isArray(response)) {
          setUsuarios(response);
          setFilteredUsers(response);
        } else {
          console.error('El resultado de getUsers no es un array:', response);
          setUsuarios([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
  
    fetchUsers();
  }, []);
  

  useEffect(() => {
    if (searchTerm && Array.isArray(usuarios)) {
      const filtered = usuarios.filter(user =>
        user.UserName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usuarios);
    }
  }, [searchTerm, usuarios]);
  
  const handleSelectUser = (userName, event) => {
    event.preventDefault();
    setSearchTerm(userName);

    setTimeout(() => {
      setShowDropdown(false);
    }, 150);  

    const selectedUser = usuarios.find(user => user.UserName === userName);
    onSelectUser(selectedUser);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-full max-w-md mx-auto mt-10" ref={dropdownRef}>
      <label
        className={`absolute left-3 top-2 transition-all duration-200 ease-in-out ${searchTerm
            ? 'text-xs text-gray-400 -translate-y-4'
            : 'text-sm text-gray-500'
          }`}
      >
        Buscar Usuario
      </label>
      <input
        type="text"
        className="w-full p-3 pt-6 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Escribe para buscar usuarios"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto" style={{ 'background': 'white' }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={`user-${user.UserID}`}
                onClick={(e) => handleSelectUser(user.UserName, e)}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {user.UserName}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500">No se encontraron usuarios</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
