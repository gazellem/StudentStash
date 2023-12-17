import React from 'react';
import { Box, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId}) => {

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3500/listings", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    dispatch(setPosts({ posts: data ,token,user}));
  };


  useEffect(() => {
      getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
        <Grid container spacing={2} justifyContent="center">
          {posts.map((listing) => (
              <Grid item key={listing._id} xs={6}>
                <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                    <CardContent>
                      <PostWidget listing={listing} />
                    </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default PostsWidget;