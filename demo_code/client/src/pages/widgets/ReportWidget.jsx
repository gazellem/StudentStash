import { Card, CardContent, CardActionArea, Typography, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ReportWidget = ({ report }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/report/${report._id}`); // Redirect to report page
    };



    return (
        <Card onClick={handleClick} sx={{ cursor: 'pointer', marginBottom: 2, boxShadow: 3 }}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Reported User: {report.reported_user.username}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Report Content: {report.description}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Date: {report.date}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ReportWidget;