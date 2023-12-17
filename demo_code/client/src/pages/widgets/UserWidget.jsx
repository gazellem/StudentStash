import { Card, CardContent, CardActionArea, Typography, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.username}`); // Redirect to listing page
  };



  return (
      <Card onClick={handleClick} sx={{ cursor: 'pointer', marginBottom: 2, boxShadow: 3 }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body2" gutterBottom>

            User photo

            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
  );
};

export default UserWidget;