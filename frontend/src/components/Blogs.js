import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Blog from "./Blog";
import { Box ,} from "@mui/system";
import { Button, TextField } from '@mui/material';


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const sendRequest = async () => {
    const res = await axios.get("http://localhost:5000/api/blog").catch(err => console.log(err));
    const data = await res.data;
    return data;
  }

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/api/blog/search?query=${searchQuery}`).catch(err => console.log(err));
    const data = await res.data;
    setBlogs(data);
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If the search query is empty, fetch all blogs
      sendRequest().then(data => setBlogs(data.blogs));
    } else {
      // If there's a search query, perform the search
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <Box style={{  padding: '20px' }}>
      {/* Search Bar */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
        <TextField
          label="Search Blogs"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} ml={2}>
          Search
        </Button>
      </Box>

      {/* Display Blogs */}
      {blogs.map((blog, index) => (
        <Blog
          key={blog._id}
          isUser={localStorage.getItem("userId") === blog.user._id}
          title={blog.title}
          description={blog.description}
          imageURL={blog.image}
          userName={blog.user.name}
        />
      ))}
    </Box>
  )
}

export default Blogs;