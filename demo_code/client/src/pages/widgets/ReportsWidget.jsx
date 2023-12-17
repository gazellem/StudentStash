import React, {useState} from 'react';
import { Box, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import ReportWidget from "./ReportWidget";

const ReportsWidget = () => {

    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const [reports, setReports] = useState([]);


    const getPosts = async () => {
        const response = await fetch("http://localhost:3500/reports/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log(data);
        setReports(data)
    };


    useEffect(() => {
        getPosts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box sx={{ mt: 2, mx: 'auto', width: '100%', maxWidth: 600 }}>
            <Grid container spacing={2} justifyContent="center">
                {reports.map((report) => (
                    <Grid item key={report._id} xs={6}>
                        <Card elevation={3} sx={{ '&:hover': { boxShadow: 6 } }}>
                            <CardContent>
                                <ReportWidget report={report} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReportsWidget;